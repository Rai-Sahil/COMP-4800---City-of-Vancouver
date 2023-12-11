// This is the code that runs when an artist is clicked
document.addEventListener("DOMContentLoaded", function () {
  getArtist();
  // Get references to the necessary elements
  const imageItems = [];
  const imageDialog = document.getElementById("imageDialog");
  const imageDialogImage = document.getElementById("imageDialogImage");
  const closeImageDialog = document.getElementById("closeImageDialog");
  const previousImage = document.getElementById("previousImage");
  const nextImage = document.getElementById("nextImage");
  const notificationIcon = document.querySelector(".notification-icon");
  const modalBody = document.querySelector(".modal-body");
  let currentImageIndex = 0;

  // Function to open the image dialog
  const openDialog = (index) => {
    currentImageIndex = index;
    const imageUrl = imageItems[index].src;
    imageDialogImage.src = imageUrl;
    imageDialog.style.display = "block";
  };

  // Function to close the image dialog
  const closeDialog = () => {
    imageDialog.style.display = "none";
  };

  // Event listeners for image carousel
  previousImage.addEventListener("click", () => {
    currentImageIndex =
      (currentImageIndex - 1 + imageItems.length) % imageItems.length;
    openDialog(currentImageIndex);
  });

  // Event listeners for image carousel
  nextImage.addEventListener("click", () => {
    currentImageIndex = (currentImageIndex + 1) % imageItems.length;
    openDialog(currentImageIndex);
  });

  closeImageDialog.addEventListener("click", closeDialog);

  function getArtist() {
    let artistId = new URLSearchParams(window.location.search).get("id");
    fetch(`/artists/single?id=${artistId}`)
      .then((response) => response.json())
      .then((artist) => {
        document.getElementById("name").innerHTML = artist.name;
        biography.innerHTML = artist.biography;
        email.innerHTML += artist.email;
        phone.innerHTML += artist.phone;
        website.innerHTML = artist.website;
        facebookHandle.innerHTML = artist.facebookHandle;
        instagramHandle.innerHTML = artist.instagramHandle;
        const approvedDate = new Date(artist.approvedDate);
        const formattedDate = `${approvedDate.toLocaleDateString()} `;
        const expiryDate = new Date(artist.approvedDate);
        expiryDate.setFullYear(expiryDate.getFullYear() + 2);
        if (artist.approvedDate) {
          notificationIcon.innerHTML = `<i class="fa-regular fa-bell" data-toggle="modal" data-target="#approvedDateModal"></i>`;
          modalBody.innerHTML = `Approved on ${formattedDate}. Your application will expire on ${expiryDate.toLocaleDateString()}`;
        } else {
          notificationIcon.innerHTML = `<i class="fa-regular fa-bell"></i> Not yet approved`;
          modalBody.innerHTML = "This artist has not been approved yet.";
        }
        let genres = separateCategories(artist.genre);
        let cultures = separateCategories(artist.cultural);
        let mediums = separateCategories(artist.preference);
        for (let i = 0; i < genres.length; i++) {
          genre.innerHTML += `<li>${genres[i]}</li>`;
        }
        for (let i = 0; i < cultures.length; i++) {
          cultural.innerHTML += `<li>${cultures[i]}</li>`;
        }
        for (let i = 0; i < mediums.length; i++) {
          medium.innerHTML += `<li>${mediums[i]}</li>`;
        }
        const imageContainer = document.getElementById("images");
        for (let i = 0; i < artist.images.length; i++) {
          let outerDiv = document.createElement("div");
          outerDiv.className = "col-md-4 mb-3";

          let innerDiv = document.createElement("div");
          innerDiv.className = "image-item";

          let image = document.createElement("img");
          image.src = artist.images[i];
          image.className = "img-fluid";
          image.onclick = () => {
            openDialog(i);
          };
          imageItems.push(image);
          innerDiv.appendChild(image);
          outerDiv.appendChild(innerDiv);
          imageContainer.appendChild(outerDiv);
        }
      });
  }

  // Function to send a reminder email to the artist
  function sendReminderEmail() {
    let artistId = new URLSearchParams(window.location.search).get("id");
    // Make an HTTP GET request to fetch artist data
    fetch(`/artists/single?id=${artistId}`)
      .then((response) => response.json())
      .then((artist) => {
        // Extract the email from the artist data
        const userEmail = artist.email;

        // Make an HTTP POST request to the server endpoint with the userEmail
        fetch("/sendReminderEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data); // Log the server's response
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching artist data:", error);
      });
  }

  // Function to check if the user is logged in
  function isLoggedIn() {
    fetch(`/user-session`)
      .then((response) => response.json())
      .then((json) => {
        let artistId = new URLSearchParams(window.location.search).get("id");
        console.log(artistId == json.uuid);
        if (json.uuid == artistId) {
          document.getElementById(
            "artist-details"
          ).innerHTML += `<div class="row">
                        <div class="col-sm-12">
                    <a class="btn btn-primary " target="_blank" href="accountSettings?id=${artistId}">Edit</a>
                </div>
            </div>`;
        }
      });
  }
  isLoggedIn();

  // Call sendReminderEmail when needed
  sendReminderEmail();

  // Function to separate the categories
  function separateCategories(categories) {
    let categoryArray = categories.split(",");
    for (let i = 0; i < categoryArray.length; i++) {
      categoryArray[i] = categoryArray[i].trim();
    }
    return categoryArray;
  }
});
