$baseUrl = "http://localhost:8081"
$roles = @(
    @{ name = "ADMIN"; endpoint = "/admin" },
    @{ name = "DEVOPS_ENGINEER"; endpoint = "/devops" },
    @{ name = "CLOUD_ENGINEER"; endpoint = "/cloud" },
    @{ name = "BACKEND_ENGINEER"; endpoint = "/backend" },
    @{ name = "PROJECT_MANAGER"; endpoint = "/manager" },
    @{ name = "SRE_ENGINEER"; endpoint = "/sre" }
)

Write-Host "Waiting for auth-service to start on 8081..."
$up = $false
for ($i=0; $i -lt 30; $i++) {
    $conn = Test-NetConnection -ComputerName localhost -Port 8081 -InformationLevel Quiet
    if ($conn) {
        $up = $true
        break
    }
    Start-Sleep -Seconds 1
}

if (-not $up) {
    Write-Host "Auth service did not start in time."
    exit 1
}
Write-Host "Auth service is UP!"

$results = @()

foreach ($role in $roles) {
    $username = "test_$($role.name.ToLower())"
    $password = "Password123!"
    
    # 1. Register
    $regBody = @{
        username = $username
        password = $password
        email = "$username@example.com"
        role = $role.name
    } | ConvertTo-Json
    
    try {
        Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $regBody -ContentType "application/json" | Out-Null
        Write-Host "Registered: $username"
    } catch {
        # Might already exist, that's fine
    }

    # 2. Login
    $loginBody = @{
        username = $username
        password = $password
    } | ConvertTo-Json
    
    $loginRes = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginRes.token
    
    # 3. Test Authorized Endpoint
    $authStatus = "FAILED"
    try {
        $res = Invoke-RestMethod -Uri "$baseUrl$($role.endpoint)" -Method Get -Headers @{ Authorization = "Bearer $token" }
        if ($res -like "*Access Granted*") {
            $authStatus = "SUCCESS (200 OK)"
        }
    } catch {
        $authStatus = $_.Exception.Response.StatusCode.value__
    }

    # 4. Test Unauthorized Endpoint (just test the next one in the array, wrapping around)
    $wrongRole = if ($role.name -eq "SRE_ENGINEER") { $roles[0] } else { $roles[$roles.IndexOf($role) + 1] }
    $unauthStatus = "FAILED"
    try {
        $res = Invoke-RestMethod -Uri "$baseUrl$($wrongRole.endpoint)" -Method Get -Headers @{ Authorization = "Bearer $token" }
        $unauthStatus = "UNEXPECTED SUCCESS"
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 403) {
            $unauthStatus = "SUCCESS (403 Forbidden)"
        } else {
            $unauthStatus = $_.Exception.Response.StatusCode.value__
        }
    }
    
    $results += [PSCustomObject]@{
        Role = $role.name
        User = $username
        AuthorizedTest = $authStatus
        UnauthorizedTest = $unauthStatus
    }
}

Write-Host "`n=== RBAC Verification Results ==="
$results | Format-Table -AutoSize
