@echo off
setlocal disableDelayedExpansion
sc query|findstr "DISPLAY_NAME"|findstr /C:"SQL Server (" > %temp%/server.txt
>%temp%/servername.txt (for /f " tokens=2 delims=()" %%A in ('sc query|findstr "DISPLAY_NAME"|findstr /C:"SQL Server ("') do @echo %computername%\%%A)
del %temp%/server.txt
