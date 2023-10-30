
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
            let img = document.createElement('img');
            img.src = e.target.result;
            img.width = 200;
            img.height = 200;
            images.appendChild(img);
        };

        reader.readAsDataURL(file);
    }
}

function upload()
{
    let artistId = "john"

    let files = document.getElementById('file').files;

    let formData = new FormData();

    for (let i = 0; i < files.length; i++)
    {
        let file = files[i];

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