
set PGPASSWORD=postgres
pg_restore -h localhost -U postgres --clean --if-exists --no-tablespaces --no-privileges --no-owner -d keyswap ..\scripts-local \full-db-dump
