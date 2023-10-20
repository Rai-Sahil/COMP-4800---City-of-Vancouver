const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const secretToken = 'admin123';

const tempData = [];
const permanentUsers = [];
const rejectedUsers = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('views'));

app.post('/submit', (req, res) => {
    const user = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        website: req.body.website,
        instaHandle: req.body.instaHandle,
        facebookHandle: req.body.facebookHandle,
        bcResident: req.body.BCResident,
        experience: req.body.experience,
        experienceDescription: req.body.experienceDescription,
        biography: req.body.biography,
        genre: req.body.genre,
        cultural: req.body.cultural,
        preference: req.body.preference,

    };

    tempData.push(user);
});

app.use('/admin', (req, res, next) => {
    const token = req.query.token;

    if (token === secretToken) {
        res.send(generateAdminDashboard());
        next();
    } else {
        res.status(403).send('Access Denied');
    }
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
