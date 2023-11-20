// Function to toggle the visibility of the experience description textarea and its label
function toggleExperienceDescription() {
  var descriptionTextArea = document.getElementById("experienceDescription");
  var descriptionLabel = document.getElementById("experienceDescriptionLabel");
  var yesExperienceRadio = document.getElementById("yesExperience");

  // Show the textarea and its label if "Yes" is selected, hide them otherwise
  descriptionTextArea.style.display = yesExperienceRadio.checked
    ? "block"
    : "none";
  descriptionLabel.style.display = yesExperienceRadio.checked
    ? "block"
    : "none";
}

document.getElementById('biography').addEventListener('input', function (e) {
  var letters = e.target.value.length;
  document.getElementById('letterCount').style.display = 'block';
  document.getElementById('letterCount').textContent = letters + '/1000 letters';

  if (letters > 1000) {
      document.getElementById('letterCount').textContent = 'Your biography cannot exceed 1000 letters.';
      document.getElementById('letterCount').style.color = 'red';
      e.target.value = e.target.value.slice(0, 1000);
  } else {
      document.getElementById('letterCount').style.color = 'black';
  }
});