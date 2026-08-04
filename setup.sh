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

# 6. Prisma Studio (UI database, ganti phpMyAdmin) di background
say "Start Prisma Studio, http://localhost:5555"
(npx prisma studio >/dev/null 2>&1 &)

# 7. Terus jalankan dev server
say "Siap. Start dev server (Ctrl+C untuk berhenti)"
say "App: http://localhost:3000 | Database UI: http://localhost:5555"
npm run dev
