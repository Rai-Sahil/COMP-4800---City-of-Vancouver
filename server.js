const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const tempData = [];
const permanentUsers = [];
const rejectedUsers = [];

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/userform.html');
});

app.post('/submit', (req, res) => {
    const user = {
        name: req.body.name,
        description: req.body.description,
        instaHandle: req.body.instaHandle,
        facebookHandle: req.body.facebookHandle,
    };

    tempData.push(user);
});

app.get('/admin', (req, res) => {
    res.send(generateAdminDashboard());
});

app.post('/accept/:index', (req, res) => {
    const index = req.params.index;
    const user = tempData[index];

    permanentUsers.push(user);

    tempData.splice(index, 1);

    console.log('permanentUsers', permanentUsers);
    console.log('tempData', tempData);

    res.send(generateAdminDashboard());
});

app.post('/reject/:index', (req, res) => {
    const index = req.params.index;
    const user = tempData[index];

    rejectedUsers.push(user);

    tempData.splice(index, 1);

    res.send(generateAdminDashboard());
});

function generateAdminDashboard() {
    let dashboard = '<h1>Admin Dashboard</h1>';
    tempData.forEach((user, index) => {
        dashboard += `
    <div class="user-card">
        <h3>${user.name}</h3>
        <p>${user.description}</p>
        <p>Instagram: ${user.instaHandle}</p>
        <p>Facebook: ${user.facebookHandle}</p>
        <form method="POST" action="/accept/${index}">
            <button type="submit">Accept</button>
        </form>
        <form method="POST" action="/reject/${index}">
            <button type="submit">Reject</button>
        </form>
    </div>
    `;
    });

    return dashboard;
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
