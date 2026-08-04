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

# Semua output masuk log sekali, senang trace bila ada masalah
$LogPath = Join-Path $env:USERPROFILE "edumentor-setup.log"
try { Start-Transcript -Path $LogPath -Append | Out-Null } catch {}

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

    # Pilih database untuk local run
    Say "Pilih database"
    Write-Host "  [1] MySQL XAMPP (default), data demo, boleh tengok guna phpMyAdmin"
    Write-Host "  [2] Neon production, data LIVE website edumentor.my (hati-hati)"
    $dbChoice = Read-Host "Pilihan (Enter untuk 1)"
    $UseMysql = ($dbChoice -ne "2")

    # 2a-pre. Kalau .env.local sedia ada tapi tak lengkap (versi lama), buang
    # supaya di-decrypt semula dari env.local.enc yang terkini.
    if ((Test-Path ".env.local") -and (Test-Path "env.local.enc")) {
        $hasSecret = Select-String -Path ".env.local" -Pattern "^AUTH_SECRET=" -Quiet
        $hasDb = Select-String -Path ".env.local" -Pattern "^DATABASE_URL=" -Quiet
        $isMysqlEnv = Select-String -Path ".env.local" -Pattern "^DATABASE_URL=.mysql:" -Quiet
        # Tak lengkap, atau nak Neon tapi env dah di-tukar ke MySQL → decrypt semula
        if ((-not ($hasSecret -and $hasDb)) -or ((-not $UseMysql) -and $isMysqlEnv)) {
            Say ".env.local lama tak sesuai, akan decrypt semula"
            Remove-Item ".env.local"
        }
    }

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

    # 6. Mode MySQL XAMPP: tukar provider, buat table, isi data demo
    if ($UseMysql) {
        Say "Check MySQL XAMPP (port 3306)"
        $tcp = New-Object Net.Sockets.TcpClient
        try { $tcp.Connect("127.0.0.1", 3306) } catch {}
        if (-not $tcp.Connected) {
            throw "MySQL tak jalan. Buka XAMPP Control Panel, tekan Start pada MySQL, pastu run semula one-liner."
        }
        $tcp.Close()

        # Schema variant MySQL (auto-jana, tak masuk git)
        (Get-Content "prisma/schema.prisma" -Raw) -replace 'provider = "postgresql"', 'provider = "mysql"' |
            Set-Content "prisma/schema.mysql.prisma"

        # Point DATABASE_URL ke MySQL local, baris env lain kekal
        $envLines = Get-Content ".env.local" | Where-Object { $_ -notmatch "^DATABASE_URL=" }
        $envLines + 'DATABASE_URL="mysql://root:@localhost:3306/edumentor"' | Set-Content ".env.local"

        Say "Buat database + table dalam MySQL"
        npx.cmd prisma db push --schema prisma/schema.mysql.prisma
        Assert-LastExit "prisma db push"

        # db push TAK auto-generate client dalam Prisma 7 — kena generate
        # sendiri dengan schema mysql, kalau tak client kekal provider postgres
        Say "Generate Prisma client (mysql)"
        npx.cmd prisma generate --schema prisma/schema.mysql.prisma
        Assert-LastExit "prisma generate"

        Say "Isi data demo (seed)"
        npm.cmd run db:seed
        Assert-LastExit "db:seed"
    }

    # 7. Doctor: diagnostic check, punca masalah nampak terus kat sini
    Say "Doctor check"
    node scripts/doctor.mjs
    Assert-LastExit "doctor (baca baris PUNCA di atas)"

    # 8. UI database
    if ($UseMysql) {
        Say "Tengok database: http://localhost/phpmyadmin (database: edumentor)"
    } else {
        Say "Start Prisma Studio, http://localhost:5555"
        Start-Process -FilePath "cmd" -ArgumentList "/c npx prisma studio" -WorkingDirectory (Get-Location)
    }

    # 9. Pastikan port 3000 tak dipegang dev server lama — punca klasik
    # "env dah betul tapi error sama je": server lama yang masih serve.
    $stale = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
    if ($stale) {
        $stalePid = $stale[0].OwningProcess
        Write-Host "Port 3000 dipegang process lama (PID $stalePid), dihentikan" -ForegroundColor Yellow
        Stop-Process -Id $stalePid -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 1
    }

    # Buang cache build lama — kalau provider database bertukar (postgres ↔
    # mysql), cache .next boleh serve Prisma client lama dan error mengelirukan
    if (Test-Path ".next") {
        Remove-Item ".next" -Recurse -Force -ErrorAction SilentlyContinue
    }

    # 10. Terus jalankan dev server
    Say "Siap. Start dev server (Ctrl+C untuk berhenti)"
    Say "App: http://localhost:3000"
    npm.cmd run dev
}
catch {
    Write-Host ""
    Write-Host "Setup berhenti: $_" -ForegroundColor Red
    Write-Host "Selesaikan isu kat atas, pastu run semula one-liner yang sama." -ForegroundColor Yellow
    Write-Host "Log penuh: $LogPath" -ForegroundColor Yellow
}
finally {
    try { Stop-Transcript | Out-Null } catch {}
}
