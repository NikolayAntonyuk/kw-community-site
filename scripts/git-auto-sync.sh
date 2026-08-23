#!/bin/bash

# Auto-sync Git changes to production server
# Run this as a systemd service or cron job

REPO_DIR="/home/mykola/kw-community-site"
LOG_FILE="/var/log/kw-community-git-sync.log"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting git auto-sync..." >> "$LOG_FILE"

cd "$REPO_DIR" || exit 1

# Fetch latest from origin
git fetch origin >> "$LOG_FILE" 2>&1

# Check if local master is behind
LOCAL=$(git rev-parse master)
REMOTE=$(git rev-parse origin/master)

if [ "$LOCAL" != "$REMOTE" ]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] New commits detected. Pulling..." >> "$LOG_FILE"
  git pull origin master >> "$LOG_FILE" 2>&1

  # Run tests
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Running tests..." >> "$LOG_FILE"
  npm test >> "$LOG_FILE" 2>&1

  if [ $? -eq 0 ]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ Tests passed. Reloading service..." >> "$LOG_FILE"
    systemctl --user restart kw-community-site >> "$LOG_FILE" 2>&1
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ Service restarted successfully" >> "$LOG_FILE"
  else
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ❌ Tests failed! Reverting..." >> "$LOG_FILE"
    git reset --hard "$LOCAL" >> "$LOG_FILE" 2>&1
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ❌ Reverted to previous commit" >> "$LOG_FILE"
  fi
else
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] No new commits. Skipping." >> "$LOG_FILE"
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Git auto-sync completed" >> "$LOG_FILE"
