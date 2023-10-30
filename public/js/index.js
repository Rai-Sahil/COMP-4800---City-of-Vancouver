const MAX_FILESIZE_BYTES = 2000000; // 2MB
const ACCEPTED_FILE_EXTENSIONS = /jpeg|jpg|png/;
const MAX_AMOUNT_OF_FILES = 10;

function onChange()
{
    let files = document.getElementById('file').files;

    let images = document.getElementById('images');

    for (let i = 0; i < files.length; i++)
    {
        console.log(files[i]);
        let file = files[i];

        let reader = new FileReader();

        reader.onload = function(e)
        {
            let div = document.createElement('div');
            div.className = 'singleImage';

            let button = document.createElement('button');
            button.innerText = 'X';
            //button.className = 'imageButton';

            let img = document.createElement('img');
            img.src = e.target.result;
            img.width = 200;
            img.height = 200;

            
            div.appendChild(img);
            div.appendChild(button);
            images.appendChild(div);
        };

        reader.readAsDataURL(file);
    }
}

function upload()
{
    //Replace with artists Id
    let artistId = "john"

    let files = document.getElementById('file').files;

    if(files.length > MAX_AMOUNT_OF_FILES)
    {
        alert(`You can only upload ${MAX_AMOUNT_OF_FILES} files at a time`);
        return;
    }
    else if(files.length == 0)
    {
        alert(`You must select at least one file`);
        return;
    }

    let formData = new FormData();

    for (let i = 0; i < files.length; i++)
    {
        let file = files[i];

        if(file.size > MAX_FILESIZE_BYTES)
        {
            alert(`File ${file.name} is too large`);
            return;
        }

        formData.append('file', file, file.name);
    }

    fetch(`http://localhost:3000/upload?artistId=${artistId}`, 
    {
        method: 'POST',
        body: formData
    }).then(response => 
    {
        console.log(response);
    }).catch(error => 
    {
        console.error(error);
    });

}