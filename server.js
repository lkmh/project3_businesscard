const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const methodOverride = require("method-override");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8000;

const connStr = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@ga.dijs6uo.mongodb.net/?retryWrites=true&w=majority`;
const multer = require("multer");
const upload = multer();

const auth_Middleware = require("./middlewares/auth_jwt_middleware");
const userController = require("./controllers/users/users_controller");
const pageController = require("./controllers/pages/page_controller");
const profileController = require("./controllers/profiles/profile_controller");
const cors = require("cors");
app.use(cors({
  origin: '*'
}))
// Set view engine
app.set("view engine", "ejs");

// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(methodOverride("X-HTTP-Method-Override"));
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false, httpOnly: false, maxAge: 7200000 },
//   })
// );

app.get("/", pageController.showHome);

// Users Routes
// app.get("/users/register", userController.showRegistrationForm);
app.post("/users/register", userController.register);
// app.get("/users/login", userController.showLoginForm);
app.post("/users/login", userController.login);
// app.post("/users/logout", userController.logout);

// profile
app.get("/profile", auth_Middleware, profileController.showInternalProfile);
app.get("/profile/edit", auth_Middleware, profileController.showEditInternalProfile);
app.post("/profile/edit", auth_Middleware, profileController.editInternalProfile);
app.post("/profile/delete", auth_Middleware, profileController.deleteInternalProfile); //delete 
// app.get("/profile/uploadphoto", auth_Middleware, profileController.showUploadPhoto);
app.post("/profile/uploadphoto", auth_Middleware, upload.single("uploaded_file"), profileController.uploadPhoto);
app.get("/profile/generateVCF", auth_Middleware, profileController.generateVCF);

// External
app.get("/:rfid", profileController.showExternalProfile);

app.listen(port, async () => {
  try {
    await mongoose.connect(connStr, { dbName: "tapcard" });
  } catch (err) {
    console.log(`Failed to connect to DB`);
    process.exit(1);
  }

  console.log(`Example app listening on port ${port}`);
});
