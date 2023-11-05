import Artist from './Artist.js';

let artistId = new URLSearchParams(window.location.search).get("id");
let artist = Artist.artists[artistId];
let selectedImageIndex = 0;

document.getElementById("artistName").innerHTML += artist.name;
document.getElementById("artistBio").innerHTML += artist.bio;
document.getElementById("artistEmail").innerHTML += artist.email;
document.getElementById("artistPhone").innerHTML += artist.phone;
document.getElementById("artistWebsite").href = artist.website;
document.getElementById("artistWebsite").innerHTML = artist.website;
document.getElementById("facebook").href = artist.facebook;
document.getElementById("instagram").href = artist.instagram;

document.title = `Artist ${artist.name}`;

const imageContainer = document.getElementById("artistImagesContainer");
const dialog = document.getElementById("imageDialog");
const dialogImage = dialog.getElementsByTagName("img")[0];
const previousButton = document.getElementById("previousImage");
const nextButton = document.getElementById("nextImage");

previousButton.onclick = () => { 
    selectedImageIndex = (selectedImageIndex - 1 + artist.images.length) % artist.images.length;
    dialogImage.src = artist.images[selectedImageIndex];
}

nextButton.onclick = () => {
    selectedImageIndex = (selectedImageIndex + 1) % artist.images.length;
    dialogImage.src = artist.images[selectedImageIndex];
}

// Create the image elements
artist.images.forEach((imageSrc, i) => {
    const imageFigure = document.createElement("figure");
    const image = document.createElement("img");
    image.src = imageSrc;

    imageFigure.appendChild(image);
    imageContainer.appendChild(imageFigure);

    image.onclick = () => {
        dialogImage.src = image.src;
        selectedImageIndex = i;
        dialog.showModal();
    }
});

// Close the dialog if the user presses escape
window.closeDialog = () => {
    dialog.close();
}

// Close the dialog if the user clicks outside of it
dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
        dialog.close();
    }
});

// List all artist art categories in artistCategoriesContainer without duplicates 
const artistCategoriesContainer = document.getElementById("artistCategoriesContainer");
const categories = artist.categories;
const uniqueCategories = [...new Set(categories)];
uniqueCategories.forEach(category => {
    const categoryElement = document.createElement("p");
    categoryElement.innerHTML = category;
    artistCategoriesContainer.appendChild(categoryElement);
});

