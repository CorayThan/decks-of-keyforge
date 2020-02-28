set PGPASSWORD=crazysalamanderslime
pg_dump --host keyswap-prod.cik0ar7sipfl.us-west-2.rds.amazonaws.com --username coraythan --format c --no-unlogged-table-data --file .\restore-cards\full-db.dump keyswap

set PGPASSWORD=postgres
pg_restore -h localhost -U postgres --clean --if-exists --no-tablespaces --no-privileges --no-owner -d keyswap .\restore-cards\full-db.dump
