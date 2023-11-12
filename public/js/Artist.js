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

    static culturalCategories = 
    [
        "Musqueam, Squamish or Tsleil-Waututh",
        "Urban Indigenous",
        "Black",
        "South Asian",
        "Chinatown",
        "Chinese"
    ];
    static genreCategories =
    [
        "Abstract",
        "Cultural Expression",
        "Realism",
        "Landscape",
        "Narrative",
        "Graffiti",
        "Cartoon",
        "Illustration"
    ];
    static mediumCategories =
    [
        "Painted Murals",
        "Digital Design"
    ];

    static categories = [];

    static
    {
        Artist.categories = this.culturalCategories.concat(this.genreCategories, this.mediumCategories);
        
        //create more artists with dummy data
        for(let i = 0; i < Artist.names.length; i++)
        {
            let name = Artist.names[i];

            let artist = new Artist(name, [], [], "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl quis aliquam lacinia, nunc nisl aliquet nunc, nec aliquam nisl nunc nec nisl. Sed euismod, nisl quis aliquam lacinia, nunc nisl aliquet nunc, nec aliquam nisl nunc nec nisl.", "bart@fake.com", "555-555-5555", "https://www.google.com", "https://www.facebook.com", "https://www.instagram.com");

            //insert a random number of categories and images
            // there can be from 3 - 10 images and any amount of catergories
            let numberOfCategories = Math.floor(Math.random() * 3) + 1;
            let numberOfImages = Math.floor(Math.random() * 8) + 3;

            console.log(artist.name)
            for(let j = 0; j < numberOfCategories; j++)
            {
                let categoryIndex = Math.floor(Math.random() * Artist.categories.length);
                let category = Artist.categories[categoryIndex];
                artist.categories.push(category);
                console.log(category);
            }

            for(let j = 0; j < numberOfImages; j++)
            {
                let imageIndex = Math.floor(Math.random() * 20) + 1;
                let image = "../public/images/" + imageIndex + ".jpg";
                artist.images.push(image);
            }

            this.artists.push(artist);
        }


    }

    constructor(name, categories, images, bio, email, phone = null, website = null, facebook = null, instagram = null)
    {
        this.name = name;
        this.categories = categories;
        this.images = images;
        this.bio = bio;
        this.email = email;
        this.phone = phone;
        this.website = website;
        this.facebook = facebook;
        this.instagram = instagram;
    }

}