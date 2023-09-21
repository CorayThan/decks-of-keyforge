set PGPASSWORD=postgres
pg_dump --username postgres --no-owner --format p --no-unlogged-table-data --file .\local-db-dump\dok-sql-dump.sql keyswap
:: pg_dump --username postgres --no-owner --format d --jobs 4 --data-only --no-unlogged-table-data --file .\local-db-dump keyswap
