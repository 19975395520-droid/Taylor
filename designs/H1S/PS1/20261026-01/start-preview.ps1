$ErrorActionPreference = 'Stop'
$previewUrl = 'http://127.0.0.1:5173/'
try {
  $response = Invoke-WebRequest $previewUrl -UseBasicParsing -TimeoutSec 2
  if ($response.StatusCode -eq 200) { Start-Process $previewUrl; exit 0 }
} catch {}
$previewNode = (Get-Command node -ErrorAction Stop).Source
if (-not (Test-Path -LiteralPath (Join-Path $PSScriptRoot 'dist/index.html'))) {
  throw 'Preview build missing. Run npm run build in this folder first.'
}
Start-Process -FilePath $previewNode -ArgumentList @('"' + (Join-Path $PSScriptRoot 'preview-server.cjs') + '"') -WorkingDirectory $PSScriptRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $PSScriptRoot 'preview-server.log') -RedirectStandardError (Join-Path $PSScriptRoot 'preview-server-error.log')
for ($attempt = 0; $attempt -lt 20; $attempt++) {
  Start-Sleep -Milliseconds 250
  try {
    $response = Invoke-WebRequest $previewUrl -UseBasicParsing -TimeoutSec 1
    if ($response.StatusCode -eq 200) { Start-Process $previewUrl; exit 0 }
  } catch {}
}
throw 'Preview could not start. See preview-server-error.log in this folder.'
