const MAX_FILESIZE_BYTES = 2000000; // 2MB
const ACCEPTED_FILE_EXTENSIONS = /jpeg|jpg|png/;
const MAX_AMOUNT_OF_FILES = 8;
const MIN_AMOUNT_OF_FILES = 3;

function onChange()
{
    let files = document.getElementById('image').files;

    let images = document.getElementById('images');
    images.innerHTML = '';

    for (let i = 0; i < files.length; i++)
    {
        let file = files[i];

        let reader = new FileReader();

        reader.onload = function(e)
        {
            let div = document.createElement('div');
            div.className = 'singleImage';

            let button = document.createElement('button');
            button.innerText = 'X';
            button.className = 'imageButton';

            button.onclick = function(e)
            {
                div.remove();
                let fileName = file.name;

                let imageFiles = document.getElementById('image').files;

                let newImageFiles = [];

                for (let i = 0; i < imageFiles.length; i++)
                {
                    if(imageFiles[i].name != fileName)
                    {
                        newImageFiles.push(imageFiles[i]);
                    }
                }

                const dt = new DataTransfer();
                for (let i = 0; i < newImageFiles.length; i++)
                {
                    dt.items.add(newImageFiles[i]);
                }

                document.getElementById('image').files = dt.files;
            }

            let img = document.createElement('img');
            img.src = e.target.result;
            img.width = 200;
            img.height = 200;

            let p = document.createElement('p');
            p.innerText = file.name;

            div.appendChild(button);
            div.appendChild(img);
            div.appendChild(p);
            images.appendChild(div);
        };

        reader.readAsDataURL(file);
    }
}

function upload()
{
    let form = document.getElementById('imageForm');
    let files = document.getElementById('image').files;

    if(files.length > MAX_AMOUNT_OF_FILES)
    {
        alert(`You can only upload ${MAX_AMOUNT_OF_FILES} files at a time`);
        return;
    }
    else if(files.length < MIN_AMOUNT_OF_FILES)
    {
        alert(`You must select at least ${MIN_AMOUNT_OF_FILES} file`);
        return;
    }

    let formData = new FormData();

    for (let i = 0; i < files.length; i++)
    {
        let file = files[i];

        if(file.size > MAX_FILESIZE_BYTES)
        {
            alert(`File ${file.name} is too large, must be less than ${MAX_FILESIZE_BYTES / 1000000} mb`);
            return;
        }

        if(!ACCEPTED_FILE_EXTENSIONS.test(file.type))
        {
            alert(`File ${file.name} must have one of the following extensions: ${ACCEPTED_FILE_EXTENSIONS}`);
            return;
        }

        formData.append('file', file, file.name);
    }

    form.submit();
}