export default

class Artist
{
    constructor(name, categories, images, bio, email, phone = null, website = null, socialMedia = null)
    {
        this.name = name;
        this.categories = categories;
        this.images = images;
        this.bio = bio;
        this.email = email;
        this.phone = phone;
        this.website = website;
        this.socialMedia = socialMedia;
    }
}