@echo off
cd "%~dp0"
%~d0
cls
powershell -Command "& {Invoke-WebRequest -UseBasicParsing 'https://raw.githubusercontent.com/AQtun81/aqtun81.github.io/master/ps/hosts/MergeHosts.ps1' | Invoke-Expression}"
pause
@echo on