$body = @{ email = 'devops@digitaltwin.com'; password = 'password123' } | ConvertTo-Json
try {
    $r = Invoke-RestMethod -Uri 'http://localhost:8090/auth/login' -Method POST -ContentType 'application/json' -Body $body
    Write-Host "GATEWAY STATUS: OK"
    Write-Host "Role: $($r.role)"
    Write-Host "Name: $($r.name)"
    $tok = $r.token
    if ($tok) { Write-Host "Token (first 20): $($tok.Substring(0, [Math]::Min(20, $tok.Length)))..." }
} catch {
    Write-Host "GATEWAY STATUS: FAILED"
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Host "HTTP: $($_.Exception.Response.StatusCode.value__)"
    }
}
