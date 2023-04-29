require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const fileUpload = require('express-fileupload')
const path = require('path')
const session = require('express-session')


const PORT = process.env.PORT || 5000


const app = express()

app.use(session({
    secret: process.env.SECRET_KEY, 
    resave: false, 
    saveUninitialized: true,
}))
app.use(  cors({
    origin: "*",
  }));
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'tmp')))
app.use(fileUpload({}))
app.use('/api', router)


app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, ()=> console.log(`Server started on a port ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}
 
start()

