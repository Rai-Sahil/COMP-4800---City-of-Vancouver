const userCard = document.getElementById('user-card');

fetch('/admin/user_application')
    .then(response => response.json())
    .then(data => {
        console.log('Client side data: ', data);
        data.forEach(user => {
            const htmlElement = `<h3 >${user.name}'s Application Form:</h3>
        <p>Email: ${user.email}</p>
        <p>Phone: ${user.phone}</p>
        <p>Website: ${user.website}</p>
        <p>Instagram: ${user.instagramHandle}</p>
        <p>Facebook: ${user.facebookHandle}</p>
        <p>BC Resident: ${user.bcResident}</p>
        <p>Experience: ${user.experience}</p>
        <p>Experience Description: ${user.experienceDescription}</p>
        <p>Biography: ${user.biography}</p>
        <p>Genres: ${Array.isArray(user.genre) ? user.genre.join(", ") : user.genre
                }</p>
        <p>Cultural Categories: ${Array.isArray(user.cultural)
                    ? user.cultural.join(", ")
                    : user.cultural
                }</p>
        <p>Preferences: ${Array.isArray(user.preference)
                    ? user.preference.join(", ")
                    : user.preference
                }</p>
        <div class="button-container">
            <form method="POST" action="/accept/${user.email}">
                <button type="submit" class="accept-button">Accept</button>
            </form>
            <form method="POST" action="/reject/${user.email}">
                <button type="submit" class="reject-button">Reject</button>
            </form>
        </div>`

            userCard.insertAdjacentHTML('beforeend', htmlElement);
        });
    });
