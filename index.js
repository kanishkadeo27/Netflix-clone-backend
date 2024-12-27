const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const movieRoute = require('./routes/movies');
dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
}).then(() => console.log("db connection successful")).catch((err) => console.log(err));

// express server donnot accept json file by default
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/movies', movieRoute);

app.listen(8800, () => {
    console.log("backend server is running");
})