DROP DATABASE IF EXISTS `CityofVan`;
CREATE DATABASE IF NOT EXISTS `CityofVan`;

use CityofVan;

create table if not exists user (
    uuid int not null auto_increment,
    name varchar(31) not null,
    email varchar(31) not null,
    password varchar(63),
    phone varchar(15),
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
    primary key (uuid, email)
);

create table if not exists user_application (
    uuid int not null,
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
    primary key (applicationID),
    foreign key (uuid) references user(uuid) on delete cascade	
) engine=MyISAM;

create table if not exists user_art (
    uuid int not null,
    imageID int not null auto_increment,
    name varchar(31),
    description varchar(255),
    verified bit default 0,
    uploadDate datetime default current_timestamp,
    verifiedDate datetime,
    primary key (uuid, imageID),
    foreign key (uuid) references user(uuid) on delete cascade
) engine=MyISAM;

create table if not exists user_art_category (
	uuid int not null,
    imageID int not null,
    categoryOne bit,
    primary key (uuid, imageID),
    foreign key (uuid) references user(uuid) on delete cascade,
    foreign key (imageID) references user_art(imageID) on delete cascade
) engine=MyISAM;


-- create view user_login as select contact_email, password from user;
-- create view user_profile as select uuid, email, name, phone, email, biography from user;
-- create view user_media as select uuid, website, facebook, instagram, twitter, linkedin, youtube from user;

DELIMITER //

CREATE PROCEDURE createApplication(
    IN p_uuid INT,
    IN p_name VARCHAR(31),
    IN p_email VARCHAR(31),
    IN p_phone VARCHAR(15),
    IN p_website VARCHAR(127),
    IN p_instagramHandle VARCHAR(127),
    IN p_facebookHandle VARCHAR(127),
    IN p_bcResident BIT,
    IN p_experience BIT,
    IN p_experienceDescription VARCHAR(511),
    IN p_biography VARCHAR(1023),
    IN p_genre VARCHAR(1023),
    IN p_cultural VARCHAR(1023),
    IN p_preference VARCHAR(1023)
)
BEGIN
    INSERT INTO user_application (uuid, name, email, phone, website, instagramHandle, facebookHandle, bcResident, experience, experienceDescription, biography, genre, cultural, preference)
    VALUES (p_uuid, p_name, p_email, p_phone, p_website, p_instagramHandle, p_facebookHandle, p_bcResident, p_experience, p_experienceDescription, p_biography, p_genre, p_cultural, p_preference);
END //

CREATE PROCEDURE getApprovedApplications()
BEGIN
    SELECT * FROM user_application WHERE approved = 1;
END //

CREATE PROCEDURE getUnapprovedApplications()
BEGIN
    SELECT * FROM user_application WHERE approved = 0;
END //

CREATE PROCEDURE getAllApplications()
BEGIN
    SELECT * FROM user_application;
END //

CREATE PROCEDURE getPartialApplications()
BEGIN
    SELECT uuid, genre, cultural, preference, name FROM user_application;
END //

CREATE PROCEDURE getPartialApprovedApplications()
BEGIN
    SELECT uuid, genre, cultural, preference, name FROM user_application WHERE approved = 1;
END //

DELIMITER ;