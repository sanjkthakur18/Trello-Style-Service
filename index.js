const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv").config();
const authRoute = require('./src/routes/userRoutes');
const taskRoutes = require('./src/routes/taskRoute');

const app = express();

PORT = process.env.PORT || 4000

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

mongoose.connect('mongodb+srv://trello:trello@cluster0.ubdsi95.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => {
    console.log('DB Connected');
})
.catch((err) => {
    console.log(err);
});

app.get("/", (req, res) => {
    res.status(200).send("Hello");
})
app.get("/api", (req, res, next) => {
    res.status(200).send("API is working");
    next();
});
app.use('/api/user', authRoute);
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
});
