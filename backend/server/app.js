const express=require('express');
const app=express();
const hbs = require('hbs');
const path=require('path');
require('../database/db');
const routes=require('../router/router');


const viewsPath=path.join(__dirname,'../../frontend/views');
const publicPath=path.join(__dirname,'../../frontend/public');
const headerPartialsPath=path.join(__dirname,'../../frontend/views/partials');
console.log(headerPartialsPath);

hbs.registerPartials(headerPartialsPath);
app.set('view engine','hbs')
app.set('views',viewsPath);


app.use(express.static(publicPath));

console.log(publicPath);
app.use(routes);

app.listen('3000',()=>{
    console.log("server fired off");
})