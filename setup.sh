#!/usr/bin/env bash
# EduMentor one-shot local setup.
#
# Pakai:
#   curl -fsSL https://raw.githubusercontent.com/HazimKhairi/edumentor/main/setup.sh -o setup.sh && bash setup.sh
#
# Script ni akan: clone repo (kalau belum), install Vercel CLI, login,
# link ke project Vercel, tarik semua env vars (.env.local), npm install
# (prisma generate jalan sendiri masa postinstall), pastu terus start
# npm run dev.

set -euo pipefail

REPO="https://github.com/HazimKhairi/edumentor.git"
DIR="edumentor"

say() { printf "\n\033[1m==> %s\033[0m\n" "$1"; }

command -v git >/dev/null 2>&1 || { echo "git tak jumpa. Install git dulu."; exit 1; }
command -v node >/dev/null 2>&1 || { echo "Node.js tak jumpa. Install Node 20+ dulu: https://nodejs.org"; exit 1; }

NODE_MAJOR=$(node -v | sed 's/v\([0-9]*\).*/\1/')
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "Node $(node -v) terlalu lama, perlukan v20 ke atas."
  exit 1
fi

# 1. Clone, atau guna folder sedia ada kalau script dijalankan dari dalam repo
if [ -f package.json ] && grep -q '"name": "edumentor"' package.json; then
  say "Dah berada dalam folder edumentor, skip clone"
  DIR="."
else
  if [ ! -d "$DIR" ]; then
    say "Clone repo"
    git clone "$REPO" "$DIR"
  else
    say "Folder $DIR dah wujud, guna yang tu"
  fi
  cd "$DIR"
fi

# Pastikan clone sedia ada dapat file terbaru (contoh: env.local.enc)
say "Update repo"
git pull --ff-only

# Pilih database untuk local run
say "Pilih database"
echo "  [1] MySQL XAMPP (default), data demo, boleh tengok guna phpMyAdmin"
echo "  [2] Neon production, data LIVE website edumentor.my (hati-hati)"
read -r -p "Pilihan (Enter untuk 1): " db_choice
USE_MYSQL=1
[ "$db_choice" = "2" ] && USE_MYSQL=0

# 2a-pre. Kalau .env.local sedia ada tapi tak lengkap (versi lama), buang
# supaya di-decrypt semula dari env.local.enc terkini.
if [ -f .env.local ] && [ -f env.local.enc ]; then
  stale=0
  grep -q "^AUTH_SECRET=" .env.local || stale=1
  grep -q "^DATABASE_URL=" .env.local || stale=1
  # Nak Neon tapi env dah di-tukar ke MySQL → decrypt semula
  if [ "$USE_MYSQL" = "0" ] && grep -q '^DATABASE_URL=.mysql:' .env.local; then stale=1; fi
  if [ "$stale" = "1" ]; then
    say ".env.local lama tak sesuai, akan decrypt semula"
    rm -f .env.local
  fi
fi

# 2a. Kalau ada env.local.enc (env vars di-encrypt AES-256 dalam repo),
# decrypt jadi .env.local. Passphrase diberi oleh admin secara berasingan —
# jangan sesekali commit passphrase atau .env.local plain.
if [ ! -f .env.local ] && [ -f env.local.enc ]; then
  command -v openssl >/dev/null 2>&1 || { echo "openssl tak jumpa."; exit 1; }
  say "Decrypt env vars (minta passphrase dari admin)"
  read -r -s -p "Passphrase: " pass; echo
  if ! openssl enc -d -aes-256-cbc -pbkdf2 -in env.local.enc -out .env.local -pass "pass:$pass"; then
    rm -f .env.local
    echo "Passphrase salah. Run semula dan cuba lagi."
    exit 1
  fi
fi

# 2-4. Env vars. Kalau .env.local dah ada (contoh: dihantar terus oleh admin),
# skip terus semua step Vercel — machine ni tak perlu login atau simpan
# sebarang token Vercel.
if [ -f .env.local ]; then
  say ".env.local dah ada, skip login Vercel"
else
  if ! command -v vercel >/dev/null 2>&1; then
    say "Install Vercel CLI"
    npm i -g vercel@latest
  fi

  # Login kalau belum (browser akan terbuka) — mesti akaun yang ada access
  # ke project edumentor
  if ! vercel whoami >/dev/null 2>&1; then
    say "Login Vercel"
    vercel login
  fi

  say "Link ke project edumentor"
  vercel link --yes --project edumentor

  say "Tarik env vars ke .env.local"
  vercel env pull .env.local --yes
fi

# 5. Dependencies (postinstall auto-run prisma generate)
say "npm install"
npm install

# 6. Mode MySQL XAMPP: tukar provider, buat table, isi data demo
if [ "$USE_MYSQL" = "1" ]; then
  say "Check MySQL XAMPP (port 3306)"
  if ! (exec 3<>/dev/tcp/127.0.0.1/3306) 2>/dev/null; then
    echo "MySQL tak jalan. Start MySQL dalam XAMPP Control Panel, pastu run semula."
    exit 1
  fi

  # Schema variant MySQL (auto-jana, tak masuk git)
  sed 's/provider = "postgresql"/provider = "mysql"/' prisma/schema.prisma > prisma/schema.mysql.prisma

  # Point DATABASE_URL ke MySQL local, baris env lain kekal
  grep -v "^DATABASE_URL=" .env.local > .env.local.tmp
  echo 'DATABASE_URL="mysql://root:@localhost:3306/edumentor"' >> .env.local.tmp
  mv .env.local.tmp .env.local

  say "Buat database + table dalam MySQL"
  npx prisma db push --schema prisma/schema.mysql.prisma

  say "Isi data demo (seed)"
  npm run db:seed
fi

# 7. Doctor: diagnostic check, punca masalah nampak terus kat sini
say "Doctor check"
node scripts/doctor.mjs

# 8. UI database
if [ "$USE_MYSQL" = "1" ]; then
  say "Tengok database: http://localhost/phpmyadmin (database: edumentor)"
else
  say "Start Prisma Studio, http://localhost:5555"
  (npx prisma studio >/dev/null 2>&1 &)
fi

# 9. Pastikan port 3000 tak dipegang dev server lama — punca klasik
# "env dah betul tapi error sama je": server lama yang masih serve.
stale_pid=$(lsof -ti tcp:3000 2>/dev/null | sed -n 1p)
if [ -n "$stale_pid" ]; then
  say "Port 3000 dipegang process lama (PID $stale_pid), dihentikan"
  kill -9 "$stale_pid" 2>/dev/null || true
  sleep 1
fi

# 10. Terus jalankan dev server
say "Siap. Start dev server (Ctrl+C untuk berhenti)"
say "App: http://localhost:3000"
npm run dev
