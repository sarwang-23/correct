@echo off
setlocal
cd /d "%~dp0scale-api"
where node >nul 2>nul || (echo Node.js 22.16+ or 24+ is required. & pause & exit /b 1)
where docker >nul 2>nul || (echo Docker Desktop with Compose is required and must be running. & pause & exit /b 1)
echo.
echo [1/3] Preparing LOCAL PostgreSQL demo environment...
call npm.cmd run setup
if errorlevel 1 goto failed
call npm.cmd run env:check
if errorlevel 1 goto failed
echo.
echo [2/3] Starting PostgreSQL, storage, scanner, API and worker...
call npm.cmd run local:up
if errorlevel 1 goto failed
echo.
echo [3/3] Current service status:
call npm.cmd run local:status
echo.
set "APP_URL=http://localhost:5000"
for /f "tokens=1,* delims==" %%A in (.env) do if "%%A"=="PUBLIC_BASE_URL" set "APP_URL=%%B"
echo Backend:    %APP_URL%
echo University: %APP_URL%/university
echo Imports:     %APP_URL%/university/imports
echo Operations:  %APP_URL%/operations
echo.
echo For a NEW university only, run:
echo   cd scale-api
 echo   npm.cmd run local:provision
echo.
echo No Neon database is used by this launcher.
pause
exit /b 0
:failed
echo.
echo Startup stopped. Read the error above. Do not delete Docker volumes to fix configuration errors.
pause
exit /b 1
