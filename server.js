const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(__dirname));

const fs = require("fs");
const path = require("path");

app.post("/submit", (req, res) => {

    console.log("BODY RECEIVED:", req.body);

    const { name, gender, phone, email } = req.body;

    if (!name || !gender || !phone || !email) {
        return res.send("All fields are required ❌");
    }

    if (!/^\d{10}$/.test(phone)) {
        return res.send("Phone number must be 10 digits ❌");
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
        return res.send("Invalid email format ❌");
    }

    const newEntry = {
        name,
        gender,
        phone,
        email,
        time: new Date().toLocaleString()
    };

    const filePath = path.join(__dirname, "data.json");

    let existingData = [];

    if (fs.existsSync(filePath)) {
        existingData = JSON.parse(fs.readFileSync(filePath));
    }

    existingData.push(newEntry);

    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

    res.redirect("/success.html");
});

app.get("/admin", (req, res) => {
    const filePath = path.join(__dirname, "data.json");

    if (!fs.existsSync(filePath)) {
        return res.send("No registrations yet.");
    }

    const data = JSON.parse(fs.readFileSync(filePath));

    let html = `
        <h1>Registered Users</h1>
        <table border="1" cellpadding="10">
            <tr>
                <th>Name</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Time</th>
            </tr>
    `;

    data.forEach(user => {
        html += `
            <tr>
                <td>${user.name}</td>
                <td>${user.gender}</td>
                <td>${user.phone}</td>
                <td>${user.email}</td>
                <td>${user.time}</td>
            </tr>
        `;
    });

    html += "</table>";

    res.send(html);
});
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/Trail.html");
});

app.post("/admin-login", (req, res) => {
    const { username, password } = req.body;

    // Simple hardcoded credentials
    const ADMIN_USER = "sandesh";
    const ADMIN_PASS = "chsandesh254t";

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        res.redirect("/admin");
    } else {
        res.send("Invalid credentials ❌");
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
