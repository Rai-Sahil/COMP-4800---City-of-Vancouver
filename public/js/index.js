import {Artist, PartialArtist} from './Artist.js';
const artistsContainer = document.getElementById("artistsContainer");
const genreFieldset = document.getElementById("genre");
const mediumFieldset = document.getElementById("medium");
const culturalFieldset = document.getElementById("cultural");
const checkboxes = [];

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

async function generateArtists() {

    let artists;

    try {
        const response = await fetch('/artists');
        
        // Checking if the response is OK (status 200)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
    
        artists = await response.json();
        // Work with the received data

        // Perform operations with the received data
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }


    artistsContainer.innerHTML = "";

    let selectedCategories = checkboxes.filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);


    for (let i = 0; i < artists.length; i++) {
        let artist = artists[i];
        artist.categories = separateCategories(artist.preference);
        artist.categories = artist.categories.concat(separateCategories(artist.cultural));
        artist.categories = artist.categories.concat(separateCategories(artist.genre));

        if (selectedCategories.length > 0 && !selectedCategories.some(category => artist.categories.includes(category))) {
            continue;
        }

        let artistFigure = document.createElement("figure");
        artistFigure.classList.add("artist");

        let artistImage = document.createElement("img");
        artistImage.src = artist.image;

        let artistCaption = document.createElement("figcaption");
        artistCaption.innerHTML = artist.name;

        artistFigure.appendChild(artistImage);
        artistFigure.appendChild(artistCaption);

        artistFigure.onclick = function() {
            window.location.href = "/userProfile?id=" + artist.uuid;
        }

        artistsContainer.appendChild(artistFigure);
    }
}

function separateCategories(categories) 
{
    let categoryArray = categories.split(",");

    for (let i = 0; i < categoryArray.length; i++)
    {
        categoryArray[i] = categoryArray[i].trim();
    }

    return categoryArray;
}