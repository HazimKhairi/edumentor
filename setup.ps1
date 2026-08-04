# EduMentor one-shot local setup (Windows PowerShell).
#
# Pakai (PowerShell):
#   irm https://raw.githubusercontent.com/HazimKhairi/edumentor/main/setup.ps1 | iex
#
# Script ni akan: clone repo (kalau belum), install Vercel CLI, login,
# link ke project Vercel, tarik semua env vars (.env.local), npm install
# (prisma generate jalan sendiri masa postinstall), pastu terus start
# npm run dev.
#
# Nota: jangan guna `exit` kat sini — bila script jalan melalui `irm | iex`,
# `exit` akan tutup seluruh tetingkap PowerShell. Guna throw + try/catch.
# Nota 2: panggil npm.cmd / vercel.cmd, bukan npm / vercel — PowerShell resolve
# nama tanpa extension ke shim .ps1, yang kena block bila execution policy
# Restricted (default Windows). Shim .cmd tak terkesan dengan policy tu.

$ErrorActionPreference = "Stop"

function Say($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }

function Assert-LastExit($what) {
    if ($LASTEXITCODE -ne 0) { throw "Gagal masa: $what" }
}

try {
    $Repo = "https://github.com/HazimKhairi/edumentor.git"
    $Dir = "edumentor"

    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        throw "git tak jumpa. Install Git for Windows dulu: https://git-scm.com (pastu buka semula PowerShell)"
    }
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        throw "Node.js tak jumpa. Install Node 20+ (LTS) dulu: https://nodejs.org (pastu buka semula PowerShell)"
    }

    $nodeMajor = [int]((node -v) -replace "^v(\d+).*", '$1')
    if ($nodeMajor -lt 20) {
        throw "Node $(node -v) terlalu lama, perlukan v20 ke atas: https://nodejs.org"
    }

    # 1. Clone, atau guna folder sedia ada kalau dah berada dalam repo
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

    # Pastikan clone sedia ada dapat file terbaru (contoh: env.local.enc)
    Say "Update repo"
    git pull --ff-only
    Assert-LastExit "git pull"

    # 2a. Kalau ada env.local.enc (env vars yang di-encrypt AES-256 dalam
    # repo), decrypt dia jadi .env.local. Passphrase diberi oleh admin secara
    # berasingan — jangan sesekali commit passphrase atau .env.local plain.
    if ((-not (Test-Path ".env.local")) -and (Test-Path "env.local.enc")) {
        $openssl = (Get-Command openssl -ErrorAction SilentlyContinue).Source
        if (-not $openssl) {
            $gitOpenssl = Join-Path $env:ProgramFiles "Git\usr\bin\openssl.exe"
            if (Test-Path $gitOpenssl) { $openssl = $gitOpenssl }
        }
        if (-not $openssl) {
            throw "openssl tak jumpa (sepatutnya datang dengan Git for Windows)."
        }
        Say "Decrypt env vars (minta passphrase dari admin)"
        $pass = Read-Host "Passphrase"
        & $openssl enc -d -aes-256-cbc -pbkdf2 -in env.local.enc -out .env.local -pass "pass:$pass"
        if ($LASTEXITCODE -ne 0) {
            Remove-Item ".env.local" -ErrorAction SilentlyContinue
            throw "Passphrase salah. Run semula one-liner dan cuba lagi."
        }
    }

    # 2-4. Env vars. Kalau .env.local dah ada (contoh: dihantar terus oleh
    # admin), skip terus semua step Vercel — machine ni tak perlu login atau
    # simpan sebarang token Vercel.
    if (Test-Path ".env.local") {
        Say ".env.local dah ada, skip login Vercel"
    } else {
        if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
            Say "Install Vercel CLI"
            npm.cmd i -g vercel@latest
            Assert-LastExit "npm i -g vercel"
        }

        # Login kalau belum (browser akan terbuka) — mesti akaun yang ada
        # access ke project edumentor. Redirect stderr DALAM cmd.exe, bukan
        # dalam PowerShell — PS 5.1 + ErrorActionPreference Stop akan throw
        # bila native command tulis ke stderr yang di-redirect (banner versi
        # Vercel pun masuk stderr).
        cmd /c "vercel whoami >NUL 2>&1"
        if ($LASTEXITCODE -ne 0) {
            Say "Login Vercel"
            vercel.cmd login
            Assert-LastExit "vercel login"
        }

        Say "Link ke project edumentor"
        vercel.cmd link --yes --project edumentor
        Assert-LastExit "vercel link"

        Say "Tarik env vars ke .env.local"
        vercel.cmd env pull .env.local --yes
        Assert-LastExit "vercel env pull"
    }

    # 5. Dependencies (postinstall auto-run prisma generate)
    Say "npm install"
    npm.cmd install
    Assert-LastExit "npm install"

    # 6. Terus jalankan dev server
    Say "Siap. Start dev server (Ctrl+C untuk berhenti)"
    Say "Bila dah naik, buka http://localhost:3000"
    npm.cmd run dev
}
catch {
    Write-Host ""
    Write-Host "Setup berhenti: $_" -ForegroundColor Red
    Write-Host "Selesaikan isu kat atas, pastu run semula one-liner yang sama." -ForegroundColor Yellow
}
