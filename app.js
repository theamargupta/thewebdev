const express = require('express')
const app= express()


const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
let sessionOPtions = session({
    secret: "javaScript is good",
    store: new MongoStore({client: require('./db')}),
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000*60*60*24, httpOnly: true}
})
app.use(sessionOPtions)

const router = require('./router')

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'ejs')

app.use('/', router)


module.exports = app