create table users
(
	uid serial not null
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
	sessionid uuid not null
		constraint sessions_pk
			primary key,
	uid integer not null,
	start_time timestamp with time zone,
	end_time timestamp with time zone
);

alter table sessions owner to postgres;

create table watchlist
(
	"ID" integer not null
		constraint watchlist_pkey
			primary key,
	uid integer not null,
	"courseID" integer not null
);

alter table watchlist owner to postgres;

create table userevents
(
	"eventID" integer,
	uid uuid,
	data varchar(255),
	"createdAt" bigint
);

alter table userevents owner to postgres;

create table events
(
	"eventID" integer not null
		constraint events_pkey
			primary key,
	description varchar(255)
);

alter table events owner to postgres;


