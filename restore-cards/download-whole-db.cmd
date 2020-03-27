set PGPASSWORD=crazysalamanderslime
pg_dump --host keyswap-prod.cik0ar7sipfl.us-west-2.rds.amazonaws.com --username coraythan --format c --no-unlogged-table-data --file .\restore-cards\full-db.dump keyswap
