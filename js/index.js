import Artist from './Artist.js';

let artist = new Artist("John Doe", [], [], "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl quis aliquam lacinia, nunc nisl aliquet nunc, nec aliquam nisl nunc nec nisl. Sed euismod, nisl quis aliquam lacinia, nunc nisl aliquet nunc, nec aliquam nisl nunc nec nisl.", "bart@fake.com", "555-555-5555", "https://www.google.com", "https://www.facebook.com");

for(let i = 1; i <= 9; i++)
{
    artist.images.push("images/" + i + ".jpg");
}

for(let i = 1; i <= 9; i++)
{
    artist.categories.push("Category " + i);
}

document.getElementById("artistName").innerHTML += artist.name;
document.getElementById("artistBio").innerHTML += artist.bio;
document.getElementById("artistEmail").innerHTML += artist.email;
document.getElementById("artistPhone").innerHTML += artist.phone;
document.getElementById("artistWebsite").innerHTML += artist.website;
document.getElementById("artistSocialMedia").innerHTML += artist.socialMedia;

let imageContainer = document.getElementById("artistImagesContainer");
let dialog = document.getElementById("imageDialog");
let dialogImage = dialog.getElementsByTagName("img")[0];

dialog.onclick = function()
{
    dialog.close();
}

for (let i = 0; i < artist.images.length; i++)
{
    let imageFigure = document.createElement("figure");
    
    let image = document.createElement("img");
    image.src = artist.images[i];

    let imageCaption = document.createElement("figcaption");
    imageCaption.innerHTML = artist.categories[i];

    imageFigure.appendChild(image);
    imageFigure.appendChild(imageCaption);

    imageContainer.appendChild(imageFigure);

    //create a dialog box with an image and a caption when the image is clicked
    image.onclick = function()
    {
        dialogImage.src = image.src;
        dialog.showModal();
    }
}
