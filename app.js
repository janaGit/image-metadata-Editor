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

app.get('/getMetadata/:imageName', getMetadata);
app.get('/getMetadata_edited/:imageName', getMetadata_edited);

app.post('/newImage', upload.single('image'), newImage);

app.delete('/deleteImage/:imageName', deleteImage);

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
        res.sendStatus(200);

    });
}
function getMetadata(req, res) {
    var imageName = req.params.imageName;
    var metadata = metadata(imageDir, imageName);
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
                reject('File not exists.');
            }
            var data = exifTool.getMetadata(imageDir, imageName);
            data.then(function (data) {
                console.log(data);
                var body = {};
                body.data = data;
                resolve(body);
            });
        });
    });
}

app.listen(3000);
