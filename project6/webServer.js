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
var app = express();

// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var SchemaInfo = require('./schema/schemaInfo.js');

// XXX - Your submission should work without this line. Comment out or delete this line for tests and before submission!
//var cs142models = require('./modelData/photoApp.js').cs142models;

mongoose.connect('mongodb://localhost/cs142project6', { useNewUrlParser: true, useUnifiedTopology: true });

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));


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
    var id = request.params.id;
    User.findOne({_id: id},(err, user) => {
        if (err) {
            console.log('User with _id:' + id + ' not found.');
            response.status(400).send('Not found');
        }
        else {
            let {_id, first_name, last_name, location, description, occupation} = user;
            let newUser = {_id, first_name, last_name, location, description, occupation};
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
    var id = request.params.id;
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
    // var photos = cs142models.photoOfUserModel(id);
    // if (photos.length === 0) {
    //     console.log('Photos for user with _id:' + id + ' not found.');
    //     response.status(400).send('Not found');
    //     return;
    // }
    // response.status(200).send(photos);
});


var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});


