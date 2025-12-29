Add-Type -AssemblyName System.Drawing

$favicons = @(
    "public\favicon-192.png",
    "public\favicon-512.png"
)

foreach ($favicon in $favicons) {
    if (Test-Path $favicon) {
        $img = [System.Drawing.Image]::FromFile((Resolve-Path $favicon))
        $name = Split-Path $favicon -Leaf
        Write-Output "$name - Actual: $($img.Width)x$($img.Height)"
        $img.Dispose()
    } else {
        Write-Output "$favicon - NOT FOUND"
    }
}
