create database if not exists roster_database;

use roster_database;

-- general user data
create table if not exists user (
    user_id int not null auto_increment,
    email varchar(31) not null,
    password varchar(31),
    admin bit default 0,
    verified bit default 0,
    creation_date datetime default current_timestamp,
    verified_date datetime,
    primary key (user_id, email)
);

-- user profile
create table if not exists user_profile (
    user_id int not null,
    name varchar(31) not null,
    phone varchar(15),
    biography varchar(1023),
    primary key (user_id),
    foreign key (user_id) references user(user_id) on delete cascade	
);

-- user social media
create table if not exists user_media (
    user_id int not null,
    website varchar(127),
    facebook varchar(127),
    instagram varchar(127),
    x varchar(127), 
    linkedin varchar(127),
    youtube varchar(127),
    primary key (user_id),
    foreign key (user_id) references user(user_id) on delete cascade
);

-- user image
create table if not exists user_art (
    user_id int not null,
    image_id varchar(63) not null unique,
    name varchar(31),
    description varchar(511),
    verified bit default 0,
    upload_date datetime default current_timestamp,
    verified_date datetime,
    primary key (user_id, image_id),
    foreign key (user_id) references user(user_id) on delete cascade
);

-- user image category
create table if not exists user_art_category (
    user_id int not null,
    image_id varchar(15) not null,
    category_one bit,
    primary key (user_id, image_id)
);
