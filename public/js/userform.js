const biographyLetterCountMaximum = 1000; // Adjust based on your requirements
const experienceLetterCountMaximum = 1000; // Adjust based on your requirements
const errorMaximumLetterCount =
  "Your text exceed the maximum character limit of ";
const errorNoGenreSelected = "Please select at least one genre.";
const errorNoMediumSelected = "Please select at least one medium.";

// Function that limits the number of letters in a textarea
function limitLetters(e, limit, counterElementId) {
  var letters = e.target.value.length;
  document.getElementById(counterElementId).style.display = "block";
  document.getElementById(counterElementId).textContent = letters + "/" + limit;

  if (letters > limit) {
    document.getElementById(counterElementId).textContent =
      errorMaximumLetterCount + limit;
    document.getElementById(counterElementId).style.color = "red";
    e.target.value = e.target.value.slice(0, limit);
  } else {
    document.getElementById(counterElementId).style.color = "black";
  }
}

// Function that toggles the experience description textarea
function toggleExperienceDescription() {
  var experienceDescriptionLabel = document.getElementById(
    "experienceDescriptionLabel"
  );
  var experienceDescription = document.getElementById("experienceDescription");
  var experienceLetterCount = document.getElementById("experienceLetterCount");
  var yesExperience = document.getElementById("yesExperience");

  var errorMessage2 = document.getElementById("error-message-2");

  if (yesExperience.checked) {
    experienceDescriptionLabel.style.display = "block";
    experienceDescription.style.display = "block";
    experienceLetterCount.style.display = "none";
    errorMessage2.style.display = "none";
  } else {
    errorMessage2.style.display = "block";
    experienceDescriptionLabel.style.display = "none";
    experienceDescription.style.display = "none";
    experienceLetterCount.style.display = "none";
  }
}

//Function that toggles the residency question
function toggleResidency() {
  var noResident = document.getElementById("noBC");
  var errorMessage1 = document.getElementById("error-message-1");
  if (noResident.checked) {
    errorMessage1.style.display = "block";
  } else {
    errorMessage1.style.display = "none";
  }
}

// Function that checks if the user has selected at least one genre and one medium
document.addEventListener("DOMContentLoaded", function () {
  var yesExperienceRadio = document.getElementById("yesExperience");
  var noExperienceRadio = document.getElementById("noExperience");
  var experienceDescription = document.getElementById("experienceDescription");
  yesExperienceRadio.addEventListener("change", function () {
    experienceDescription.required = this.checked;
    toggleExperienceDescription();
  });
  noExperienceRadio.addEventListener("change", function () {
    experienceDescription.required = !this.checked;
  });
  document.getElementById("biography").addEventListener("input", function (e) {
    limitLetters(e, biographyLetterCountMaximum, "bioLetterCount");
  });
  document
    .getElementById("experienceDescription")
    .addEventListener("input", function (e) {
      limitLetters(e, experienceLetterCountMaximum, "experienceLetterCount");
    });

  // Function that checks if the user has selected the radio button for BC residency and experience
  document
    .getElementById("contactForm")
    .addEventListener("submit", function (e) {
      e.preventDefault(); // prevent the default form submission
      var noBC = document.getElementById("noBC").checked;
      var noExperience = document.getElementById("noExperience").checked;
      if (this.checkValidity()) {
        // check if the form has passed validation
        if (noBC || noExperience) {
          alert(
            "If you are not a BC resident or do not have experience, you cannot apply for the Artist Roster program."
          );
          e.preventDefault(); // Prevent the form from submitting
        } else if (checkCheckBoxes()) {
          upload();
        }
      }
    });

  // Function that checks if the user has selected at least one genre and one medium
  function checkCheckBoxes() {
    var genreCheckboxes = document.querySelectorAll(
      'input[name="genre"]:checked'
    );
    var mediumCheckboxes = document.querySelectorAll(
      'input[name="medium"]:checked'
    );
    if (genreCheckboxes.length === 0) {
      alert(errorNoGenreSelected);
      e.preventDefault(); // Prevent the form from submitting
      return false;
    } else if (mediumCheckboxes.length === 0) {
      alert(errorNoMediumSelected);
      e.preventDefault();
      return false;
    } else {
      return true;
    }
  }
});
