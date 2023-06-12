ALTER TABLE deck
    ADD COLUMN token_id varchar(255) NULL;

CREATE INDEX deck_token_id_idx ON deck (token_id);

ALTER TABLE ONLY public.deck
    ADD CONSTRAINT deck_card_token_id_fk FOREIGN KEY (token_id) REFERENCES public.card (id);

ALTER TABLE alliance_deck
    ADD COLUMN token_id varchar(255) NULL;

CREATE INDEX alliance_deck_token_id_idx ON alliance_deck (token_id);

ALTER TABLE ONLY public.alliance_deck
    ADD CONSTRAINT alliance_deck_card_token_id_fk FOREIGN KEY (token_id) REFERENCES public.card (id);

ALTER TABLE card
    ADD COLUMN token boolean DEFAULT FALSE;
UPDATE card
SET token = FALSE;
ALTER TABLE card
    ALTER COLUMN token SET NOT NULL;