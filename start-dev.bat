@echo off
echo ========================================
echo Starting Ecommerce Admin UI
echo ========================================

if not exist node_modules (
    echo Installing dependencies...
    call npm install
)

echo Starting Vite development server...
call npm run dev

pause