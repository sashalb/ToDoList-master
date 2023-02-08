//DATABASE SETUP


//LIBRARIES AND VARIABLES
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto'); 

let db = new sqlite3.Database('./db/todolist.db', sqlite3.OPEN_READWRITE, (err) => {
if (err) {
    console.error(err.message);
}
console.log('Connected to the todolist  db.');
});



//LOGGEDUSER ENTITY
let LoggedUser = class {
    constructor(id,username, email,password) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
    }
    getId() {
        return this.id;
    }
    getUsername() {
        return this.username;
    }
    getEmail() {
        return this.email;
    }
    getPassword() {
        return this.password;
    }
}



//CHANGE USERNAME
async function changeUsername(newUsername, idUser){
    console.log('entro changeUsername');
    return new Promise(function(resolve,reject){
        let sql = 'UPDATE Tb_Users SET UserName = ? WHERE ID = ?';
        db.run(sql, [newUsername, idUser], async function(err, rows){
            if(err)
            {
                console.log(err);
                return console.log(err); 
                reject(-1);
            }
            else
            {
                console.log("success");
                resolve(true);
            }     
        })
    })
}

//CHANGE PASSWORD
async function changePassword(oldPsw, currentPsw, newPsw, idUser){
    console.log('entro changePassword');

    var oldHash = await hashPassword(oldPsw);
    var newHash = await hashPassword(newPsw);

        return new Promise(function(resolve, reject){
            if(oldHash == currentPsw)
            {
                let sql = 'UPDATE Tb_Users SET Password = ? WHERE ID = ?';
                db.run(sql, [newHash, idUser], async function(err, rows){
                    if(err)
                    {
                        console.log(err);
                        resolve(500);  
                        reject(-1);
                    }
                    else
                    {
                        console.log("success");
                        resolve(200);
                    }
                })
            }  
            else
            {
                console.log('la vecchia non coincide');
                resolve(-1); 
            }
        })
}

//AUTHENTICATE USER
//checks email and password matching adn returns the whole table row for that user
async function doAuthenticate(email,password){
    return new Promise(function(resolve,reject){
        var loggeduser;
        db.get('SELECT Password FROM TB_Users WHERE Email = ?', email, async function(err, row1) {
            if(err){return reject(err);}
         
            if (!row1){
                loggeduser = null ;
           } 
           console.log("Password letta a db="+ row1.Password);
           var hash = await hashPassword(password);
       
           console.log("Password inserita hashata="+ hash);
           
           db.get('SELECT UserName,Email, ID, Password FROM TB_Users WHERE Email = ? AND Password = ?', email, hash,  function(err, row) {
                if(err){return reject(err);}
                console.log(row);
                resolve(row);
           });
         });
    });
}

//REGISTRATION OF A NEW USER
//checks DB if email exists, if not, data will be stored
async function doRegister(username,email,password){
    return new Promise(function(resolve,reject){
        var loggeduser;
        db.get('SELECT ID FROM TB_Users WHERE Email = ?', email, async function(err, row1) {
            if(err){return reject(err);}
         
            if (!row1){         //if that email doesnt exists, then store the data
                
                var hash = await hashPassword(password);
               
                db.run('INSERT INTO TB_Users(UserName,Email,Password ) VALUES(?,?,?) ', username,email, hash,  function(err, row) {
                        if(err){return reject(err);}
                        
                        resolve(true);
                });
            } 
            else
                resolve(false);
         });
    });
}

//OUTPUTS ALL THE LISTS OF A USER >> TABLE IN LISTS PAGE
async function GetUserLists(iduser){
    return new Promise(function(resolve,reject){
        let sql = 'SELECT  Tb_ToDoLists.Id,Tb_ToDoLists.IdUser,Tb_ToDoLists.Nome,Tb_ToDoLists.Timestamp, Count(TDLI.Id) as ITEMS,(Select count(*) from Tb_ToDoList_Items where Status=1 and Tb_ToDoList_Items.IdToDoLists= Tb_ToDoLists.Id) as DONE  from Tb_ToDoLists ' +
                'LEFT  JOIN Tb_ToDoList_Items TDLI on TDLI.IdToDoLists= Tb_ToDoLists.Id ' +
                'WHERE Tb_ToDoLists.IdUser=' + iduser + ' GROUP BY Tb_ToDoLists.Nome order by Tb_ToDoLists.Timestamp DESC ';
        db.all(sql,[], async function(err, rows) {
            if(err){return console.log(err); reject(err);}

            resolve(rows);   
         });
    });
}

//OUTPUTS ALL THE ITEMS IN A LIST >> TABLE IN EDIT PAGE
async function GetUserListsItems(idlist){
    return new Promise(function(resolve,reject){
        let sql = 'SELECT * FROM Tb_ToDoList_Items WHERE IdToDoLists = ' + idlist + ' order by Timestamp desc' ;
        db.all(sql,[], async function(err, rows) {
            if(err){return console.log(err); reject(err);}
           
            resolve(rows);
         });
    });
}

//CREATES A NEW LIST FOR A USER
async function InsertUserList(description,iduser){
    return new Promise(function(resolve,reject){
        let sql = 'INSERT INTO  Tb_ToDoLists (Nome,IdUser) VALUES (?,?)' ;
        db.run(sql,[description,iduser], async function(err, rows) {
            if(err)
            {
                reject(-1);
            }
            else
            {
                let sql1 = 'SELECT last_insert_rowid() ' ;
                db.run(sql1,[], async function(err, lastindex) {
                    if(err)
                    {
                        return console.log(err); 
                        reject(-1);
                    }
                    else
                    {
                        resolve(lastindex);
                    }           
               });
            }
        });
    });
}

//CREATES A NEW ITEM IN AN EXISTING LIST
async function InsertItemUserList(description,idlist){
    return new Promise(function(resolve,reject){
        let sql = 'INSERT INTO  Tb_ToDoList_Items (IdToDoLists,Descrizione,Status) VALUES (?,?,?)' ;
        db.run(sql,[idlist,description,0], async function(err, rows) {
            if(err)
            {
                return console.log(err); 
                reject(err);
            }
            else
                resolve(true);
         });
    });
}


//DELETES A LIST
async function DeleteUserList(iditem){
    return new Promise(function(resolve,reject){
        let sql = 'DELETE From Tb_ToDoLists WHERE Id =?' ;
        db.run(sql,[iditem], async function(err, rows) {
            if(err)
            {
                return console.log(err); 
                reject(err);
            }
            else
                resolve(true);
         });
    });
}

//DELETS AN ITEM FROM A LIST
async function DeleteItemList(iditem){
    return new Promise(function(resolve,reject){
        let sql = 'DELETE From Tb_ToDoList_Items WHERE Id =?' ;
        db.run(sql,[iditem], async function(err, rows) {
            if(err)
            {
                return console.log(err); 
                reject(err);
            }
            else
                resolve(true); 
         });
    });
}

//TOGGLES 'DONE' STATUS OF AN ITEM
async function ToggleItemList (iditem,status){
    return new Promise(function(resolve,reject){
        let sql = 'UPDATE Tb_ToDoList_Items SET Status= ? WHERE Id =?' ;
        db.run(sql,[status,iditem], async function(err, rows) {
            if(err)
            {
                return console.log(err); 
                reject(err);
            }
            else
                resolve(true);
         });
    });
}

//HASH PASSWORDS
async function hashPassword(password) {
    var hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
}



// EXPORT TO SHARED FUNCTION IN SERVER.JS
module.exports = db;
module.exports = LoggedUser;
module.exports.doAuthenticate = doAuthenticate;
module.exports.doRegister = doRegister;
module.exports.GetUserLists = GetUserLists;
module.exports.InsertUserList = InsertUserList;
module.exports.DeleteUserList = DeleteUserList;
module.exports.InsertItemUserList = InsertItemUserList;
module.exports.GetUserListsItems = GetUserListsItems;
module.exports.changeUsername = changeUsername;
module.exports.changePassword = changePassword;
module.exports.DeleteItemList = DeleteItemList;
module.exports.ToggleItemList = ToggleItemList;