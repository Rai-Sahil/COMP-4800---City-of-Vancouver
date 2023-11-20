const biographyLetterCountMaximum = 1000;
const experienceLetterCountMaximum = 500;
const errorMaximumLetterCount = 'Your text exceed the maximum character limit of ';


// Function to toggle the visibility of the experience description textarea and its label
function toggleExperienceDescription() {
  var descriptionTextArea = document.getElementById("experienceDescription");
  var descriptionLabel = document.getElementById("experienceDescriptionLabel");
  var yesExperienceRadio = document.getElementById("yesExperience");

  // Show the textarea and its label if "Yes" is selected, hide them otherwise
  if (yesExperienceRadio.checked) {
    descriptionTextArea.style.display = "block";
    descriptionLabel.style.display = "block";
    descriptionTextArea.required = true;
  } else {
    descriptionTextArea.style.display = "none";
    descriptionLabel.style.display = "none";
    descriptionTextArea.required = false;
  }
}

// Function that limits the number of letters in a textarea
function limitLetters(e, limit, counterElementId) {
  var letters = e.target.value.length;
  document.getElementById(counterElementId).style.display = 'block';
  document.getElementById(counterElementId).textContent = letters + '/' + limit;

  if (letters > limit) {
      document.getElementById(counterElementId).textContent = errorMaximumLetterCount + limit;
      document.getElementById(counterElementId).style.color = 'red';
      e.target.value = e.target.value.slice(0, limit);
  } else {
      document.getElementById(counterElementId).style.color = 'black';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('biography').addEventListener('input', function (e) {
    limitLetters(e, biographyLetterCountMaximum, 'letterCount');
  });

  document.getElementById('experienceDescription').addEventListener('input', function (e) {
    limitLetters(e, experienceLetterCountMaximum, 'experienceLetterCount');
  });
});