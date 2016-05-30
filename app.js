var express = require('express');
var bodyParser = require("body-parser");
var multer = require('multer');
var app = express();
var path = require('path');
var fs = require('fs');
var exifTool = require('./ExifTool.js');
var imageDir = './images';
var imageDir_edited = './images_edited';

app.use("/nm_es6-shim", express.static('node_modules/es6-shim/es6-shim.min.js'));
app.use("/nm_system-polyfills", express.static('node_modules/systemjs/dist/system-polyfills.js'));
app.use("/nm_shims_for_IE", express.static('node_modules/angular2/es6/dev/src/testing/shims_for_IE.js'));
app.use("/nm_angular2-polyfills", express.static('node_modules/angular2/bundles/angular2-polyfills.js'));
app.use("/nm_system.src", express.static('node_modules/systemjs/dist/system.src.js'));
app.use("/nm_Rx", express.static('node_modules/rxjs/bundles/Rx.js'));
app.use("/nm_angular2.dev", express.static('node_modules/angular2/bundles/angular2.dev.js'));
app.use("/nm_router.dev", express.static('node_modules/angular2/bundles/router.dev.js'));
app.use("/nm_ng2-bootstrap.min", express.static('node_modules/ng2-bootstrap/bundles/ng2-bootstrap.min.js'));
app.use("/nm_http.dev", express.static('node_modules/angular2/bundles/http.dev.js'));
app.use("/nm_moment", express.static('node_modules/moment/moment.js'));

app.use("/styles.css", express.static('styles.css'));
app.use("/app", express.static('app'));
app.use("/images", express.static('images'));
app.use("/images_edited", express.static('images_edited'));


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));

});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({storage: storage});


app.get('/getImageNames', getFileNames);
app.get('/getImageNames_edited', getFileNames_edited);

app.get('/getMetadata/:imageName', getMetadata_edit);
app.get('/getMetadata_edited/:imageName', getMetadata_edited);

app.post('/newImage', upload.single('image'), newImage);

app.delete('/deleteImage/:imageName', deleteImage);

app.post('/moveImageBackForEditing/:imageName', moveImageTo_image_folder);
app.post('/moveImageToImageGallery/:imageName', moveImageTo_image_edited_folder);

app.post('/deleteAllMetadata/:imageName', deleteAllMetadata);

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});


function getFileNames(req, res) {
    fs.readdir(imageDir, function (err, files) {
        console.log('REQUEST:getFileName ');
        console.log(files);
        var body = {};
        body.data = files;
        res.send(body);
    });
}
function getFileNames_edited(req, res) {
    fs.readdir(imageDir_edited, function (err, files) {
        console.log('REQUEST:getFileName ');
        console.log(files);
        var body = {};
        body.data = files;
        res.send(body);
    });
}

function newImage(req, res) {
    console.log('REQUEST:newImage ');
    res.send(req.file.filename);
}
function deleteImage(req, res) {
    var imageName = req.params.imageName;
    fs.unlink(imageDir + '/' + imageName, function (err) {
        if (err) {
            console.error(err);
            res.status(400).send(err);
        }
        console.log("File " + imageName + " deleted!");
        res.status(200).send({});

    });
}
function getMetadata_edit(req, res) {
    var imageName = req.params.imageName;
    var metadata = getMetadata(imageDir, imageName);
    metadata.then(function (value) {
        res.send(value);
    }), function (error) {
        res.status(404).send(error);
    };

}
function getMetadata_edited(req, res) {
    var imageName = req.params.imageName;
    var metadata = getMetadata(imageDir_edited, imageName);
    metadata.then(function (value) {
        res.send(value);
    }), function (error) {
        res.status(404).send(error);
    };
}
function getMetadata(imageDir, imageName) {
    return  new Promise(function (resolve, reject) {
        fs.readdir(imageDir, function (err, files) {
            if (files.indexOf(imageName) === -1) {
                reject('File does not exist.');
            }
            var data = exifTool.getMetadata(imageDir, imageName);
            data.then(function (data) {
                console.log(data);
                var body = {};
                body.data = data;
                resolve(body);
            }, function (error) {
                reject(error);
            });
        });
    });
}
function moveImageTo_image_folder(req, res) {
    var imageName = req.params.imageName;
    var result = moveImage(imageDir_edited, imageDir, imageName);
    result.then(function (value) {
        res.status(value.status).send(value);
    }, function (error) {
        res.status(error.status).send(error);
    });
}

function moveImageTo_image_edited_folder(req, res) {
    var imageName = req.params.imageName;
    var result = moveImage(imageDir, imageDir_edited, imageName);
    result.then(function (value) {
        res.status(value.status).send(value);
    }, function (error) {
        res.status(error.status).send(error);
    });
}
function moveImage(imageDir_from, imageDir_to, imageName) {
    return  new Promise(function (resolve, reject) {
        fs.readdir(imageDir_from, function (err, files) {
            if (err) {
                var object = {status: 500, error: err};
                console.error(object);
                reject(object);
            }
            if (files.indexOf(imageName) === -1) {
                var object = {status: 400, error: err, message: '400, File does not exist.'};
                console.error(object);
                reject(object);
            }
            fs.rename(imageDir_from + '/' + imageName, imageDir_to + '/' + imageName, function (err) {
                if (err) {
                    var object = {status: 500, error: err};
                    console.error(object);
                    reject(object);
                }
                var object = {status: 200};
                resolve(object);
            });
        });
    });
}

function deleteAllMetadata(req, res) {
    var imageName = req.params.imageName;
    fs.readdir(imageDir, function (err, files) {
        if (files.indexOf(imageName) === -1) {
            res.status(404).send('File does not exist.');
        }
        var result = exifTool.deleteAllMetadata(imageDir, imageDir_edited, imageName);
        result.then(function (data) {
            var _data={};
            _data.body=''+data;
            console.log('exifTool message:'+_data.body);
            res.status(200).send(_data);
        }, function (error) {
            var _error={};
            _error.body=''+error;
            console.error('deleteAllMetadata app.js:'+_error);
            res.status(500).send(_error);
        });
    });

}

app.listen(3000);
