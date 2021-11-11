// Importing modules
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const flash = require('connect-flash');
// Importing config
const config = require("./config/config");

// Routers
const pageRoute = require("./routes/pageRoute");
const courseRoute = require("./routes/courseRoute");
const categoryRoute = require("./routes/categoryRoute");
const userRoute = require("./routes/userRoute")

// Database
mongoose.connect(config.conf.dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("DB Connected.");
});

const app = express();
// Temp engine
app.set("view engine", "ejs");

// Global variable
global.userIN = null;

// Middleware
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
  secret: "cos",
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: config.conf.dbURL }),
}));
app.use(methodOverride("_method", {methods: ["POST", "GET"]}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash("");
  next();
});

// Routes
app.use("*", (req, res, next) => {
  userIN = req.session.userID;
  next();
});
app.use("/", pageRoute);
app.use("/courses", courseRoute);
app.use("/categories", categoryRoute);
app.use("/users", userRoute);


// Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Sunucu ${port} portunda başlatıldı.`);
});
