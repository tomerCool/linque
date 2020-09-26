CREATE DATABASE linque;

CREATE TABLE users(
    username VARCHAR PRIMARY KEY,
    display_name VARCHAR,
    password VARCHAR,
    email VARCHAR,
    created_at TIMESTAMP,
    last_online TIMESTAMP,
    settings_id INT,
    main_queue_id INT,
    favorites_id INT,
    friends INT[],
    friend_requests_id INT,
    notifications_id INT
);

CREATE TABLE queues(
    id SERIAL PRIMARY KEY,
    created_by VARCHAR,
    links INT[],
    history_links INT[],
    created_at TIMESTAMP
);

CREATE TABLE links(
    id SERIAL PRIMARY KEY,
    link VARCHAR,
    title VARCHAR,
    added_by VARCHAR,
    added_at TIMESTAMP
);

CREATE TABLE friend_requests(
    id SERIAL PRIMARY KEY,
    sent_by VARCHAR,
    sent_to VARCHAR,
    created_at TIMESTAMP
);

CREATE TABLE settings(
    id SERIAL PRIMARY KEY
);

CREATE TABLE notifications(
    id SERIAL PRIMARY KEY,
    data VARCHAR,
    created_at TIMESTAMP
);