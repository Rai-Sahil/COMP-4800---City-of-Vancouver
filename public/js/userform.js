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
