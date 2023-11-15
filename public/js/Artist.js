export default

class Artist
{
    static artists = [];
    static names = [
        "John Doe", "Jane Doe", "John Smith", "Jane Smith",
        "John Johnson", "Jane Johnson", "John Williams", "Jane Williams",
        "John Jones", "Jane Jones"
    ];

    static culturalCategories = [
        "Musqueam, Squamish, Tsleil-Waututh", "Urban Indigenous", "Black",
        "South Asian", "Chinatown", "Chinese"
    ];

    static genreCategories = [
        "Abstract", "Cultural Expression", "Realism", "Landscape",
        "Narrative", "Graffiti", "Cartoon", "Illustration"
    ];

    static mediumCategories = ["Painted Murals", "Digital Design"];

    static categories = [];

    static
    {
        Artist.categories = this.culturalCategories.concat(this.genreCategories, this.mediumCategories);
        //create more artists with dummy data
        for(let i = 0; i < Artist.names.length; i++)
        {
            let name = Artist.names[i];
            let artist = new Artist(name, [], [], "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl quis aliquam lacinia, nunc nisl aliquet nunc, nec aliquam nisl nunc nec nisl. Sed euismod, nisl quis aliquam lacinia, nunc nisl aliquet nunc, nec aliquam nisl nunc nec nisl.", "bart@fake.com", "555-555-5555", "https://www.google.com", "https://www.facebook.com", "https://www.instagram.com");

            // Insert a random number of categories and images
            // There can be from 3 - 10 images and any amount of categories
            const numberOfCategories = Math.floor(Math.random() * 3) + 1;
            const numberOfImages = Math.floor(Math.random() * 8) + 3;

            for(let j = 0; j < numberOfCategories; j++) {
                const categoryIndex = Math.floor(Math.random() * Artist.categories.length);
                const category = Artist.categories[categoryIndex];
                artist.categories.push(category);
            }

            for(let j = 0; j < numberOfImages; j++) {
                const imageIndex = Math.floor(Math.random() * 20) + 1;
                const image = `/images/${imageIndex}.jpg`;
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

