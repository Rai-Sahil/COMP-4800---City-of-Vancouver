import Artist from './Artist.js';
const artistsContainer = document.getElementById("artistsContainer");
const genreFieldset = document.getElementById("genre");
const mediumFieldset = document.getElementById("medium");
const culturalFieldset = document.getElementById("cultural");
const checkboxes = [];
const artists = Artist.artists;

function createCheckboxAndLabel(category, fieldset, onclickFunction) {
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = category;
    checkbox.value = category;
    checkbox.onclick = onclickFunction;

    let label = document.createElement("label");
    label.htmlFor = category;
    label.innerHTML = category;

    let br = document.createElement("br");

    fieldset.appendChild(checkbox);
    fieldset.appendChild(label);
    fieldset.appendChild(br);
    checkboxes.push(checkbox);
}

Artist.genreCategories.forEach(category => createCheckboxAndLabel(category, genreFieldset, generateArtists));
Artist.mediumCategories.forEach(category => createCheckboxAndLabel(category, mediumFieldset, generateArtists));
Artist.culturalCategories.forEach(category => createCheckboxAndLabel(category, culturalFieldset, generateArtists));

generateArtists();

function generateArtists() {
    artistsContainer.innerHTML = "";

    let selectedCategories = checkboxes.filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);

    artists.forEach((artist, i) => {
        if(selectedCategories.length > 0 && !selectedCategories.some(category => artist.categories.includes(category))) {
            return;
        }

        let artistFigure = document.createElement("figure");
        artistFigure.classList.add("artist");

        let artistImage = document.createElement("img");
        artistImage.src = artist.images[0];

        let artistCaption = document.createElement("figcaption");
        artistCaption.innerHTML = artist.name;

        artistFigure.appendChild(artistImage);
        artistFigure.appendChild(artistCaption);

        artistFigure.onclick = function() {
            window.location.href = "/artist_profile.html?id=" + i;
        }

        artistsContainer.appendChild(artistFigure);
    });
}

