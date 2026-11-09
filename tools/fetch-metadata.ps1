#requires -Version 7
# 从洛谷题目页抓取题目的官方标题与难度，输出 tools/meta.json
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$source = Get-Content (Join-Path $PSScriptRoot 'source.json') -Raw | ConvertFrom-Json
$tmp = Join-Path $PSScriptRoot 'pages'
New-Item -ItemType Directory -Force -Path $tmp | Out-Null

$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
$jar = Join-Path $PSScriptRoot 'cookies.txt'

$pids = New-Object System.Collections.Generic.List[string]
foreach ($g in $source.groups) { foreach ($p in $g.problems) { if (-not $pids.Contains($p)) { $pids.Add($p) } } }
Write-Output ("total pids: " + $pids.Count)

$meta = @{}
$fail = @()
$i = 0
foreach ($pid in $pids) {
    $i++
    $ok = $false
    foreach ($attempt in 1..2) {
        $file = Join-Path $tmp "$pid.html"
        curl.exe -s -m 30 -L -A $ua -H 'Accept: text/html,application/xhtml+xml' -H 'Accept-Language: zh-CN,zh;q=0.9' -c $jar -b $jar -o $file "https://www.luogu.com.cn/problem/$pid"
        if (-not (Test-Path $file)) { continue }
        $html = [System.Text.Encoding]::UTF8.GetString([System.IO.File]::ReadAllBytes($file))
        $m = [regex]::Match($html, '<script id="lentille-context" type="application/json">(.*?)</script>', 'Singleline')
        if ($m.Success) {
            try {
                $j = $m.Groups[1].Value | ConvertFrom-Json
                $p = $j.data.problem
                if ($p -and $p.pid -eq $pid) {
                    $meta[$pid] = [ordered]@{ name = [string]$p.name; difficulty = [int]$p.difficulty }
                    $ok = $true
                }
            } catch { }
        }
        Remove-Item $file -Force -ErrorAction SilentlyContinue
        if ($ok) { break }
        Start-Sleep -Milliseconds 1200
    }
    if (-not $ok) { $fail += $pid; Write-Output ("FAIL " + $pid) }
    if ($i % 20 -eq 0) { Write-Output ("progress $i/$($pids.Count)") }
    Start-Sleep -Milliseconds 350
}

$meta | ConvertTo-Json -Depth 5 | Set-Content (Join-Path $PSScriptRoot 'meta.json') -Encoding UTF8
Write-Output ("ok=" + $meta.Count + " fail=" + $fail.Count)
if ($fail.Count -gt 0) { Write-Output ("failed pids: " + ($fail -join ',')) }
