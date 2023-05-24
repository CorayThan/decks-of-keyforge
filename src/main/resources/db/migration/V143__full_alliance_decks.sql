--
-- Name: alliance_deck; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alliance_deck
(
    id                        uuid                        NOT NULL,
    action_count              integer                     NOT NULL,
    aerc_score                double precision            NOT NULL,
    aerc_version              integer                     NOT NULL,
    amber_control             double precision            NOT NULL,
    antisynergy_rating        integer                     NOT NULL,
    artifact_control          double precision            NOT NULL,
    artifact_count            integer                     NOT NULL,
    bonus_capture             integer                     NOT NULL,
    bonus_draw                integer                     NOT NULL,
    bonus_icons_string        character varying(10000)    NOT NULL,
    card_ids                  text                        NOT NULL,
    card_names                character varying(25000)    NOT NULL,
    created_date_time         timestamp WITHOUT TIME ZONE NOT NULL,
    creature_control          double precision            NOT NULL,
    creature_count            integer                     NOT NULL,
    creature_protection       double precision            NOT NULL,
    disruption                double precision            NOT NULL,
    effective_power           integer                     NOT NULL,
    efficiency                double precision            NOT NULL,
    expansion                 integer                     NOT NULL,
    expected_amber            double precision            NOT NULL,
    house_names_string        character varying(500)      NOT NULL,
    name                      character varying(255)      NOT NULL,
    other                     double precision            NOT NULL,
    previous_major_sas_rating integer,
    previous_sas_rating       integer,
    public                    boolean                     NOT NULL,
    raw_amber                 integer                     NOT NULL,
    recursion                 double precision            NOT NULL,
    sas_rating                integer                     NOT NULL,
    synergy_rating            integer                     NOT NULL,
    total_armor               integer                     NOT NULL,
    total_power               integer                     NOT NULL,
    upgrade_count             integer                     NOT NULL
);


--
-- Name: alliance_house; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alliance_house
(
    id               bigint NOT NULL,
    house            character varying(255),
    alliance_deck_id uuid,
    deck_id          bigint
);


--
-- Name: owned_alliance_deck; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.owned_alliance_deck
(
    id       bigint NOT NULL,
    deck_id  uuid,
    owner_id uuid
);


--
-- Name: alliance_deck alliance_deck_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alliance_deck
    ADD CONSTRAINT alliance_deck_pkey PRIMARY KEY (id);


--
-- Name: alliance_house alliance_house_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alliance_house
    ADD CONSTRAINT alliance_house_pkey PRIMARY KEY (id);


--
-- Name: owned_alliance_deck owned_alliance_deck_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.owned_alliance_deck
    ADD CONSTRAINT owned_alliance_deck_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.owned_alliance_deck
    ADD CONSTRAINT owned_alliance_deck_to_owner_fk FOREIGN KEY (owner_id) REFERENCES public.key_user (id);

ALTER TABLE ONLY public.owned_alliance_deck
    ADD CONSTRAINT owned_alliance_deck_to_alliance_deck_fk FOREIGN KEY (deck_id) REFERENCES public.alliance_deck (id);

ALTER TABLE ONLY public.alliance_house
    ADD CONSTRAINT alliance_house_to_deck_fk FOREIGN KEY (deck_id) REFERENCES public.deck (id);

ALTER TABLE ONLY public.alliance_house
    ADD CONSTRAINT alliance_house_to_alliance_deck_fk FOREIGN KEY (alliance_deck_id) REFERENCES public.alliance_deck (id);

ALTER TABLE alliance_deck
    ADD CONSTRAINT alliance_deck_card_ids_exists CHECK (CHAR_LENGTH(card_ids) > 10);

ALTER TABLE alliance_deck
    ADD CONSTRAINT alliance_deck_card_names_string_exists CHECK (CHAR_LENGTH(card_names) > 2);

ALTER TABLE alliance_deck
    ADD CONSTRAINT alliance_deck_house_names_string_exists CHECK (CHAR_LENGTH(house_names_string) > 2);

CREATE INDEX alliance_deck_name_idx ON alliance_deck USING gin (LOWER(name) gin_trgm_ops);
CREATE INDEX alliance_house_names_string_idx ON alliance_deck USING gin (house_names_string gin_trgm_ops);
CREATE INDEX alliance_expansion_idx ON alliance_deck (expansion);

CREATE INDEX alliance_deck_sas_desc_id_idx ON alliance_deck (sas_rating DESC, id);
CREATE INDEX alliance_deck_sas_asc_id_idx ON alliance_deck (sas_rating, id);
CREATE INDEX alliance_deck_aerc_desc_id_idx ON alliance_deck (aerc_score DESC, id);
CREATE INDEX alliance_deck_aerc_asc_id_idx ON alliance_deck (aerc_score, id);

CREATE INDEX alliance_deck_raw_amber_idx ON alliance_deck (raw_amber);

CREATE INDEX alliance_deck_creature_count_idx ON alliance_deck (creature_count);
CREATE INDEX alliance_deck_action_count_idx ON alliance_deck (action_count);
CREATE INDEX alliance_deck_artifact_count_idx ON alliance_deck (artifact_count);
CREATE INDEX alliance_deck_upgrade_count_idx ON alliance_deck (upgrade_count);

CREATE INDEX alliance_deck_expected_amber_idx ON alliance_deck (expected_amber);
CREATE INDEX alliance_deck_amber_control_idx ON alliance_deck (amber_control);
CREATE INDEX alliance_deck_creature_control_idx ON alliance_deck (creature_control);
CREATE INDEX alliance_deck_artifact_control_idx ON alliance_deck (artifact_control);
CREATE INDEX alliance_deck_efficiency_idx ON alliance_deck (efficiency);
CREATE INDEX alliance_deck_recursion_idx ON alliance_deck (recursion);
CREATE INDEX alliance_deck_effective_power_idx ON alliance_deck (effective_power);
CREATE INDEX alliance_deck_disruption_idx ON alliance_deck (disruption);

CREATE INDEX alliance_deck_id_idx ON alliance_house (alliance_deck_id);
CREATE INDEX alliance_deck_owner_id_idx ON owned_alliance_deck (owner_id);

ALTER TABLE owned_alliance_deck
    ADD COLUMN team_id UUID;
ALTER TABLE owned_alliance_deck
    ADD COLUMN added TIMESTAMP;

ALTER TABLE owned_alliance_deck
    ALTER COLUMN added SET NOT NULL;

ALTER TABLE owned_alliance_deck
    ADD CONSTRAINT owned_alliance_deck_team_fk FOREIGN KEY (team_id) REFERENCES team;

ALTER TABLE owned_alliance_deck
    ADD UNIQUE (deck_id, owner_id);

CREATE INDEX owned_alliance_deck_team_id_idx ON owned_alliance_deck (team_id);

ALTER TABLE alliance_deck
    ADD COLUMN alliance_houses_unique_ids character varying(2000);
ALTER TABLE alliance_deck
    ALTER COLUMN alliance_houses_unique_ids SET NOT NULL;

ALTER TABLE alliance_house
    ADD COLUMN keyforge_id character varying(400);
ALTER TABLE alliance_house
    ADD COLUMN name character varying(500);

ALTER TABLE alliance_house
    ALTER COLUMN keyforge_id SET NOT NULL;
ALTER TABLE alliance_house
    ALTER COLUMN name SET NOT NULL;

ALTER TABLE alliance_deck
    ADD COLUMN discoverer_id UUID;

ALTER TABLE alliance_deck
    ALTER COLUMN discoverer_id SET NOT NULL;
