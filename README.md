
Running the project:

```
./gradlew bootRun
```

```
cd ui
yarn
npm run start
```


making the db in RDS:

RDS create database

postgres

only enable free tier

20GB

name: keyswap-{env}

master username: coraythan

publicly accessible yes

choose default VPC-security group

db name: keyswap

3 day backups

connecting with pgadmin

maintenance db keyswap
coraythan

## Export deck data to CSV

```
cd 'C:\Program Files\PostgreSQL\11\scripts\'
.\runpsql.bat
// server click enter
// database enter: keyswap
SET CLIENT_ENCODING TO 'utf8';

\COPY (select keyforge_id, name, expansion, house_names_string, sas_rating, synergy_rating, antisynergy_rating, aerc_score, amber_control, expected_amber, artifact_control, creature_control, efficiency, disruption, creature_protection, other, effective_power, raw_amber, action_count, upgrade_count, creature_count, power_level, chains, wins, losses, card_names from deck where registered = 'true') to 'C:\Users\Coray\Downloads\dok-decks.csv' DELIMITER ',' CSV HEADER;
```

Find it in downloads 


## Dump the manual card data tables

Run the `load-cards.cmd` with the Reload Cards run config.

```
set PGPASSWORD=password
pg_dump -h keyswap-prod.cik0ar7sipfl.us-west-2.rds.amazonaws.com -U coraythan -F c -a -t card_traits -t card_identifier -t extra_card_info -t card -t spoiler -t syn_trait_value -f .\restore-cards\extra-info.dump keyswap

set PGPASSWORD=postgres
psql -U postgres -d keyswap -f .\restore-cards\truncate-card-tables.sql
pg_restore -h localhost -U postgres -d keyswap .\restore-cards\extra-info.dump

```

## Kill long queries stuff
```
SELECT pg_cancel_backend(pg_stat_activity.pid)
from pg_stat_activity

WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes' and state = 'active';

SELECT
  pid,
  now() - pg_stat_activity.query_start AS duration,
  query,
  state
FROM pg_stat_activity
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes'; 
LIMIT 10;
```

## Refresh Primary Patreon account

Go to profile for coraythan

Unlink and relink with buttons.

## Make reduced size card images

Delete `*.png` in `/card-imgs/`. Uncomment line in RunOnStart. Run app. In `/card-imgs/` run:

`.\pngquant.exe --ext=.png --force 256 *.png`

upload to S3 public with headers: `Cache-Control: max-age=31536000`

## auto generate table info

Change `ddl-auto` in `application.yml` to `update`. `show-sql` to true. Run. Copy paste. Delete tables. Revert.

## copy db and reload it

```
set PGPASSWORD=password
pg_dump --host keyswap-prod.cik0ar7sipfl.us-west-2.rds.amazonaws.com --username coraythan --format c --no-unlogged-table-data --file .\restore-cards\full-db.dump keyswap

set PGPASSWORD=postgres
pg_restore -h localhost -U postgres --clean --if-exists --no-tablespaces --no-privileges --no-owner -d keyswap .\restore-cards\full-db.dump
```

