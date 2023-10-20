create database roster_database;

-- general user data
create table user (
	user_id int not null auto_increment,
	email varchar(31) not null,
	password varchar(31),
	admin bit default 0,
    verified bit default 0,
	creation_date datetime default current_timestamp,
    verified_date datetime,
	primary key (user_id),
	primary key (email)
);

-- user profile
create table user_profile (
	user_id int not null,
	name varchar(31) not null,
	phone varchar(15),
	biography varchar(1023),
	primary key (user_id),
	foreign key (user_id) references user(user_id) on delete cascade,
	
);

-- user social media
create table user_media (
	user_id int not null,
	website varchar(127),
    facebook varchar(127),
    instagram varchar(127),
    x varchar(127), 
    linkedin varchar(127),
    youtube varchar(127),
	primary key (user_id),
	foreign key (user_id) references user(user_id) on delete cascade,
);

-- user image
create table user_art (
	user_id int not null,
	image_id int not null autoincrement,
    name varchar(31),
    description varchar(255),
    verified bit default 0,
    upload_date datetime default current_timestamp,
    verified_date datetime,
	primary key (user_id, image_id),
	foreign key (user_id) references user(user_id) on delete cascade,
);

-- user image category
create table user_art_category (
	image_id int not null,
    category_one bit,
	primary key (image_id),
	foreign key (image_id) references user_art(image_id) on delete cascade,
);