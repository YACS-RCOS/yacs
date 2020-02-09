create table users
(
	user_id serial not null
		constraint users_pk
			primary key,
	name text,
	email text not null,
	phone text,
	password text,
	major text,
	degree text,
	enable boolean default true
);

alter table users owner to postgres;

create unique index users_email_uindex
	on users (email);

create table sessions
(
	session_id uuid not null
		constraint sessions_pk
			primary key,
	user_id integer not null,
	start_time timestamp with time zone,
	end_time timestamp with time zone
);

alter table sessions owner to postgres;

create table watchlist
(
	"id" integer not null
		constraint watchlist_pkey
			primary key,
	user_id integer not null,
	"course_id" integer not null
);

alter table watchlist owner to postgres;

create table userevents
(
	event_id integer,
	user_id uuid,
	content varchar(255),
	created_at bigint
);

alter table userevents owner to postgres;

create table events
(
	event_id integer not null
		constraint events_pkey
			primary key,
	description varchar(255)
);

alter table events owner to postgres;


