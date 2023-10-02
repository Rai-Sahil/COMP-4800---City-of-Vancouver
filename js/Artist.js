export default

class Artist
{
    static artists = [];
    static names = 
    [
        "John Doe",
        "Jane Doe",
        "John Smith",
        "Jane Smith",
        "John Johnson",
        "Jane Johnson",
        "John Williams",
        "Jane Williams",
        "John Jones",
        "Jane Jones"
    ];

    static
    {
        //create more artists with dummy data
        for(let i = 0; i < 9; i++)
        {
            let name = Artist.names[i];

            let artist = new Artist(name, [], [], "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl quis aliquam lacinia, nunc nisl aliquet nunc, nec aliquam nisl nunc nec nisl. Sed euismod, nisl quis aliquam lacinia, nunc nisl aliquet nunc, nec aliquam nisl nunc nec nisl.", "bart@fake.com", "555-555-5555", "https://www.google.com", "https://www.facebook.com");

            for(let i = 1; i <= 9; i++)
            {
                artist.images.push("images/" + i + ".jpg");
            }
    
            for(let i = 1; i <= 9; i++)
            {
                artist.categories.push("Category " + i);
            }

            this.artists.push(artist);
        }


    }

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