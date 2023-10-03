import Artist from './Artist.js';
let artistsContainer = document.getElementById("artistsContainer");

let genreFieldset = document.getElementById("genre");
let mediumFieldset = document.getElementById("medium");
let culturalFieldset = document.getElementById("cultural");

let checkboxes = [];
let artists = Artist.artists;

for (let i = 0; i < Artist.genreCategories.length; i++)
{
    let category = Artist.genreCategories[i];

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = category;
    checkbox.value = category;
    checkbox.checked = false;
    checkbox.onclick = generateArtists;

    let label = document.createElement("label");
    label.htmlFor = category;
    label.innerHTML = category;

    let br = document.createElement("br");

    genreFieldset.appendChild(checkbox);
    genreFieldset.appendChild(label);
    genreFieldset.appendChild(br);
    checkboxes.push(checkbox);
}

for (let i = 0; i < Artist.mediumCategories.length; i++)
{
    let category = Artist.mediumCategories[i];

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = category;
    checkbox.value = category;
    checkbox.checked = false;
    checkbox.onclick = generateArtists;

    let label = document.createElement("label");
    label.htmlFor = category;
    label.innerHTML = category;

    let br = document.createElement("br");

    mediumFieldset.appendChild(checkbox);
    mediumFieldset.appendChild(label);
    mediumFieldset.appendChild(br);
    checkboxes.push(checkbox);
}

for (let i = 0; i < Artist.culturalCategories.length; i++)
{
    let category = Artist.culturalCategories[i];

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = category;
    checkbox.value = category;
    checkbox.checked = false;
    checkbox.onclick = generateArtists;

    let label = document.createElement("label");
    label.htmlFor = category;
    label.innerHTML = category;

    let br = document.createElement("br");

    culturalFieldset.appendChild(checkbox);
    culturalFieldset.appendChild(label);
    culturalFieldset.appendChild(br);
    checkboxes.push(checkbox); 
}

generateArtists();

function generateArtists()
{
    artistsContainer.innerHTML = "";

    let selectedCategories = [];

    for (let i = 0; i < checkboxes.length; i++)
    {
        let checkbox = checkboxes[i];

        if (checkbox.checked)
        {
            selectedCategories.push(checkbox.value);
        }
    }

    for (let i = 0; i < artists.length; i++)
    {
        let artist = artists[i];

        if(selectedCategories.length > 0 && !selectedCategories.some(category => artist.categories.includes(category)))
        {
            continue;
        }

        let artistFigure = document.createElement("figure");
        artistFigure.classList.add("artist");

        let artistImage = document.createElement("img");

        artistImage.src = artist.images[0];

        let artistCaption = document.createElement("figcaption");
        artistCaption.innerHTML = artist.name;

        artistFigure.appendChild(artistImage);
        artistFigure.appendChild(artistCaption);

        artistFigure.onclick = function()
        {
            window.location.href = "artist_profile.html?id=" + i;
        }

        artistsContainer.appendChild(artistFigure);
    }
}


