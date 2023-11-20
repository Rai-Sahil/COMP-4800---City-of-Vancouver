const biographyLetterCountMaximum = 1000;
const experienceLetterCountMaximum = 500;
const errorMaximumLetterCount = 'Your text exceed the maximum character limit of ';
const errorNoGenreSelected = 'Please select at least one genre.';
const errorNoMediumSelected = 'Please select at least one medium.';

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

document.addEventListener('DOMContentLoaded', function () {
  var yesExperienceRadio = document.getElementById('yesExperience');
  var noExperienceRadio = document.getElementById('noExperience');
  var experienceDescription = document.getElementById('experienceDescription');

  yesExperienceRadio.addEventListener('change', function () {
    experienceDescription.required = this.checked;
  });

  noExperienceRadio.addEventListener('change', function () {
    experienceDescription.required = !this.checked;
  });

  document.getElementById('biography').addEventListener('input', function (e) {
    limitLetters(e, biographyLetterCountMaximum, 'letterCount');
  });

  document.getElementById('experienceDescription').addEventListener('input', function (e) {
    limitLetters(e, experienceLetterCountMaximum, 'experienceLetterCount');
  });


  document.getElementById('contactForm').addEventListener('submit', function (e) {
    var genreCheckboxes = document.querySelectorAll('input[name="genre"]:checked');
    var mediumCheckboxes = document.querySelectorAll('input[name="medium"]:checked');

    if (genreCheckboxes.length === 0) {
      alert(errorNoGenreSelected);
      e.preventDefault(); // Prevent the form from submitting
    } else if (mediumCheckboxes.length === 0) {
      alert(errorNoMediumSelected);
      e.preventDefault();
    }
  });
});

