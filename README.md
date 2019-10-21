
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
cd 'C:\Program Files\PostgreSQL\10\scripts\'
.\runpsql.bat
// server click enter
// database enter: keyswap
SET CLIENT_ENCODING TO 'utf8';

\COPY (select keyforge_id, name, expansion, house_names_string, sas_rating, synergy_rating, antisynergy_rating, aerc_score, amber_control, expected_amber, artifact_control, creature_control, efficiency, disruption, amber_protection, house_cheating, other, effective_power, raw_amber, action_count, upgrade_count, creature_count, power_level, chains, wins, losses, card_names from deck where registered = 'true') to 'C:\Users\Coray\Downloads\dok-decks.csv' DELIMITER ',' CSV HEADER;
```

Find it in downloads 


## Dump the manual card data tables

Delete preexisting stuff
```
delete from card_identifier;
delete from syn_trait_value;
delete from extra_card_info;
delete from spoiler;
```

```
pg_dump -h keyswap-prod.cik0ar7sipfl.us-west-2.rds.amazonaws.com -U coraythan --column-inserts -a -t card_identifier -t extra_card_info -t spoiler -t syn_trait_value -f extra-info.sql keyswap
// enter password: crazysal...
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

`.\pngquant.exe --ext=.png --force 256 *.png`

upload to S3 public with headers: `Cache-Control: max-age=31536000`

## auto generate table info

Change `ddl-auto` in `application.yml` to `update`. `show-sql` to true. Run. Copy paste. Delete tables. Revert.