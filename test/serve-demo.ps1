param(
    [int]$Port = 8080,
    [switch]$NoBrowser
)

$root = [System.IO.Path]::GetFullPath((Split-Path -Parent $MyInvocation.MyCommand.Path))
$listener = [System.Net.HttpListener]::new()
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

$contentTypes = @{
    '.html' = 'text/html; charset=utf-8'
    '.js' = 'text/javascript; charset=utf-8'
    '.css' = 'text/css; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'
    '.wasm' = 'application/wasm'
    '.bin' = 'application/octet-stream'
    '.txt' = 'text/plain; charset=utf-8'
}

function Get-ContentType([string]$path) {
    $extension = [System.IO.Path]::GetExtension($path).ToLowerInvariant()
    if ($contentTypes.ContainsKey($extension)) {
        return $contentTypes[$extension]
    }

    return 'application/octet-stream'
}

function Resolve-RequestPath([string]$absolutePath) {
    $decoded = [System.Uri]::UnescapeDataString($absolutePath.TrimStart('/'))
    if ([string]::IsNullOrWhiteSpace($decoded)) {
        return Join-Path $root 'teavm-javac-demo.html'
    }

    $safeRelativePath = $decoded.Replace('/', [System.IO.Path]::DirectorySeparatorChar)
    $candidate = Join-Path $root $safeRelativePath
    $fullPath = [System.IO.Path]::GetFullPath($candidate)

    if (-not $fullPath.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
        return $null
    }

    return $fullPath
}

try {
    $listener.Start()
    $url = "$prefix" + 'teavm-javac-demo.html'

    Write-Host "Serving $root at $prefix"
    Write-Host "Open $url"
    Write-Host 'Press Ctrl+C to stop.'

    if (-not $NoBrowser) {
        Start-Process $url | Out-Null
    }

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $response = $context.Response

        try {
            $path = Resolve-RequestPath $context.Request.Url.AbsolutePath
            if (-not $path -or -not (Test-Path -LiteralPath $path -PathType Leaf)) {
                $response.StatusCode = 404
                $payload = [System.Text.Encoding]::UTF8.GetBytes('Not Found')
                $response.ContentType = 'text/plain; charset=utf-8'
                $response.OutputStream.Write($payload, 0, $payload.Length)
                continue
            }

            $bytes = [System.IO.File]::ReadAllBytes($path)
            $response.StatusCode = 200
            $response.ContentType = Get-ContentType $path
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } catch {
            $response.StatusCode = 500
            $payload = [System.Text.Encoding]::UTF8.GetBytes($_.Exception.Message)
            $response.ContentType = 'text/plain; charset=utf-8'
            $response.OutputStream.Write($payload, 0, $payload.Length)
        } finally {
            $response.OutputStream.Close()
        }
    }
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
    $listener.Close()
}