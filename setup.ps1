# EduMentor one-shot local setup (Windows PowerShell).
#
# Pakai (PowerShell):
#   irm https://raw.githubusercontent.com/HazimKhairi/edumentor/main/setup.ps1 | iex
#
# Script ni akan: clone repo (kalau belum), install Vercel CLI, login,
# link ke project Vercel, tarik semua env vars (.env.local), npm install
# (prisma generate jalan sendiri masa postinstall). Lepas siap: npm run dev.

$ErrorActionPreference = "Stop"

$Repo = "https://github.com/HazimKhairi/edumentor.git"
$Dir = "edumentor"

function Say($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }

function Assert-LastExit($what) {
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Gagal: $what" -ForegroundColor Red
        exit 1
    }
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "git tak jumpa. Install Git for Windows dulu: https://git-scm.com" -ForegroundColor Red
    exit 1
}
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js tak jumpa. Install Node 20+ dulu: https://nodejs.org" -ForegroundColor Red
    exit 1
}

$nodeMajor = [int]((node -v) -replace "^v(\d+).*", '$1')
if ($nodeMajor -lt 20) {
    Write-Host "Node $(node -v) terlalu lama, perlukan v20 ke atas." -ForegroundColor Red
    exit 1
}

# 1. Clone, atau guna folder sedia ada kalau script dijalankan dari dalam repo
$inRepo = (Test-Path "package.json") -and (Select-String -Path "package.json" -Pattern '"name": "edumentor"' -Quiet)
if ($inRepo) {
    Say "Dah berada dalam folder edumentor, skip clone"
    $Dir = "."
} else {
    if (-not (Test-Path $Dir)) {
        Say "Clone repo"
        git clone $Repo $Dir
        Assert-LastExit "git clone"
    } else {
        Say "Folder $Dir dah wujud, guna yang tu"
    }
    Set-Location $Dir
}

# 2. Vercel CLI
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Say "Install Vercel CLI"
    npm i -g vercel@latest
    Assert-LastExit "npm i -g vercel"
}

# 3. Login kalau belum (browser akan terbuka)
vercel whoami *> $null
if ($LASTEXITCODE -ne 0) {
    Say "Login Vercel"
    vercel login
    Assert-LastExit "vercel login"
}

# 4. Link folder ke project + tarik env vars dari Vercel
Say "Link ke project edumentor"
vercel link --yes --project edumentor
Assert-LastExit "vercel link"

Say "Tarik env vars ke .env.local"
vercel env pull .env.local --yes
Assert-LastExit "vercel env pull"

# 5. Dependencies (postinstall auto-run prisma generate)
Say "npm install"
npm install
Assert-LastExit "npm install"

Say "Siap semua."
if ($Dir -eq ".") {
    Write-Host "Jalankan: npm run dev"
} else {
    Write-Host "Jalankan: cd $Dir; npm run dev"
}
