CREATE TABLE users
(
	user_id SERIAL NOT NULL
		CONSTRAINT users_pk
			PRIMARY KEY,
	name TEXT,
	email TEXT NOT NULL,
	phone TEXT,
	password TEXT,
	major TEXT,
	degree TEXT,
	enable BOOLEAN DEFAULT TRUE
);

ALTER TABLE users owner TO postgres;

CREATE UNIQUE index users_email_uindex
	ON users (email);

CREATE TABLE sessions
(
	session_id UUID NOT NULL
		CONSTRAINT sessions_pk
			PRIMARY KEY,
	user_id INTEGER NOT NULL,
	start_time TIMESTAMP WITH TIME ZONE,
	end_time TIMESTAMP WITH TIME ZONE
);

ALTER TABLE sessions owner TO postgres;

CREATE TABLE watchlist
(
	id INTEGER NOT NULL
		CONSTRAINT watchlist_pkey
			PRIMARY KEY,
	user_id INTEGER NOT NULL,
	course_id INTEGER NOT NULL
);

ALTER TABLE watchlist owner TO postgres;

CREATE TABLE userevents
(
	event_id INTEGER,
	user_id UUID,
	content VARCHAR(255),
	created_at BIGINT
);

ALTER TABLE userevents owner TO postgres;

CREATE TABLE events
(
	event_id INTEGER NOT NULL
		CONSTRAINT events_pkey
			PRIMARY KEY,
	description VARCHAR(255)
);

ALTER TABLE events owner TO postgres;


