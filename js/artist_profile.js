import Artist from './Artist.js';

// get the artist id from the url with key "id"
let artistId = new URLSearchParams(window.location.search).get("id");
let artist = Artist.artists[artistId];
let selectedImageIndex = 0;

// populate the artist profile page with the artist's information
document.getElementById("artistName").innerHTML += artist.name;
document.getElementById("artistBio").innerHTML += artist.bio;
document.getElementById("artistEmail").innerHTML += artist.email;
document.getElementById("artistPhone").innerHTML += artist.phone;
document.getElementById("artistWebsite").href = artist.website;
document.getElementById("artistWebsite").innerHTML = artist.website;
document.getElementById("facebook").href = artist.facebook;
document.getElementById("instagram").href = artist.instagram;

// set the page title to the artist name
document.title = "Artist " + artist.name;

// populate the artist's images
let imageContainer = document.getElementById("artistImagesContainer");
let dialog = document.getElementById("imageDialog");
let dialogImage = dialog.getElementsByTagName("img")[0];
let previousButton = document.getElementById("previousImage");
let nextButton = document.getElementById("nextImage");

previousButton.onclick = function()
{
    selectedImageIndex = (selectedImageIndex - 1) % artist.images.length;
    if (selectedImageIndex < 0)
    {
        selectedImageIndex = artist.images.length - 1;
    }
    dialogImage.src = artist.images[selectedImageIndex];
}

nextButton.onclick = function()
{
    selectedImageIndex = (selectedImageIndex + 1) % artist.images.length;
    dialogImage.src = artist.images[selectedImageIndex];
    
}

// populate the image container with images
for (let i = 0; i < artist.images.length; i++)
{
    let imageFigure = document.createElement("figure");
    
    let image = document.createElement("img");
    image.src = artist.images[i];

    //let imageCaption = document.createElement("figcaption");
    //imageCaption.innerHTML = artist.categories[i];

    imageFigure.appendChild(image);
    //imageFigure.appendChild(imageCaption);

    imageContainer.appendChild(imageFigure);

    //create a dialog box with an image and a caption when the image is clicked
    image.onclick = function()
    {
        dialogImage.src = image.src;
        selectedImageIndex = i;
        dialog.showModal();
    }

    
}

function closeDialog()
{
    dialog.close();
}

window.closeDialog = closeDialog;