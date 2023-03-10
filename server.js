<<<<<<< HEAD
//NODE SERVER SETUP


//ENVIRONMENT VARIABLES
=======
//environment variables
>>>>>>> c74b2b9689d36f84521e5d743f16ae23bb2a0c43
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

<<<<<<< HEAD


//LIBRARIES
const express = require('express');
const app = express();
const crypto = require('crypto'); 
const bcrypt = require('bcrypt');
=======
//libraries
const express = require('express');
const app = express();
const crypto = require('crypto'); 
const bcrypt = require('bcrypt');       //using bcrypt library to hash passwords
>>>>>>> c74b2b9689d36f84521e5d743f16ae23bb2a0c43
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const sqlite3 = require('sqlite3').verbose();
let alert = require('alert');
var dbcontext = require('./dbcontext.js');
let loggedUser = require('./dbcontext.js');
const LoggedUser = require('./dbcontext.js');
<<<<<<< HEAD
const oneDay = 1000 * 60 * 60 * 24;                 //creating 24 hours from milliseconds



//SET AND USE FOR LIBRARIES AND VARIABLES
app.set('view-engine', 'ejs');                      //tell the server we're using ejs and its syntax
=======



// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

app.set('view-engine', 'ejs');      //tell the server we're using ejs and its syntax
>>>>>>> c74b2b9689d36f84521e5d743f16ae23bb2a0c43
app.use(express.urlencoded({extended: false}));     //telling app to take forms and access to them via request variable inside of a post method
app.use(flash());
app.use(session({
    secret: "secret",
    resave: false,
    cookie: { maxAge: oneDay },
    saveUninitialized: true
}));

app.use(function (req, res, next) {
<<<<<<< HEAD
    res.locals.username = req.session.username;
    res.locals.email = req.session.email;
=======
    res.locals.username = req.session.username ;
    res.locals.email = req.session.email ;
>>>>>>> c74b2b9689d36f84521e5d743f16ae23bb2a0c43
    next();
  });

app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));

<<<<<<< HEAD

//ROUTING SETUP FOR THE PAGES
=======
//routing setup for the application
app.get('/edit', async  function  (req, res)  {
    if(req.session.user !=null || req.session.user !=undefined)
    {
       
        if(app.locals.listindex!=undefined && 
            app.locals.listindex!=-1 )
        {
            console.log("app.locals.listindex:" + app.locals.listindex);
            const rtn =  await dbcontext.GetUserListsItems(app.locals.listindex);
            console.log(rtn);
            if (rtn.length > 0)
                req.flash('allRowsItems', rtn);
            else
                req.flash('allRowsItems', null);

                
        }  
        else
        {
            app.locals.descriptionList = "";  
            console.log("app.locals.listindex: undefined");
            app.locals.listindex=-1;
        }
       

        res.render('edit.ejs');
       
    }       
    else
        res.render('login.ejs');
})

>>>>>>> c74b2b9689d36f84521e5d743f16ae23bb2a0c43
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
<<<<<<< HEAD
});
=======
})
>>>>>>> c74b2b9689d36f84521e5d743f16ae23bb2a0c43

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
<<<<<<< HEAD
});

app.get('/edit', async  function  (req, res)  {
    if(req.session.user !=null || req.session.user !=undefined)
    {
       
        if(app.locals.listindex!=undefined && 
            app.locals.listindex!=-1 )
        {
            console.log("app.locals.listindex:" + app.locals.listindex);
            const rtn =  await dbcontext.GetUserListsItems(app.locals.listindex);
            console.log(rtn);
            if (rtn.length > 0)
                req.flash('allRowsItems', rtn);
            else
                req.flash('allRowsItems', null);     
        }  
        else
        {
            app.locals.descriptionList = "";  
            console.log("app.locals.listindex: undefined");
            app.locals.listindex=-1;
        }
       

        res.render('edit.ejs');
       
    }       
    else
        res.render('login.ejs');
});
=======
})
>>>>>>> c74b2b9689d36f84521e5d743f16ae23bb2a0c43

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

<<<<<<< HEAD

//POST FUNCTIONS TO SEND DATA TO THE DATABASE

//LOGIN WITH AUTHENTICATION
=======
// POST LOGIN FOR AUTENTHICATION
>>>>>>> c74b2b9689d36f84521e5d743f16ae23bb2a0c43
app.post('/login', async  function (req, res)  { 
    console.log( "Invio:" + req.body.email);
   
    var email = req.body.email;
    var password = req.body.password;
    
<<<<<<< HEAD
    const rtn =  await dbcontext.doAuthenticate(email,password);        //call doAuthenticate for login
    
    if(rtn!=undefined)
    {
=======
    // CALL DOAUTHENTICATE FOR LOGIN
    const rtn =  await dbcontext.doAuthenticate(email,password);
    
    if(rtn!=undefined)
    {

>>>>>>> c74b2b9689d36f84521e5d743f16ae23bb2a0c43
        console.log(rtn.ID);
        console.log(rtn.UserName);
        console.log(rtn.Email);
        console.log(rtn.Password);

        let loggeduser = new loggedUser(rtn.ID,rtn.UserName,rtn.Email, rtn.Password);
        req.session.user = loggeduser;
        req.session.username = loggeduser.username;
        req.session.iduser = loggeduser.id;
        req.session.email = loggeduser.email;
        req.session.password = rtn.Password;
        req.session.save();

        console.log("Login Eseguito con successo");
        req.flash('username', loggeduser.username);
        req.flash('email', loggeduser.email);
        
        console.log(req.session.password );
        req.flash('email', loggeduser.Password);
    
        res.redirect('/lists');
    }
    else
    {
        console.log("Login fallito");
        req.flash('error', "Incorrect username or password!!");
        disconnect(req,res);  
    }
<<<<<<< HEAD
});    

//REGISTRATION OF A NEW USER
app.post('/register', async function(req, res)  { 
=======
 });    

// POST FUNCTION FOR REGISTER A NEW USER
app.post('/register', async function(req, res)  {         //asyncronous function
>>>>>>> c74b2b9689d36f84521e5d743f16ae23bb2a0c43
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
<<<<<<< HEAD
});

//CHANGE USERNAME
=======
   
})

>>>>>>> c74b2b9689d36f84521e5d743f16ae23bb2a0c43
app.post('/changeUser', async function(req, res, next){
    console.log("entro in changeUser");
    var newUsername = req.body.description;
    var idUser = req.session.iduser
    if(newUsername != ""){
        console.log(newUsername);
<<<<<<< HEAD
=======
        //const rtn = await dbcontext.LoggedUser.setUsername(newUsername);
>>>>>>> c74b2b9689d36f84521e5d743f16ae23bb2a0c43
        const rtn = await dbcontext.changeUsername(newUsername, idUser);
        console.log(rtn);
        if(rtn)
        {
            req.flash('username', newUsername);
            req.session.username = newUsername;
            res.locals.username = req.session.username ;
            req.session.save();
            res.render('profile.ejs');
<<<<<<< HEAD
        } 
    }
});

//CHANGE PASSWORD
=======
        }
        
    }
});

// POST FUNCTION TO CHANGE PASSWORD
>>>>>>> c74b2b9689d36f84521e5d743f16ae23bb2a0c43
app.post('/changePassword', async function(req, res, next){
    console.log("entro in changePassword");
    console.log(req.session.password);
    var oldPsw = req.body.oldpassword;
    var newPsw = req.body.newpassword;
    var idUser = req.session.iduser;

<<<<<<< HEAD
    if(newPsw != ""){
        console.log(newPsw);
        const rtn = await dbcontext.changePassword(oldPsw, req.session.password, newPsw, idUser);       //DB function will manage the conditions
        console.log(rtn);
        if(rtn==200)
        {
=======
    //var oldHash = await dbcontext.hashPassword(oldPsw);

    if(newPsw != ""){
        // console.log("oldPsw combacia");
        console.log(newPsw);
        const rtn = await dbcontext.changePassword(oldPsw, req.session.password, newPsw, idUser);
        console.log(rtn);
        if(rtn==200)
        {
           
>>>>>>> c74b2b9689d36f84521e5d743f16ae23bb2a0c43
            req.session.password = newPsw;
            res.locals.password = req.session.password;
            req.session.save();
            res.end('0');
        }  
        else if(rtn==500)
            res.end('500');
        else if(rtn==-1)
        {
            res.end('-1');
        }
<<<<<<< HEAD
    } 
});

//CREATE A NEW LIST
=======
    }

    
});



// POST FUNCTION TO CREATE AN USER TODO LIST
>>>>>>> c74b2b9689d36f84521e5d743f16ae23bb2a0c43
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
<<<<<<< HEAD
            app.locals.listindex = lastindex;
            app.locals.descriptionList = description;

=======
            // const rtn1 =  await dbcontext.GetUserLists(req.session.iduser);
            // console.log(rtn1);
            app.locals.listindex = lastindex;
            app.locals.descriptionList = description;

            // req.flash('allRows', rtn1);
>>>>>>> c74b2b9689d36f84521e5d743f16ae23bb2a0c43
            res.redirect('/lists');
        }   
    }
});

<<<<<<< HEAD
//DELETE AN EXISTING LIST
=======
// POST FUNCTION TO DELETE AN USER TODO LIST
>>>>>>> c74b2b9689d36f84521e5d743f16ae23bb2a0c43
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
<<<<<<< HEAD
});

//DELETE AN ITEM FROM A LIST
=======
  
});

>>>>>>> c74b2b9689d36f84521e5d743f16ae23bb2a0c43
app.post('/deleteitem',async function(req, res, next){
    console.log("entro delete ItemLists");
    var IdItem = req.body.IdItem;
  
        console.log(IdItem);
        const rtn =  await dbcontext.DeleteItemList(IdItem);
        console.log(rtn);

        console.log(app.locals.listindex);

        res.redirect('/edit');
<<<<<<< HEAD
});

//TOGGLE 'DONE' STATUS OF AN ITEM IN A LIST
=======
  
});

>>>>>>> c74b2b9689d36f84521e5d743f16ae23bb2a0c43
app.post('/togglestatus',async function(req, res, next){
    console.log("entro delete ItemLists");
    var IdItem = req.body.IdItem;
    var Status = req.body.Status;
    if (Status==1)
        Status =0;
    else
        Status =1;

        console.log(IdItem);
        const rtn =  await dbcontext.ToggleItemList(IdItem,Status);
        console.log(rtn);

        console.log(app.locals.listindex);

        res.redirect('/edit');
<<<<<<< HEAD
});

//OPEN AN EXISTING LIST
=======
  
});

// POST FUNCTION TO OPEN AN USER TODO LIST
>>>>>>> c74b2b9689d36f84521e5d743f16ae23bb2a0c43
app.post('/openlists',async function(req, res, next){
    console.log("entro openlists");
    var IdItem = req.body.IdItem;
    var NomeLista = req.body.Nome;
  
    app.locals.listindex = IdItem;
    app.locals.descriptionList = NomeLista;

    console.log(app.locals.listindex);
    console.log(app.locals.descriptionList);
    res.render('edit.ejs');
<<<<<<< HEAD
});

//INSERT A NEW ITEM IN A LIST
=======
  
});

// POST FUNCTION TO INSERT A NEW ITEM IN A LIST
>>>>>>> c74b2b9689d36f84521e5d743f16ae23bb2a0c43
app.post('/insertitemlist',async function(req, res, next){
    console.log("entro insertitemlist");
    var description = req.body.description;
    var listId = req.body.listId;
  
    console.log(description);
    
    const rtn1 =  await dbcontext.InsertItemUserList(description,listId);
    console.log(rtn1);
    
    app.locals.listindex = listId;

    console.log(app.locals.listindex);

    res.redirect('/edit');
});

<<<<<<< HEAD


=======
>>>>>>> c74b2b9689d36f84521e5d743f16ae23bb2a0c43
//LOGOUT
app.delete('/logout', function(req, res, next){
   
        disconnect(req,res);
});

<<<<<<< HEAD

//DISCONNECT
=======
// SHARED FUNCTION TO DISCONNECT
>>>>>>> c74b2b9689d36f84521e5d743f16ae23bb2a0c43
function disconnect(req,res)
{
    if(req!=undefined && req!=null){
        req.session.user = null;
        req.session.save();
        req.flash('username', null);
        res.redirect('/login');
    }
<<<<<<< HEAD
=======
   
>>>>>>> c74b2b9689d36f84521e5d743f16ae23bb2a0c43
}

app.listen(3000);       //application running on port 3000