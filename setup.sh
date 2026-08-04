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

# 2. Vercel CLI
if ! command -v vercel >/dev/null 2>&1; then
  say "Install Vercel CLI"
  npm i -g vercel@latest
fi

# 3. Login kalau belum (browser akan terbuka)
if ! vercel whoami >/dev/null 2>&1; then
  say "Login Vercel"
  vercel login
fi

# 4. Link folder ke project + tarik env vars dari Vercel
say "Link ke project edumentor"
vercel link --yes --project edumentor

say "Tarik env vars ke .env.local"
vercel env pull .env.local --yes

# 5. Dependencies (postinstall auto-run prisma generate)
say "npm install"
npm install

# 6. Terus jalankan dev server
say "Siap. Start dev server (Ctrl+C untuk berhenti)"
say "Bila dah naik, buka http://localhost:3000"
npm run dev
