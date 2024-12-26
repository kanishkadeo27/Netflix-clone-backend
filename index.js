const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require('./routes/auth');
dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true, deprecated
    // useCreateIndex:true,
}).then(() => console.log("db connection successful")).catch((err) => console.log(err));

// express server donnot accept json file by default
app.use(express.json());

app.use('/api/auth',authRoute);

app.listen(8800, () => {
    console.log("backend server is running");
})