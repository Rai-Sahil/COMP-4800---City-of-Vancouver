import Artist from './Artist.js';

let artistsContainer = document.getElementById("artistsContainer");

for (let i = 0; i < Artist.artists.length; i++)
{
    let artist = Artist.artists[i];

    let artistFigure = document.createElement("figure");
    artistFigure.classList.add("artist");

    let artistImage = document.createElement("img");
    //get a random number between from 0 - 8
    let randomImageIndex = Math.floor(Math.random() * 9);
    artistImage.src = artist.images[randomImageIndex];

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