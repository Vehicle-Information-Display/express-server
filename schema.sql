create table users
(
    uid           INTEGER PRIMARY KEY,           /* Unique identifier to identify different users who may make multiple attempts */
    uuid          varchar(128) not null UNIQUE,  /* UUID for a given user for external use */
    name          TEXT not null,         /* User's Name */
    contact_email TEXT not null          /* User's Email */
);

create table simulation_runs
(
    runID            INTEGER PRIMARY KEY,  /* A unique identifier to assign to a given simulation */
    uid              INTEGER not null,     /* UID to refer to the associated user */
    dashboard_layout TEXT not null,        /* The dashboard layout used in a given simulation */
    foreign key (uid) references users (uid)
);

create table survey_questions
(
    qid           INTEGER PRIMARY KEY,  /* Unique Qustion Identifier */
    question      TEXT not null,        /* Question text */
    response_type TEXT                  /* e.g. Likert Scale, Qualitative Rating, etc. */
);

create table survey_answers
(
    uid      INTEGER not null,  /* The user responsible for a given answer */
    qid      TEXT not null,     /* Question associated with a given answer */
    answer   TEXT,              /* The answer text */
    foreign key (uid) references users (uid)
);

create table instructions
(
    runID       TEXT not null,  /* Simulation ID associated with a given instruction */
    instruction TEXT not null,  /* Instruction Text */
    payload     TEXT,           /* (Optional) Payload for more advanced instructions */
    foreign key (runID) references simulation_runs (runID)
);

create table simulation_events
(
    uid            INTEGER not null,
    runID          TEXT not null,  /* Simulation ID associated with a given simulation event */
    timeStamp      TEXT,
    name           TEXT,
    category       TEXT,
    intendedTarget TEXT,
    tags           TEXT,
    payload        TEXT,
    foreign key (uid) references users (uid),
    foreign key (runID) references simulation_runs (runID)
);
