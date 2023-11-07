create database if not exists rosterDatabase;

use rosterDatabase;

-- general user data
create table if not exists user (
    userID int not null auto_increment,
    email varchar(31) not null,
    password varchar(31),
    admin bit default 0,
    verified bit default 0,
    creationDate datetime default current_timestamp,
    verifiedDate datetime,
    primary key (userID, email)
);

-- user application
create table if not exists userApplication (
    userID int not null,
    applicationID varchar(15) not null unique,
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
);

-- user profile
create table if not exists userProfile (
    userID int not null,
    name varchar(31) not null,
    phone varchar(15),
    biography varchar(1023),
    primary key (userID),
    foreign key (userID) references user(userID) on delete cascade	
);

-- user social media
create table if not exists userMedia (
    userID int not null,
    website varchar(127),
    facebook varchar(127),
    instagram varchar(127),
    twitter varchar(127), 
    linkedin varchar(127),
    youtube varchar(127),
    primary key (userID),
    foreign key (userID) references user(userID) on delete cascade
);

-- user image
create table if not exists userArt (
    userID int not null,
    imageID varchar(15) not null unique,
    name varchar(31),
    description varchar(255),
    verified bit default 0,
    uploadDate datetime default current_timestamp,
    verifiedDate datetime,
    primary key (userID, imageID),
    foreign key (userID) references user(userID) on delete cascade
);

-- user image category
create table if not exists userArtCategory (
	userID int not null,
    imageID varchar(15) not null,
    categoryOne bit,
    primary key (userID, imageID),
    foreign key (userID) references user(userID) on delete cascade,
    foreign key (imageID) references userArt(imageID) on delete cascade
);
