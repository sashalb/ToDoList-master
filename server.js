//environment variables
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

//libraries
const express = require('express');
const app = express();
const crypto = require('crypto'); 
const bcrypt = require('bcrypt');       //using bcrypt library to hash passwords
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const sqlite3 = require('sqlite3').verbose();

var dbcontext = require('./dbcontext.js');
let loggedUser = require('./dbcontext.js');
const LoggedUser = require('./dbcontext.js');



// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

app.set('view-engine', 'ejs');      //tell the server we're using ejs and its syntax
app.use(express.urlencoded({extended: false}));     //telling app to take forms and access to them via request variable inside of a post method
app.use(flash());
app.use(session({
    secret: "secret",
    resave: false,
    cookie: { maxAge: oneDay },
    saveUninitialized: true
}));

app.use(function (req, res, next) {
    res.locals.username = req.session.username ;
    res.locals.email = req.session.email ;
    next();
  });

app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));

//routing setup for the application
app.get('/edit', async  function  (req, res)  {
    if(req.session.user !=null || req.session.user !=undefined)
    {
       
        if(app.locals.listindex!=undefined)
        {
            console.log("app.locals.listindex:" + app.locals.listindex);
            const rtn =  await dbcontext.GetUserListsItems(app.locals.listindex);
            console.log(rtn);
            if (rtn.length > 0)
                req.flash('allRowsItems', rtn);
            else
                req.flash('allRowsItems', null);

                res.render('edit.ejs');
        }    
        

       
    }       
    else
        res.render('login.ejs');
})

app.get('/', async function (req, res)  {
    if(req.session.user !=null || req.session.user !=undefined)
    {
        console.log("app.locals.listindex:" + app.locals.listindex);
        if(app.locals.listindex!=undefined)
        {
            const rtn =  await dbcontext.GetUserListsItems(app.locals.listindex);
            console.log(rtn);
            if (rtn.length > 0)
                req.flash('allRowsItems', rtn);
            else
                req.flash('allRowsItems', null);
        }
        res.render('lists.ejs');
    }
    else
        res.render('login.ejs');
})

app.get('/lists',async  function (req, res) {
    if(req.session.user!=null || req.session.user!=undefined)
     {
        console.log(req.session.iduser);
        const rtn =  await dbcontext.GetUserLists(req.session.iduser);
        console.log(rtn);
        if (rtn.length > 0)
            req.flash('allRows', rtn);
        else
            req.flash('allRows', null);
       
        res.render('lists.ejs');
     }
   
    else
        res.render('login.ejs');
})

app.get('/profile', async function (req, res){
    if(req.session.user !=null || req.session.user !=undefined)
     {  
        console.log("entro in profile");
        console.log(req.session.email);
        req.flash('email', req.session.email);
        
        res.render('profile.ejs');
     }
   
    else
        res.render('login.ejs');
})

app.get('/login', (req, res) => {
    res.render('login.ejs');
})

app.get('/register', (req, res) => {
    res.render('register.ejs');
})

// POST LOGIN FOR AUTENTHICATION
app.post('/login', async  function (req, res)  { 
    console.log( "Invio:" + req.body.email);
   
    var email = req.body.email;
    var password = req.body.password;
    
    // CALL DOAUTHENTICATE FOR LOGIN
    const rtn =  await dbcontext.doAuthenticate(email,password);
    
    if(rtn!=undefined)
    {
        let loggeduser = new loggedUser(rtn.ID,rtn.UserName,rtn.Email, rtn.Password);
        req.session.user = loggeduser;
        req.session.username = loggeduser.username;
        req.session.iduser = loggeduser.id;
        req.session.email = loggeduser.email;
        req.session.save();

        console.log("Login Eseguito con successo");
        req.flash('username', loggeduser.username);
        req.flash('email', loggeduser.email);
    
        res.redirect('/lists');
    }
    else
    {
        console.log("Login fallito");
        req.flash('error', "Bad username or password!!");
        disconnect(req,res);  
    }
 });    

// POST FUNCTION FOR REGISTER A NEW USER
app.post('/register', async function(req, res)  {         //asyncronous function
    try{
        console.log('entro in register');
       
        var email = req.body.email;
        var username = req.body.name;
        var password = req.body.password;
        const rtn =  await dbcontext.doRegister(username,email,password);
        console.log(rtn);
        if(rtn)
            res.redirect('/login');     //after complete registration, redirect to login page
        else 
            res.redirect('/register');
    }catch{
        res.redirect('/register');      //redirects to register page in case of error
    }
   
})

app.post('/changeUser', async function(req, res, next){
    console.log("entro in changeUser");
    var newUsername = req.body.description;
    var idUser = req.session.iduser
    if(newUsername != ""){
        console.log(newUsername);
        //const rtn = await dbcontext.LoggedUser.setUsername(newUsername);
        const rtn = await dbcontext.changeUsername(newUsername, idUser);
        console.log(rtn);
        if(rtn)
        {
            req.flash('username', newUsername);
            req.session.username = newUsername;
            res.locals.username = req.session.username ;
            req.session.save();
            res.render('profile.ejs');
        }
        
    }
});

// POST FUNCTION TO CREATE AN USER TODO LIST
app.post('/createlists',async function(req, res, next){
    console.log("entro");
    var description = req.body.description;
    var idUser =  req.session.iduser;
    if(description != "")
    {
        console.log(description);
        console.log(idUser);
        const lastindex =  await dbcontext.InsertUserList(description,idUser);
        if(lastindex != -1)
        {
            console.log(lastindex);
            // const rtn1 =  await dbcontext.GetUserLists(req.session.iduser);
            // console.log(rtn1);
            app.locals.listindex = lastindex;
            app.locals.descriptionList = description;

            // req.flash('allRows', rtn1);
            res.render('edit.ejs');
        }   
    }
});

// POST FUNCTION TO DELETE AN USER TODO LIST
app.post('/deletelists',async function(req, res, next){
    console.log("entro delete");
    var IdItem = req.body.IdItem;
  
        console.log(IdItem);
        const rtn =  await dbcontext.DeleteUserList(IdItem);
        console.log(rtn);

        const rtn1 =  await dbcontext.GetUserLists(req.session.iduser);
        console.log(rtn1);
        if (rtn1.length > 0)
             req.flash('allRows', rtn1);
        else
            req.flash('allRows', null);
       
        res.render('lists.ejs');
  
});

// POST FUNCTION TO OPEN AN USER TODO LIST
app.post('/openlists',async function(req, res, next){
    console.log("entro openlists");
    var IdItem = req.body.IdItem;
    var NomeLista = req.body.Nome;
  
    app.locals.listindex = IdItem;
    app.locals.descriptionList = NomeLista;

    console.log(app.locals.listindex);
    console.log(app.locals.descriptionList);
    res.render('edit.ejs');
  
});

// POST FUNCTION TO INSERT A NEW ITEM IN A LIST
app.post('/insertitemlist',async function(req, res, next){
    console.log("entro insertitemlist");
    var description = req.body.description;
    var listId = req.body.listId;
  
    console.log(description);
    
    const rtn1 =  await dbcontext.InsertItemUserList(description,listId);
    console.log(rtn1);
    
    app.locals.listindex = listId;

    console.log(app.locals.listindex);

    res.render('edit.ejs');
});

//LOGOUT
app.delete('/logout', function(req, res, next){
   
        disconnect(req,res);
});

// SHARED FUNCTION TO DISCONNECT
function disconnect(req,res)
{
    if(req!=undefined && req!=null){
        req.session.user = null;
        req.session.save();
        req.flash('username', null);
        res.redirect('/login');
    }
   
}

app.listen(3000);       //application running on port 3000