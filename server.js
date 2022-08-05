require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')


const app = express();
const port = process.env.PORT || 3000;

const connStr = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@ga.dijs6uo.mongodb.net/?retryWrites=true&w=majority`

const auth_Middleware = require('./middlewares/auth_middleware')
const userController = require('./controllers/users/users_controller')
const pageController = require('./controllers/pages/page_controller')

// Set view engine
app.set('view engine', 'ejs')

//this is to convert the data from the form
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: false, maxAge: 7200000 }
}))

app.use(auth_Middleware.setAuthUserVar)
// app.use(auth_Middleware.isAuthenticated)


app.get('/', pageController.showHome)

// Users Routes
app.get('/users/register', userController.showRegistrationForm)
app.post('/users/register', userController.register)
app.get('/users/login', userController.showLoginForm)
app.post('/users/login', userController.login)
app.post('/users/logout', userController.logout)

// should this be a profile route ?
app.get('/users/profile', auth_Middleware.isAuthenticated, userController.showProfile)


app.listen(port, async () => {
  try {
      await mongoose.connect(connStr, { dbName: 'tapcard'})
  } catch(err) {
      console.log(`Failed to connect to DB`)
      process.exit(1)
  }

  console.log(`Example app listening on port ${port}`)
})