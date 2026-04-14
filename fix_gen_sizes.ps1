# Cap all large array sizes in .gen.ts files to browser-safe limits
$genFiles = Get-ChildItem -Path "src\content\problems\arrays" -Filter "*.gen.ts"

foreach ($file in $genFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Replace large ranges: rng.int(80000, 100000) -> rng.int(1000, 2000)
    $content = $content -replace 'rng\.int\(80000,\s*100000\)', 'rng.int(1000, 2000)'
    # Replace: rng.int(40000, 50000) -> rng.int(500, 1000)
    $content = $content -replace 'rng\.int\(40000,\s*50000\)', 'rng.int(500, 1000)'
    # Replace larger non-rng int arrays: intArray(10000, ...) -> intArray(500, ...)
    $content = $content -replace 'rng\.intArray\(10000,', 'rng.intArray(500,'
    # Replace: intArray(5000, ...) -> intArray(500, ...)  (for sorted arrays used as args)
    $content = $content -replace 'rng\.intArray\(5000,', 'rng.intArray(500,'
    # Replace sortedUniqueIntArray(5000, ...) -> sortedUniqueIntArray(500, ...)
    $content = $content -replace 'rng\.sortedUniqueIntArray\(5000,', 'rng.sortedUniqueIntArray(500,'
    # Replace sortedUniqueIntArray(100000, ...) -> sortedUniqueIntArray(1000, ...)
    $content = $content -replace 'rng\.sortedUniqueIntArray\(100000,', 'rng.sortedUniqueIntArray(1000,'
    # Replace: rng.int(80000, 100000) small variant -> rng.int(10, 2000)
    $content = $content -replace 'rng\.int\(n = isLarge \? rng\.int\(80000', 'rng.int(1000'
    # Fix missing-number: n = isLarge ? rng.int(80000, 100000) : ...
    $content = $content -replace 'rng\.int\(80000,\s*100000\)', 'rng.int(1000, 2000)'
    # Fix contains-duplicate unique sorted: sortedUniqueIntArray(100000, ...)
    $content = $content -replace 'rng\.sortedUniqueIntArray\(100000,', 'rng.sortedUniqueIntArray(1000,'
    # Fix: intArray(998, ...) stays (998 elements is fine)
    # Fix large static arrays: intArray(10000, ...) -> intArray(500, ...)
    $content = $content -replace 'rng\.intArray\(10000,', 'rng.intArray(500,'
    # Fix large static: rng.int(10, 5000) -> rng.int(10, 500)
    $content = $content -replace 'rng\.int\(10,\s*5000\)', 'rng.int(10, 500)'
    $content = $content -replace 'rng\.int\(5,\s*5000\)', 'rng.int(5, 500)'
    $content = $content -replace 'rng\.int\(2,\s*500\)', 'rng.int(2, 200)'
    
    Set-Content $file.FullName $content -NoNewline
    Write-Host "Fixed: $($file.Name)"
}
Write-Host "Done!"
