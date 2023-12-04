const userCard = document.getElementById('user-card');

fetch('/admin/user_application')
    .then(response => response.json())
    .then(data => {
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
            <form method="POST" action="#">
                <button type="button" class="reject-button" data-email="${user.email}" data-uuid="${user.uuid}">Reject</button>
            </form>
        </div>`

            userCard.insertAdjacentHTML('beforeend', htmlElement);
        });
    });


userCard.addEventListener('click', event => {
    if (event.target.classList.contains('reject-button')) {
        // Get user's UUID from the button's data-attribute
        const userEmail = event.target.dataset.email;
        const userUUID = event.target.dataset.uuid;
        console.log('Client side user UUID: ', userUUID);
        console.log('Client side user email: ', userEmail);
        // Show a dialog box/modal for comment input
        const comment = prompt('Enter your rejection comment:');
        console.log(comment);
        if (comment !== null) {
            // If the user entered a comment, submit it along with user UUID
            fetch(`/reject/${userEmail}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ comment: comment, uuid: userUUID })
            })
                .then(response => {
                    if (response.ok) {
                        // Handle successful submission, e.g., remove the user card or update UI
                        event.target.closest('.user-card').remove(); // Remove the user card
                    } else {
                        throw new Error('Failed to submit comment');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    // Handle error, show message to user, etc.
                });
        }
    }
});

