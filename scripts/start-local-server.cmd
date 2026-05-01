@echo off
setlocal
cd /d "%~dp0.."
set NODE_ENV=production
"C:\Program Files\nodejs\node.exe" "node_modules\next\dist\bin\next" start --hostname 0.0.0.0 --port 3000 >> ".next-local-server.out.log" 2>> ".next-local-server.err.log"
