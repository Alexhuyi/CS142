/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the database.
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 *
 */

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var async = require('async');

var express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const processFormBody = multer({storage: multer.memoryStorage()}).single('uploadedphoto');
const fs = require("fs");
//const { makePasswordEntry, doesPasswordMatch } = require("./cs142password.js");
const cs142password = require('./cs142password');
var app = express();

// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var SchemaInfo = require('./schema/schemaInfo.js');
//const { userInfo } = require('os');
//const { default: axios } = require('axios');

// XXX - Your submission should work without this line. Comment out or delete this line for tests and before submission!
//var cs142models = require('./modelData/photoApp.js').cs142models;

mongoose.connect('mongodb://localhost/cs142project6', { useNewUrlParser: true, useUnifiedTopology: true });

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));
app.use(session({secret: 'secretKey', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());

app.get('/', function (request, response) {
    response.send('Simple web server of files from ' + __dirname);
});

/*
 * Use express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */
app.get('/test/:p1', function (request, response) {
    // Express parses the ":p1" from the URL and returns it in the request.params objects.
    console.log('/test called with param1 = ', request.params.p1);

    var param = request.params.p1 || 'info';

    if (param === 'info') {
        // Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
        SchemaInfo.find({}, function (err, info) {
            if (err) {
                // Query returned an error.  We pass it back to the browser with an Internal Service
                // Error (500) error code.
                console.error('Doing /user/info error:', err);
                response.status(500).send(JSON.stringify(err));
                return;
            }
            if (info.length === 0) {
                // Query didn't return an error but didn't find the SchemaInfo object - This
                // is also an internal error return.
                response.status(500).send('Missing SchemaInfo');
                return;
            }

            // We got the object - return it in JSON format.
            console.log('SchemaInfo', info[0]);
            response.end(JSON.stringify(info[0]));
        });
    } else if (param === 'counts') {
        // In order to return the counts of all the collections we need to do an async
        // call to each collections. That is tricky to do so we use the async package
        // do the work.  We put the collections into array and use async.each to
        // do each .count() query.
        var collections = [
            {name: 'user', collection: User},
            {name: 'photo', collection: Photo},
            {name: 'schemaInfo', collection: SchemaInfo}
        ];
        async.each(collections, function (col, done_callback) {
            col.collection.countDocuments({}, function (err, count) {
                col.count = count;
                done_callback(err);
            });
        }, function (err) {
            if (err) {
                response.status(500).send(JSON.stringify(err));
            } else {
                var obj = {};
                for (var i = 0; i < collections.length; i++) {
                    obj[collections[i].name] = collections[i].count;
                }
                response.end(JSON.stringify(obj));

            }
        });
    } else {
        // If we know understand the parameter we return a (Bad Parameter) (400) status.
        response.status(400).send('Bad param ' + param);
    }
});

/*
 * URL /user/list - Return all the User object.
 */
app.get('/user/list', function (request, response) {
    if (!request.session.user_id){
        response.status(401).send("Not logged in!");
        return;    
    }
    User.find({}, function (err, users) {
        let newUsers = users;
        async.forEachOf(users, (user,index, done_callback) => {
            let {_id,first_name,last_name} = user;
            newUsers[index] = {_id, first_name, last_name};
            done_callback();
        }, (err1) => {
            if (err1) {
                response.status(500).send(JSON.stringify(err1));
            } else {
                response.status(200).send(newUsers);
            }
        });
    });
    //response.status(200).send(cs142models.userListModel());
});

/*
 * URL /user/:id - Return the information for User (id)
 */
app.get('/user/:id', function (request, response) {
    if (!request.session.user_id){
        response.status(401).send("Not logged in!");
        return;
    }
    var id = request.params.id;
    User.findOne({_id: id},(err, user) => {
        if (err) {
            console.log('User with _id:' + id + ' not found.');
            response.status(400).send('Not found');
        }
        else {
            let {_id, first_name, last_name, location, description, occupation,mentioned} = user;
            let newUser = {_id, first_name, last_name, location, description, occupation,mentioned};
            // console.log("user/:id",newUser.mentioned);
            response.status(200).send(newUser);
        }
    });
    //var user = cs142models.userModel(id);
    //response.status(200).send(user);
});

/*
 * URL /photosOfUser/:id - Return the Photos for User (id)
 */
app.get('/photosOfUser/:id', function (request, response) {
    if (!request.session.user_id){
        response.status(401).send("Not logged in!"); 
        return;  
    }
    var id = request.params.id;
    //console.log("photo of user_id",id);
    Photo.find({user_id: id},(err, photos) => {
        if (err) {
            console.log('Photos for user with _id:' + id + ' not found.');
            response.status(400).send(err.message);
        }else {
            let newPhotos = JSON.parse(JSON.stringify(photos));
            async.forEachOf(newPhotos, (photo,index,done_callback1) => {
                // let {_id, user_id, comments, file_name, date_time} = photo;
                // newPhotos[index] = {_id, user_id, comments, file_name, date_time};
                delete photo.__v;
                //console.log("photo like length", photo.liked.length);
                async.forEachOf(photo.comments, (comment,index2,done_callback2) => {
                    let user1 = User.findOne({_id:comment.user_id}, (err1) => {
                        if (err1) {
                            response.status(400).send('Not found');
                        }
                    }).clone().catch((err2) => {console.log(err2);});
                    user1.then((user) => {
                        let {_id, first_name, last_name} = user;
                        //let newUser = {_id, first_name, last_name};
                        photo.comments[index2] = {
                            comment:comment.comment,
                            date_time:comment.date_time, 
                            _id:comment.user_id,
                            user: {_id, first_name, last_name}
                        };
                        done_callback2();
                    });
                }, (err3) => {
                    if (err3) {
                        console.log(err3.message);
                    } else {
                        //delete photo.__v;
                        // console.log(Object.keys(photo));
                        newPhotos[index] = photo;
                        // {
                        //     _id:photo._id, 
                        //     user_id:photo.user_id,
                        //     comments: photo.comments,
                        //     file_name: photo.file_name,
                        //     date_time: photo.date_time
                        // };
                        done_callback1();
                    }
                });
            }, (err4) => {
                if (err4) {
                    console.log(err4.message);
                } else {
                    response.status(200).send(newPhotos); 
                }
            });
        }
    });
});

app.get("/photo/:photo_id", function(request, response) {
    if (!request.session.user_id){
        response.status(401).send("Not logged in!"); 
        return;  
    }
    let photo_id = request.params.photo_id;
    // console.log("photo/id runned",photo_id);
    Photo.findOne({_id:photo_id}, function(err1,photo) {
        if(err1){
            response.send(400).send("Photo id is not valid.");
            return;
        }
        User.findOne({_id:photo.user_id}, (err2, owner) => {
            if(err2){
                response.status(400).send("Photo id exists but onwer is not found.");
                return;
            }
            let thisPhoto={
                _id:photo_id,
                owner_id:photo.user_id,
                owner_first_name:owner.first_name,
                owner_last_name:owner.last_name,
                file_name:photo.file_name
            };
            // console.log(photo_id,"1",thisPhoto._id,"2");
            response.status(200).send(thisPhoto);
        });
    });
});

app.post("/admin/login",function(request,response) {
    User.findOne({login_name:request.body.login_name}, (err,user) => {
        if (err || !user) {
            console.log("User with login_name:" + request.body.login_name + " not found.");
            response.status(400).send("Login name is not a valid account.");
            return;
        }
        // if(user.password !== request.body.login_password) {
        //     response.status(400).send("Password is not correct.");
        //     return;
        // }
        if (!request.body.password){
            response.status(400).send("Password cannot be undefined.");
            return;
        }
        if (!cs142password.doesPasswordMatch(user.password_digest,user.salt,request.body.password)){
            response.status(400).send("Password is not correct.");
            return;
        }
        request.session.login_name = request.body.login_name;
        request.session.user_id = user._id;
        let {_id, first_name, last_name, login_name} = user;
        let newUser = {_id, first_name, last_name,login_name};
        response.status(200).send(newUser);
    });
});

app.post("/admin/logout", function(request, response) {
    //request.session is an object you can read or write
    request.session.destroy(function(err) {
      if (err) {
        response.status(400).send("Failed to logout");
        return;
      }
      response.status(200).send();
    });
});

app.post("/commentsOfPhoto/:photo_id",function(request, response) {
    if(!request.session.user_id){
        response.status(401).send("Not Logged in.");
        return;
    }
    if(!request.body.comment){
        response.status(401).send("Comment is undefined.");
        return;
    }
    let photo_id = request.params.photo_id;
    console.log("comment:photo id",request.params.photo_id);
    Photo.findOne({_id:photo_id}, function(err, photo) {
        if (err){
            response.status(400).send("Photo_id doesn't exist.");
            return;
        }
        let date = new Date();
        let newcomment = {
            comment: request.body.comment,
            date_time:date,
            user_id:request.session.user_id
        };
        photo.comments.push(newcomment);
        photo.save();
        //add the photo id to the user mentioned
        let mentions = request.body.mentions;
        console.log("mentions",mentions);
        async.each(mentions, (user_id,callback) => {
            User.findOne({_id:user_id}, function(err1,user) {
                if(err1){
                    response.status(400).send("User id is invalid.");
                    return;
                }
                user.mentioned.push(photo_id);
                console.log("user mentioned",user.mentioned,"to string",user.mentioned[0].toString());
                user.save();
                callback();
            });
        }, function (err2) {
            if (err2){
                response.status(400).send("something wrong when implemeting mentioned.");
                return;
            }
            response.status(200).send();
        });
    });
});

//mention list
app.get("/mentionlist", (request, response) => {
    if(!request.session.user_id){
        response.status(401).send("Not logged in.");
        return;
    }
    User.find({}, (err1, users) => {
        if(err1){
            response.status(400).send("Error in giving mentionlist.");
            return;
        }
        let newUsers = users;
        async.eachOf(users, (user,index,callback) => {
            let {_id, first_name, last_name} = user;
            newUsers[index] = {id:_id, display:`${first_name} ${last_name}`};
            callback();
        }, err => {
            if (err){
                response.status(400).send("Someting wrong when giving mentionlist.");
            } else{
                response.status(200).send(newUsers);
            }
        });
    });
});

app.post("/photos/new", function(request, response) {
    if (!request.session.user_id) {
        response.status(401).send("Not Logged in");
        return;
    }
    processFormBody(request, response, function (err1) {
        if (err1 || !request.file) {
            // XXX -  Insert error handling code here.
            response.status(400).send("No file uploaded.");
            return;
        }
        // request.file has the following properties of interest
        //      fieldname      - Should be 'uploadedphoto' since that is what we sent
        //      originalname:  - The name of the file the user uploaded
        //      mimetype:      - The mimetype of the image (e.g. 'image/jpeg',  'image/png')
        //      buffer:        - A node Buffer containing the contents of the file
        //      size:          - The size of the file in bytes
    
        // XXX - Do some validation here.
        // We need to create the file in the directory "images" under an unique name. We make
        // the original file name unique by adding a unique prefix with a timestamp.
        const timestamp = new Date().valueOf();
        const filename = 'U' +  String(timestamp) + request.file.originalname;
    
        fs.writeFile("./images/" + filename, request.file.buffer, function (err2) {
            // XXX - Once you have the file written into your images directory under the name
            // filename you can create the Photo object in the database
            if (err2) {
                response.status(400).send("Unable to write file ");
                return;
            }
            let date = new Date();
            let photo = {
                user_id:request.session.user_id,
                file_name:filename,
                date_time:date,
                comments:[]
            };
            Photo.create(photo, function (err3,newphoto) {
                if (err3) {
                    response.status(400).send("Unable to create new photo in the database");
                    return;
                }
                newphoto.save();
                response.status(200).send();
            });
        });
    });
});

app.post("/user", function(request, response) {
    if(!request.body.first_name) {
        response.status(400).send("First name cannot be empty.");
        return;
    }
    if(!request.body.last_name) {
        response.status(400).send("Last name cannot be empty.");
        return;
    }
    console.log(request.body.password);
    if(!request.body.password) {
        response.status(400).send("Password cannot be empty.");
        return;
    }
    User.findOne({login_name:request.body.login_name}, (err1, user) => {
        if (err1) {
            response.status(400).send(err1.message);
            return;
        }
        if(user) {
            response.status(400).send("User already exists.");
            return;
        }
        let password = cs142password.makePasswordEntry(request.body.password);
        //console.log("Password salt length:"+password.salt.length);
        User.create({login_name:request.body.login_name,
            first_name:request.body.first_name,
            last_name:request.body.last_name,
            location:request.body.location,
            description:request.body.description,
            occupation:request.body.occupation,
            password_digest:password.hash,
            salt:password.salt
            //password:request.body.password
        },(err2, newuser) => {
                if (err2) {
                    response.status(400).send("Failed to register new user.");
                    return;
                }
                newuser.save();
                console.log("Create new user with ID",newuser._id);
                // request.session.login_name = login_name;
                // request.session.user_id = newuser.user._id;
                response.status(200).send();
            }
        );
    });
});

app.get(`/likeOrUnlike/:photo_id`, function(request, response) {
    if (!request.session.user_id) {
      response.status(401).send("Not logged in.");
      return;
    }
    let photo_id = request.params.photo_id;
    let user_id = request.session.user_id;
    Photo.findOne({ _id: photo_id }, function(err, photo) {
      if (err) {
        response.status(400).send("Invalid photo id.");
        return;
      }
  
      let index_of_user = photo.liked.indexOf(user_id);
      if(index_of_user >=0){ 
          response.status(200).send({like:1});
      } else{
          response.status(200).send({like:0});
      }
    });
});

app.get("/current/user", function(request, response) {
    if(!request.session.user_id){
        response.status(401).send("Not logged in");
        return;
    }
    console.log("Current logged in user id",request.session.user_id );
    response.status(200).send(request.session.user_id);
});

app.post(`/likeOrUnlike/:photo_id`, function(request, response) {
    if (!request.session.user_id) {
      response.status(401).send("Not logged in.");
      return;
    }
    let photo_id = request.params.photo_id;
    let user_id = request.session.user_id;
    // console.log("like post",photo_id);
    Photo.findOne({ _id: photo_id }, function(err, photo) {
      if (err) {
        response.status(400).send("Invalid photo id.");
        return;
      }
  
      let index_of_user = photo.liked.indexOf(user_id);
      if (request.body.like) {
        if (index_of_user >= 0) {
          //already like.
          response.status(400).send("The user already liked this photo.");
          return;
        }
        // console.log("liked",user_id);
        photo.liked.push(user_id);
      } else {
        //remove like.
        if (index_of_user === -1) {
          response.status(400).send("The user didn't like it.");
          return;
        }
        photo.liked.splice(index_of_user, 1);
      }
      photo.save();
      response.status(200).send("Succeed for likeorunlike.");
    });
});

app.get("/getFavorites", function(request, response) {
    if (!request.session.user_id) {
      response.status(401).send("Not logged in");
      return;
    }
    let user_id = request.session.user_id;
  
    User.findOne({ _id: user_id }, function(err, user) {
      if (err) {
        response.status(400).send("invalid user id");
        return;
      }
      let favorites = user.favorites;
      let info = [];
      async.each(
        favorites,
        (photo_id, callback) => {
          Photo.findOne({ _id: photo_id }, function(err1, photo) {
            if (err1) {
              response.status(400).send("Photo id not valid");
              return;
            }
            info.push({
                _id:photo._id,
                file_name: photo.file_name,
                date_time: photo.date_time
            });
            callback();
          });
        },
        function(err2) {
          if (err2) {
            response.status(400).send("Error in fetching favorites");
            return;
          }
          response.status(200).send(info);
        }
      );
    });
});

app.post(`/addFavorites`, function(request, response) {
    if (!request.session.user_id) {
      response.status(401).send("Not logged in");
      return;
    }
    let user_id = request.session.user_id;
    let photo_id = request.body.photo_id;
    console.log("favor try",photo_id);
    User.findOne({ _id: user_id }, (err, user) => {
      if (err) {
        response.status(400).send("User id to add favorites is invalid.");
        return;
      }
      if (!user.favorites.includes(photo_id)) {
        console.log("Add favorites successfully!");
        user.favorites.push(photo_id);
        user.save();
      }
      response.status(200).send();
    });
});

app.get("/deleteFavorite/:photo_id", function(request, response) {
    if (!request.session.user_id) {
      response.status(401).send("Not logged in");
      return;
    }
    let photo_id = request.params.photo_id;
    let user_id = request.session.user_id;
    User.findOne({ _id: user_id }, (err, user) => {
      if (err) {
        response.status(400).send("invalid user id");
        return;
      }
      const index = user.favorites.indexOf(photo_id);
      user.favorites.splice(index, 1);
      user.save();
      response.status(200).send();
    });
});

var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});


