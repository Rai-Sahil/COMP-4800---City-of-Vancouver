const MAX_FILESIZE_BYTES = 2000000; // 2MB
const ACCEPTED_FILE_EXTENSIONS = /jpeg|jpg|png/;
const MAX_AMOUNT_OF_FILES = 8;
const MIN_AMOUNT_OF_FILES = 3;
let imagesReal = []; // Store previously uploaded images

function onChange() {
  let files = document.getElementById("image").files;
  let images = document.getElementById("images");

  // New files in addition to existing ones
  let allFiles = [...imagesReal, ...files];

  if (allFiles.length > MAX_AMOUNT_OF_FILES) {
    alert(`You can only upload ${MAX_AMOUNT_OF_FILES} files at a time`);
    return;
  } else if (allFiles.length < MIN_AMOUNT_OF_FILES) {
    alert(`You must select at least ${MIN_AMOUNT_OF_FILES} file`);
    return;
  }
  images.innerHTML = ""; // Clear previous images in UI

  allFiles.forEach((file) => {
    let reader = new FileReader();

    reader.onload = function (e) {
      let div = document.createElement("div");
      div.className = "singleImage";

      let button = document.createElement("button");
      button.innerText = "X";
      button.className = "imageButton";

      button.onclick = function (e) {
        div.remove();
        // Remove from imagesReal array on delete
        imagesReal = imagesReal.filter((img) => img.name !== file.name);
        updateFormInput();
      };

      let img = document.createElement("img");
      img.src = e.target.result;

      let p = document.createElement("p");
      p.innerText = file.name;

      div.appendChild(button);
      div.appendChild(img);
      div.appendChild(p);
      images.appendChild(div);
    };

    reader.readAsDataURL(file);
  });

  // Update imagesReal with the new files
  imagesReal = allFiles;
  updateFormInput();
}

function updateFormInput() {
  const dt = new DataTransfer();
  for (let i = 0; i < imagesReal.length; i++) {
    dt.items.add(imagesReal[i]);
  }

  document.getElementById("image").files = dt.files;
}

// Image upload validation
function upload() {
  let form = document.getElementById("contactForm");
  let files = imagesReal; // Use imagesReal instead of directly accessing input files

  if (files.length > MAX_AMOUNT_OF_FILES) {
    alert(`You can only upload ${MAX_AMOUNT_OF_FILES} files at a time`);
    return;
  } else if (files.length < MIN_AMOUNT_OF_FILES) {
    alert(`You must select at least ${MIN_AMOUNT_OF_FILES} file`);
    return;
  }

  for (let i = 0; i < files.length; i++) {
    let file = files[i];

    if (file.size > MAX_FILESIZE_BYTES) {
      alert(
        `File ${file.name} is too large, must be less than ${
          MAX_FILESIZE_BYTES / 1000000
        } mb`
      );
      return;
    }

    if (!ACCEPTED_FILE_EXTENSIONS.test(file.type)) {
      alert(
        `File ${file.name} must have one of the following extensions: ${ACCEPTED_FILE_EXTENSIONS}`
      );
      return;
    }
  }
  form.submit();
}
