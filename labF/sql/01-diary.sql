create table diary
(
    id      integer not null
        constraint post_pk
            primary key autoincrement,
    date text not null,
    subject text not null,
    content text not null
);
