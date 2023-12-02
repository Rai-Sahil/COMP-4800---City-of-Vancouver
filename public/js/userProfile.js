
document.addEventListener('DOMContentLoaded', function () {
    getArtist();
    // Get references to the necessary elements
    const imageItems = [];
    const imageDialog = document.getElementById('imageDialog');
    const imageDialogImage = document.getElementById('imageDialogImage');
    const closeImageDialog = document.getElementById('closeImageDialog');
    const previousImage = document.getElementById('previousImage');
    const nextImage = document.getElementById('nextImage');

    console.log(imageItems);
    let currentImageIndex = 0;

    // Function to open the image dialog
    const openDialog = (index) => {
        currentImageIndex = index;
        const imageUrl = imageItems[index].src;
        imageDialogImage.src = imageUrl;
        imageDialog.style.display = 'block';
    };

    // Function to close the image dialog
    const closeDialog = () => {
        imageDialog.style.display = 'none';
    };

    // Event listeners for navigation buttons
    previousImage.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + imageItems.length) % imageItems.length;
        openDialog(currentImageIndex);
    });

    nextImage.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % imageItems.length;
        openDialog(currentImageIndex);
    });

    closeImageDialog.addEventListener('click', closeDialog);

    function getArtist() 
    {
        let artistId = new URLSearchParams(window.location.search).get("id");

        fetch(`/artists/single?id=${artistId}`)
            .then(response => response.json())
            .then(artist => {
                document.getElementById("name").innerHTML = artist.name;
                biography.innerHTML = artist.biography;
                email.innerHTML += artist.email;
                phone.innerHTML += artist.phone;
                //website.href = artist.website;
                website.innerHTML = artist.website;
                //facebookHandle.href = artist.facebookHandle;
                facebookHandle.innerHTML = artist.facebookHandle;
                //instagramHandle.href = artist.instagramHandle;
                instagramHandle.innerHTML = artist.instagramHandle;


                let genres = separateCategories(artist.genre);
                let cultures = separateCategories(artist.cultural);
                let mediums = separateCategories(artist.preference);


                for (let i = 0; i < genres.length; i++)
                {
                    genre.innerHTML += `<li>${genres[i]}</li>`;
                }

                for (let i = 0; i < cultures.length; i++)
                {
                    cultural.innerHTML += `<li>${cultures[i]}</li>`;
                }

                for (let i = 0; i < mediums.length; i++)
                {
                    medium.innerHTML += `<li>${mediums[i]}</li>`;
                }
    
                const imageContainer = document.getElementById("images");

                for (let i = 0; i < artist.images.length; i++) 
                {
                    let outerDiv = document.createElement("div");
                    outerDiv.className = "col-md-4 mb-3";

                    let innerDiv = document.createElement("div");
                    innerDiv.className = "image-item";

                    let image = document.createElement("img");
                    image.src = artist.images[i];
                    image.className = "img-fluid";
                    image.onclick = () => {
                        openDialog(i);
                    }

                    imageItems.push(image);

                    innerDiv.appendChild(image);
                    outerDiv.appendChild(innerDiv);
                    imageContainer.appendChild(outerDiv);
                }
            });
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
});
