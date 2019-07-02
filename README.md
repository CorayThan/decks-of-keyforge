
Running the project:

```
./gradlew bootRun
```

```
cd ui
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
// database keyswap
SET CLIENT_ENCODING TO 'utf8';

\COPY (select keyforge_id, name, expansion, house_names_string, sas_rating, cards_rating, synergy_rating, antisynergy_rating, aerc_score, amber_control, expected_amber, artifact_control, creature_control, deck_manipulation, effective_power, raw_amber, action_count, upgrade_count, creature_count, power_level, chains, wins, losses, card_names from deck where registered = 'true') to 'C:\Users\Coray\Downloads\dok-decks-6-10-19.csv' DELIMITER ',' CSV HEADER;
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