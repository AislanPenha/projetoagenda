require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTIONSTRING)
    .then(()=> {
        console.log('Conected MongoDB');
        app.emit('start');
    })
    .catch(e => console.log(e));
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const routes = require('./routes');
const path = require('path');
const csrf = require('csurf');
const {csrfErrorMiddleware, csrfMiddleware, globalMiddleware} = require('./src/middlewares/middleware');
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));
const sessionOptions = session({
    secret: 'dfafda',
    store: MongoStore.create({mongoUrl: process.env.CONNECTIONSTRING}),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*60*60,
        httpOnly: true
    }
});
app.use(sessionOptions);
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');
app.use(csrf());

app.use(globalMiddleware);


app.use(csrfErrorMiddleware); 
app.use(csrfMiddleware);



app.use(routes);

app.on('start', ()=> {
    app.listen(3000, ()=>{
        console.log('http://localhost:3000');
    });
});
