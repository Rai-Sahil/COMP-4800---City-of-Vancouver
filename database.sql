create database if not exists roster_database;

use roster_database;

-- general user data
create table if not exists user (
    userID int not null auto_increment,
    login_email varchar(31) not null,
    password varchar(63),
    name varchar(31) not null,
    phone varchar(15),
    email varchar(31) not null,
    biography varchar(1023),
    website varchar(127),
    facebook varchar(127),
    instagram varchar(127),
    twitter varchar(127), 
    linkedin varchar(127),
    youtube varchar(127),
    admin bit default 0,
    verified bit default 0,
    creationDate datetime default current_timestamp,
    verifiedDate datetime,
    primary key (userID, email)
);

-- user application
create table if not exists user_application (
    userID int not null,
    applicationID int not null auto_increment,
    name varchar(31) not null,
    email varchar(31) not null,
    phone varchar(15),
    website varchar(127),
    instagramHandle varchar(127),
    facebookHandle varchar(127),
    bcResident bit,
    experience bit,
    experienceDescription varchar(511),
    biography varchar(1023),
    genre varchar(1023),
    cultural varchar(1023),
    preference varchar(1023),
    approved bit default 0,
    rejectionReason varchar(255),
    primary key (userID, applicationID),
    foreign key (userID) references user(userID) on delete cascade	
) engine=MyISAM;
-- using engine MyISAM to have auto increment application IDs

-- user image
create table if not exists user_art (
    userID int not null,
    imageID int not null auto_increment,
    name varchar(31),
    description varchar(255),
    verified bit default 0,
    uploadDate datetime default current_timestamp,
    verifiedDate datetime,
    primary key (userID, imageID),
    foreign key (userID) references user(userID) on delete cascade
) engine=MyISAM;
-- using engine MyISAM to have auto increment image IDs

-- user image category
create table if not exists user_art_category (
	userID int not null,
    imageID int not null,
    categoryOne bit,
    primary key (userID, imageID),
    foreign key (userID) references user(userID) on delete cascade,
    foreign key (imageID) references user_art(imageID) on delete cascade
) engine=MyISAM;

create view user_login as select contact_email, password from user;
create view user_profile as select userID, email, name, phone, email, biography from user;
create view user_media as select userID, website, facebook, instagram, twitter, linkedin, youtube from user;