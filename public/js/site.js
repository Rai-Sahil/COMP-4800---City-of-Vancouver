document.addEventListener('DOMContentLoaded', function () {
    fetch("header")
        .then((response) => response.text())
        .then((data) => {
            document.getElementById("header").innerHTML = data;
            var hamburger = document.querySelector('.hamburger');
            var navLinks = document.querySelector('.nav-links');
            var closeButton = document.querySelector('.close-button');

            hamburger.addEventListener('click', function () {
                navLinks.classList.toggle('show');
                closeButton.style.display = 'block';
            });

            closeButton.addEventListener('click', function () {
                navLinks.classList.remove('show');
                this.style.display = 'none';
            });

            document.addEventListener('click', function (event) {
                var isClickInside = hamburger.contains(event.target) || navLinks.contains(event.target);
                if (!isClickInside) {
                    navLinks.classList.remove('show');
                    closeButton.style.display = 'none';
                }
            });
        });
});