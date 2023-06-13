
# Decks of KeyForge and SAS Tickets

## DoK Change request guidelines

#### Submit bugs or request changes to the Decks of KeyForge website. See below to suggest changes to the SAS system or card ratings

* Search [bugs](https://github.com/CorayThan/decks-of-keyforge/labels/dok-bug) or [features](https://github.com/CorayThan/decks-of-keyforge/issues?q=label%3Adok-feature+) to make sure it hasn't already been reported before creating a ticket.

[Propose a new DoK Feature](https://github.com/CorayThan/decks-of-keyforge/issues/new?assignees=CorayThan&labels=dok-feature&template=dok-feature-request.md&title=)

[Submit a bug with DoK](https://github.com/CorayThan/decks-of-keyforge/issues/new?assignees=CorayThan&labels=dok-bug&template=report-a-bug-with-dok.md&title=)

## SAS Change request guidelines

1. **Do No Harm** It is more important to prevent falsely overrated decks and cards than to accurately capture all value. Your idea should improve scores for almost all decks it touches, and very rarely cause a card to be overrated in value in decks.
2. **Legacy Cards are lower priority** If a card has not been included in the last two sets, it is considered a "legacy" card in terms of changes to SAS. Changes to legacy cards will only be considered if it is obviously inconsistent with other cards with similar scores, or there is an egregious problem.
3. **Avoid suggesting minor tweaks to scores** Make sure your change request is relevant. If you think a card is only off by 0.25 AERC most of the time, it probably isn't worth updating.
4. **Read the [About Page](https://decksofkeyforge.com/about/sas)** This page details the basic details of how decks and cards are scored in SAS.
5. **Read the AERC Rating guidelines** Find the relevant sections in the [AERC rating guidelines](
   https://docs.google.com/document/d/1WkphfSzWj-hZ8l7BMhAgNF6-8b3Qj9cFiV7gGkR9HBU/edit?usp=sharing) This google doc contains detailed information about how cards are rated, and what expectations and rules are used to maintain consistency.
6. **Compare with existing cards** using the [card search tool](https://decksofkeyforge.com/cards) to ensure your change request is consistent with existing cards.
7. **Don't make duplicates** Search the [card change issues](https://github.com/CorayThan/decks-of-keyforge/issues?q=label%3Asas-change-for-card+) or [sas feature change issues](https://github.com/CorayThan/decks-of-keyforge/issues?q=label%3Asas-feature+) to make sure your request isn't a duplicate or hasn't already been rejected

[Propose an update to a card](https://github.com/CorayThan/decks-of-keyforge/issues/new?assignees=CorayThan&labels=sas-change-for-card&template=aerc-change-request-for-card.md&title=%5BCard+Name%5D+%E2%80%93+%5BChange+Description%5D)

[Propose a new SAS Feature](https://github.com/CorayThan/decks-of-keyforge/issues/new?assignees=CorayThan&labels=sas-feature&template=sas-feature-request.md&title=)

# Developing in the DoK Codebase

## Deploy new version:

Run:

```
./scripts/build-and-push.ps1
```

Login to AWS Elastic Beanstalk. Go to Upload and deploy. For file choose: 

```
/docker/Dockerrun.aws.json
```

## Running the project:

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
cd 'C:\Program Files\PostgreSQL\12\scripts\'
.\runpsql.bat
// server click enter
// database enter: keyswap
SET CLIENT_ENCODING TO 'utf8';

\COPY (select keyforge_id, name, expansion, house_names_string, sas_rating, synergy_rating, antisynergy_rating, aerc_score, amber_control, expected_amber, artifact_control, creature_control, efficiency, recursion, disruption, creature_protection, other, effective_power, raw_amber, action_count, upgrade_count, creature_count, power_level, chains, wins, losses, card_names from deck) to 'C:\Users\Coray\Downloads\dok-decks.csv' DELIMITER ',' CSV HEADER;
```

Find it in downloads 


## Dump the manual card data tables

Run the `load-cards.cmd` with the Reload Cards run config.

```
set PGPASSWORD=password
pg_dump -h keyswap-prod.cik0ar7sipfl.us-west-2.rds.amazonaws.com -U coraythan -F c -a -t card_traits -t card_identifier -t extra_card_info -t card -t syn_trait_value -f .\scripts\extra-info.dump keyswap

set PGPASSWORD=postgres
psql -U postgres -d keyswap -f .\scripts\truncate-card-tables.sql
pg_restore -h localhost -U postgres -d keyswap .\scripts\extra-info.dump

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

## Make patreon request with postman

Go to: https://www.patreon.com/portal/registration/register-clients

Copy Creator's Access Token into the auth header

## Make reduced size card images

Delete `*.png` in `/card-imgs/`. Uncomment line in RunOnStart. Run app. In `/card-imgs/` run:

`.\pngquant.exe --ext=.png --force 256 *.png`

upload to S3 public with headers: `Cache-Control: max-age=31536000`

## auto generate table info

Change `ddl-auto` in `application.yml` to `update`. `show-sql` to true. Run. Copy paste. Delete tables. Revert.

## copy db and reload it

```
set PGPASSWORD=password
pg_dump --host keyswap-prod.cik0ar7sipfl.us-west-2.rds.amazonaws.com --username coraythan --format c --no-unlogged-table-data --file .\scripts\full-db.dump keyswap

set PGPASSWORD=postgres
pg_restore -h localhost -U postgres --clean --if-exists --no-tablespaces --no-privileges --no-owner -d keyswap .\scripts\full-db.dump
```

To update passwords run: `update key_user set password = 'hash-from-db-for-password-to-make-all-passwords';`