
create table password_reset_code (
  code varchar(64) not null,
  email varchar(255) not null,
  sent_at timestamp,
  primary key (code)
);
