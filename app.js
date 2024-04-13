require("dotenv").config();
const express=require("express");
const expressLayout=require("express-ejs-layouts")
const connectDB = require('./server/config/db')
const app = express();
const cookieParser = require('cookie-parser');
const { checkUser } = require('./middleware/authMiddleware');
const errorHandler = require("./middleware/errorHandler");
const helmet = require('helmet');
const ratelimit = require("./middleware/ratelimit");

app.use(ratelimit)
const PORT = 3000 

connectDB();
app.use(express.urlencoded({ extended: true }));
app.use(helmet())
app.use(express.json()); 
app.use(cookieParser())

app.use(express.static('public'));

app.use(expressLayout);
app.set('layout', './layouts/main')
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/main'));
app.get('*', checkUser);
app.use(errorHandler)

app.listen(PORT,()=>{
    console.log(`App listening on port ${PORT}`)
})