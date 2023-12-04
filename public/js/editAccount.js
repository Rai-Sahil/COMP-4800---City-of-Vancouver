
document.addEventListener('DOMContentLoaded', function () {
    getArtist();
    function getArtist() 
    {
        let artistId = new URLSearchParams(window.location.search).get("id");
        

        fetch(`/artists/single?id=${artistId}`)
            .then(response => response.json())
            .then(artist => {
                console.log(artist);
                document.getElementById("name").value = artist.name;
                document.getElementById("phone").value = artist.phone;
                document.getElementById("website").value = artist.website;

                if (artist.instagramHandle) {
                    document.getElementById("instagramHandle").value = artist.instagramHandle;
                }
                if (artist.facebookHandle) {
                    document.getElementById("facebookHandle").value = artist.facebookHandle;
                }
                
                document.getElementById("biography").value = artist.biography;

                let genres = separateCategories(artist.genre);
                console.log(genres);
                let genreBox = document.getElementsByName("genre");
                for (let i = 0; i < genreBox.length; i++) {
                    if (genres.includes(genreBox[i].value)) {
                        genreBox[i].checked = true;
                    }
                }

                
                let cultures = separateCategories(artist.cultural);

                let cultureBox = document.getElementsByName("cultural");
                for (let i = 0; i < cultureBox.length; i++) {
                    if (cultures.includes(cultureBox[i].value)) {
                        cultureBox[i].checked = true;
                    }
                }

                console.log(cultures);
                let mediums = separateCategories(artist.preference);  

                let mediumBox = document.getElementsByName("preference");
                for (let i = 0; i < mediumBox.length; i++) {
                    if (mediums.includes(mediumBox[i].value)) {
                        mediumBox[i].checked = true;
                    }
                }
                console.log(mediums); 
                
                
            });
                
    }
    function isLoggedIn() {
        fetch(`/user-session`)
            .then(response => response.json())
            .then(json => {
                let artistId = new URLSearchParams(window.location.search).get("id");
                console.log(artistId == json.uuid);
                if (json.uuid == artistId) {
                    
                                 
                }
                console.log(json);
            });
    }
    isLoggedIn();

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

let passwordForm = document.getElementById("passwordForm");
let profileForm = document.getElementById("profileForm");

let accountNav = document.getElementById("accountTab");
let profileNav = document.getElementById("profileTab");

function swapPasswordTab()
{
    accountNav.classList.add("active");
    profileNav.classList.remove("active");
    profileForm.hidden = true;
    passwordForm.hidden = false;
} 

function swapProfileTab() 
{
    profileNav.classList.add("active");
    accountNav.classList.remove("active");
    passwordForm.hidden = true;
    profileForm.hidden = false;

}
