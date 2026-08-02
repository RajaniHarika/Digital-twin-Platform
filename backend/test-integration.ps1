# =====================================================================
# Digital Twin Platform - Full Integration Test Script (ASCII Only)
# Tests: Auth (all 6 roles), Simulation, Risk, Cost, Topology APIs
# =====================================================================

$GATEWAY = "http://localhost:8090"
$AUTH_URL = "http://localhost:8081"
$SIM_URL  = "http://localhost:8085"
$RISK_URL = "http://localhost:8086"
$COST_URL = "http://localhost:8087"
$TOPO_URL = "http://localhost:8084"

$pass = 0
$fail = 0
$results = @()

function Test-Endpoint {
    param($Label, $Method, $Url, $Body = $null, $Token = $null, $ExpectedStatus = 200)

    $headers = @{ "Content-Type" = "application/json" }
    if ($Token) { $headers["Authorization"] = "Bearer $Token" }

    try {
        $splat = @{ Uri = $Url; Method = $Method; Headers = $headers; ErrorAction = "Stop"; TimeoutSec = 5; UseBasicParsing = $true }
        if ($Body) { $splat["Body"] = ($Body | ConvertTo-Json) }
        $res = Invoke-WebRequest @splat
        $status = $res.StatusCode
    } catch {
        $status = $_.Exception.Response.StatusCode.value__
    }

    $ok = $status -eq $ExpectedStatus
    if ($ok) { $script:pass++ } else { $script:fail++ }

    $script:results += [PSCustomObject]@{
        Test   = $Label
        Status = $status
        Result = if ($ok) { "[PASS]" } else { "[FAIL] (expected $ExpectedStatus)" }
    }
}

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "  Digital Twin Platform - Integration Test Suite" -ForegroundColor Cyan
Write-Host "============================================================`n" -ForegroundColor Cyan

# --- Wait for auth-service --------------------------------------------
Write-Host "Checking service availability..." -ForegroundColor Yellow

$services = @(
    @{ Name = "Auth Service (8081)";       Port = 8081 },
    @{ Name = "Simulation Service (8085)"; Port = 8085 },
    @{ Name = "Risk Service (8086)";       Port = 8086 },
    @{ Name = "Cost Service (8087)";       Port = 8087 },
    @{ Name = "Topology Service (8084)";   Port = 8084 },
    @{ Name = "API Gateway (8090)";        Port = 8090 }
)

foreach ($svc in $services) {
    $conn = Test-NetConnection -ComputerName localhost -Port $svc.Port -InformationLevel Quiet -WarningAction SilentlyContinue
    if ($conn) {
        Write-Host "  [UP]   $($svc.Name)" -ForegroundColor Green
    } else {
        Write-Host "  [DOWN] $($svc.Name) - tests will show expected failures" -ForegroundColor Yellow
    }
}

# --- Section 1: Auth - Register & Login all 6 roles ------------------
Write-Host "`n[1] AUTH SERVICE - Register & Login (6 Roles)" -ForegroundColor Magenta

$roles = @(
    @{ display = "Admin";            enum = "ADMIN" },
    @{ display = "DevOps Engineer";  enum = "DEVOPS_ENGINEER" },
    @{ display = "Cloud Engineer";   enum = "CLOUD_ENGINEER" },
    @{ display = "Backend Engineer"; enum = "BACKEND_ENGINEER" },
    @{ display = "Project Manager";  enum = "PROJECT_MANAGER" },
    @{ display = "SRE Engineer";     enum = "SRE_ENGINEER" }
)

$tokens = @{}

foreach ($r in $roles) {
    $email = "test_$($r.enum.ToLower())@digitaltwin.com"
    $pwd   = "Test@1234!"

    # Register (201 or 200; may already exist -> ignore)
    try {
        Invoke-RestMethod -Uri "$AUTH_URL/auth/register" -Method Post -ContentType "application/json" -TimeoutSec 5 `
            -Body (@{ name = $r.display; email = $email; password = $pwd; role = $r.enum } | ConvertTo-Json) | Out-Null
    } catch {}

    # Login
    try {
        $res = Invoke-RestMethod -Uri "$AUTH_URL/auth/login" -Method Post -ContentType "application/json" -TimeoutSec 5 `
            -Body (@{ email = $email; password = $pwd } | ConvertTo-Json)
        $tokens[$r.enum] = $res.token

        $roleField = if ($res.role) { $res.role } else { "N/A" }
        $nameField = if ($res.name) { $res.name } else { "N/A" }

        $script:pass++
        $script:results += [PSCustomObject]@{
            Test   = "Login [$($r.display)] -> role=$roleField name=$nameField"
            Status = 200
            Result = "[PASS]"
        }
    } catch {
        $script:fail++
        $script:results += [PSCustomObject]@{
            Test   = "Login [$($r.display)]"
            Status = $_.Exception.Response.StatusCode.value__
            Result = "[FAIL]"
        }
    }
}

# --- Section 2: JWT Role Enforcement ---------------------------------
Write-Host "[2] AUTH SERVICE - Role Enforcement (RBAC)" -ForegroundColor Magenta

$roleEndpoints = @(
    @{ role = "ADMIN";            path = "/admin" },
    @{ role = "DEVOPS_ENGINEER";  path = "/devops" },
    @{ role = "CLOUD_ENGINEER";   path = "/cloud" },
    @{ role = "BACKEND_ENGINEER"; path = "/backend" },
    @{ role = "PROJECT_MANAGER";  path = "/manager" },
    @{ role = "SRE_ENGINEER";     path = "/sre" }
)

foreach ($ep in $roleEndpoints) {
    $token = $tokens[$ep.role]
    if ($token) {
        Test-Endpoint "RBAC [$($ep.role)] -> own endpoint" "GET" "$AUTH_URL$($ep.path)" -Token $token -ExpectedStatus 200
        # Try wrong endpoint (next role)
        $wrongPath = if ($ep.path -eq "/admin") { "/devops" } else { "/admin" }
        Test-Endpoint "RBAC [$($ep.role)] -> wrong endpoint -> 403" "GET" "$AUTH_URL$wrongPath" -Token $token -ExpectedStatus 403
    }
}

# --- Section 3: API Gateway Routes ------------------------------------
Write-Host "[3] API GATEWAY - Route Forwarding (8090)" -ForegroundColor Magenta

$adminToken = $tokens["ADMIN"]
Test-Endpoint "Gateway -> /auth/login route" "POST" "$GATEWAY/auth/login" `
    -Body @{ email = "test_admin@digitaltwin.com"; password = "Test@1234!" } -ExpectedStatus 200

if ($adminToken) {
    Test-Endpoint "Gateway -> /api/v1/simulations (authenticated)" "GET" "$GATEWAY/api/v1/simulations" -Token $adminToken
    Test-Endpoint "Gateway -> /api/v1/risks (authenticated)"       "GET" "$GATEWAY/api/v1/risks"       -Token $adminToken
    Test-Endpoint "Gateway -> /api/costs (authenticated)"           "GET" "$GATEWAY/api/costs"           -Token $adminToken
    Test-Endpoint "Gateway -> /api/v1/topology/health (auth)"       "GET" "$GATEWAY/api/v1/topology/health" -Token $adminToken
    Test-Endpoint "Gateway -> no token -> 401"                       "GET" "$GATEWAY/api/v1/simulations" -ExpectedStatus 401
}

# --- Section 4: Simulation Service ------------------------------------
Write-Host "[4] SIMULATION SERVICE - CRUD (8085)" -ForegroundColor Magenta

$devopsToken = $tokens["DEVOPS_ENGINEER"]
if ($devopsToken) {
    $newSim = @{ simulationName = "Integration Test Sim"; environment = "STAGING"; status = "PENDING"; description = "Test simulation from integration script" }
    $createdSimId = $null
    try {
        $created = Invoke-RestMethod -Uri "$SIM_URL/api/v1/simulations" -Method Post -ContentType "application/json" -TimeoutSec 5 `
            -Headers @{ Authorization = "Bearer $devopsToken" } -Body ($newSim | ConvertTo-Json)
        $createdSimId = $created.id
        $script:pass++
        $script:results += [PSCustomObject]@{ Test = "Simulation CREATE"; Status = 200; Result = "[PASS] (id=$createdSimId)" }
    } catch {
        $script:fail++
        $script:results += [PSCustomObject]@{ Test = "Simulation CREATE"; Status = "ERR"; Result = "[FAIL]" }
    }

    Test-Endpoint "Simulation GET ALL" "GET" "$SIM_URL/api/v1/simulations" -Token $devopsToken
    if ($createdSimId) {
        Test-Endpoint "Simulation GET BY ID ($createdSimId)" "GET" "$SIM_URL/api/v1/simulations/$createdSimId" -Token $devopsToken
        Test-Endpoint "Simulation DELETE ($createdSimId)"    "DELETE" "$SIM_URL/api/v1/simulations/$createdSimId" -Token $devopsToken -ExpectedStatus 204
    }
}

# --- Section 5: Risk Service -------------------------------------------
Write-Host "[5] RISK SERVICE - CRUD (8086)" -ForegroundColor Magenta

$sreToken = $tokens["SRE_ENGINEER"]
if ($sreToken) {
    $newRisk = @{ simulationId = 1; applicationName = "Digital-Twin-Core"; riskScore = 45.0; riskLevel = "MEDIUM"; impact = "MODERATE"; recommendation = "Monitor load"; status = "OPEN" }
    $createdRiskId = $null
    try {
        $created = Invoke-RestMethod -Uri "$RISK_URL/api/v1/risks" -Method Post -ContentType "application/json" -TimeoutSec 5 `
            -Headers @{ Authorization = "Bearer $sreToken" } -Body ($newRisk | ConvertTo-Json)
        $createdRiskId = $created.id
        $script:pass++
        $script:results += [PSCustomObject]@{ Test = "Risk CREATE"; Status = 200; Result = "[PASS] (id=$createdRiskId)" }
    } catch {
        $script:fail++
        $script:results += [PSCustomObject]@{ Test = "Risk CREATE"; Status = "ERR"; Result = "[FAIL]" }
    }

    Test-Endpoint "Risk GET ALL"    "GET" "$RISK_URL/api/v1/risks" -Token $sreToken
    Test-Endpoint "Risk GET /health" "GET" "$RISK_URL/api/v1/risks/health" -Token $sreToken
    if ($createdRiskId) {
        Test-Endpoint "Risk DELETE ($createdRiskId)" "DELETE" "$RISK_URL/api/v1/risks/$createdRiskId" -Token $sreToken -ExpectedStatus 204
    }
}

# --- Section 6: Cost Service -------------------------------------------
Write-Host "[6] COST SERVICE - CRUD + Analytics (8087)" -ForegroundColor Magenta

$cloudToken = $tokens["CLOUD_ENGINEER"]
if ($cloudToken) {
    $newCost = @{ resourceType = "COMPUTE"; resourceId = "EC2-1001"; resourceName = "Application Server"; cost = 150.50; currency = "USD"; billingDate = "2026-08-01"; region = "ap-south-1"; tag = "production"; status = "NORMAL" }
    $createdCostId = $null
    try {
        $created = Invoke-RestMethod -Uri "$COST_URL/api/costs" -Method Post -ContentType "application/json" -TimeoutSec 5 `
            -Headers @{ Authorization = "Bearer $cloudToken" } -Body ($newCost | ConvertTo-Json)
        $createdCostId = $created.id
        $script:pass++
        $script:results += [PSCustomObject]@{ Test = "Cost CREATE"; Status = 200; Result = "[PASS] (id=$createdCostId)" }
    } catch {
        $script:fail++
        $script:results += [PSCustomObject]@{ Test = "Cost CREATE"; Status = "ERR"; Result = "[FAIL]" }
    }

    Test-Endpoint "Cost GET ALL"                     "GET" "$COST_URL/api/costs" -Token $cloudToken
    Test-Endpoint "Cost GET /summary"                "GET" "$COST_URL/api/costs/summary" -Token $cloudToken
    Test-Endpoint "Cost GET /total"                  "GET" "$COST_URL/api/costs/total?from=2026-01-01&to=2026-12-31" -Token $cloudToken
    Test-Endpoint "Cost GET /by-type/COMPUTE"        "GET" "$COST_URL/api/costs/by-type/COMPUTE" -Token $cloudToken
    Test-Endpoint "Cost GET /by-region/ap-south-1"  "GET" "$COST_URL/api/costs/by-region/ap-south-1" -Token $cloudToken
    if ($createdCostId) {
        Test-Endpoint "Cost DELETE ($createdCostId)" "DELETE" "$COST_URL/api/costs/$createdCostId" -Token $cloudToken -ExpectedStatus 204
    }
}

# --- Section 7: Topology Service --------------------------------------
Write-Host "[7] TOPOLOGY SERVICE - Read-Only Endpoints (8084)" -ForegroundColor Magenta

$backendToken = $tokens["BACKEND_ENGINEER"]
if ($backendToken) {
    Test-Endpoint "Topology GET /health"      "GET" "$TOPO_URL/api/v1/topology/health"      -Token $backendToken
    Test-Endpoint "Topology GET /nodes"       "GET" "$TOPO_URL/api/v1/topology/nodes"       -Token $backendToken
    Test-Endpoint "Topology GET /pods"        "GET" "$TOPO_URL/api/v1/topology/pods"        -Token $backendToken
    Test-Endpoint "Topology GET /deployments" "GET" "$TOPO_URL/api/v1/topology/deployments" -Token $backendToken
    Test-Endpoint "Topology GET /services"    "GET" "$TOPO_URL/api/v1/topology/services"    -Token $backendToken
    Test-Endpoint "Topology GET /graph"       "GET" "$TOPO_URL/api/v1/topology/graph"       -Token $backendToken
}

# --- Results ----------------------------------------------------------
Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "  TEST RESULTS" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

$results | Format-Table -AutoSize

$total = $pass + $fail
Write-Host "`n  Total: $total  |  " -NoNewline
Write-Host "Passed: $pass" -NoNewline -ForegroundColor Green
Write-Host "  |  " -NoNewline
Write-Host "Failed: $fail" -ForegroundColor $(if ($fail -eq 0) { "Green" } else { "Red" })
Write-Host ""

if ($fail -eq 0) {
    Write-Host "  [SUCCESS] ALL TESTS PASSED - Integration is complete!" -ForegroundColor Green
} else {
    Write-Host "  [WARN]    Some tests failed. Check if all services are running." -ForegroundColor Yellow
    Write-Host "  Hint: Start with auth-service, then other services, then run this script again." -ForegroundColor Gray
}
Write-Host ""
