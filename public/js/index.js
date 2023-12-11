import { Artist, PartialArtist } from "./Artist.js";
const artistsContainer = document.getElementById("artistsContainer");
const genreFieldset = document.getElementById("genre");
const mediumFieldset = document.getElementById("medium");
const culturalFieldset = document.getElementById("cultural");
const checkboxes = [];

// This function creates a checkbox and a label for a category
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

Artist.genreCategories.forEach((category) =>
  createCheckboxAndLabel(category, genreFieldset, generateArtists)
);
Artist.mediumCategories.forEach((category) =>
  createCheckboxAndLabel(category, mediumFieldset, generateArtists)
);
Artist.culturalCategories.forEach((category) =>
  createCheckboxAndLabel(category, culturalFieldset, generateArtists)
);
generateArtists();

// This function generates the artists based on the selected categories
async function generateArtists() {
  let artists;
  try {
    const response = await fetch("/artists"); // Fetching the data from the API
    // Checking if the response is OK (status 200)
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    artists = await response.json(); // Parsing the response
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
  artistsContainer.innerHTML = "";
  let selectedCategories = checkboxes
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
  for (let i = 0; i < artists.length; i++) {
    let artist = artists[i];
    artist.categories = separateCategories(artist.preference);
    artist.categories = artist.categories.concat(
      separateCategories(artist.cultural)
    );
    artist.categories = artist.categories.concat(
      separateCategories(artist.genre)
    );
    if (
      selectedCategories.length > 0 &&
      !selectedCategories.some((category) =>
        artist.categories.includes(category)
      )
    ) {
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
    artistFigure.onclick = function () {
      window.location.href = "/userProfile?id=" + artist.uuid;
    };
    artistsContainer.appendChild(artistFigure);
  }
}

// This function separates the categories from a string
function separateCategories(categories) {
  let categoryArray = categories.split(",");
  for (let i = 0; i < categoryArray.length; i++) {
    categoryArray[i] = categoryArray[i].trim();
  }
  return categoryArray;
}
