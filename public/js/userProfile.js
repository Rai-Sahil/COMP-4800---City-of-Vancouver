
document.addEventListener('DOMContentLoaded', function () {
    // Get references to the necessary elements
    const imageItems = document.querySelectorAll('.image-item img');
    const imageDialog = document.getElementById('imageDialog');
    const imageDialogImage = document.getElementById('imageDialogImage');
    const closeImageDialog = document.getElementById('closeImageDialog');
    const previousImage = document.getElementById('previousImage');
    const nextImage = document.getElementById('nextImage');

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

    // Event listener for image clicks
    imageItems.forEach((image, index) => {
        image.addEventListener('click', () => {
            openDialog(index);
        });
    });

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
});
