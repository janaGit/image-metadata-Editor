var express = require("express");
var path = require('path');
var webpackDevMiddleware = require("webpack-dev-middleware");
var webpackHotMiddleware = require("webpack-hot-middleware");
var webpack = require("webpack");
var webpackConfig = require("./webpack.config");

var bodyParser = require("body-parser");
var multer = require('multer');
var fs = require('fs');
var exifTool = require('./ExifTool.js');
var imageDir = './images';
var imageDir_edited = './images_edited';

var app = express();
var compiler = webpack(webpackConfig);

app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath
}));
app.use(webpackHotMiddleware(compiler));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));

});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

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

app.get('/getMetadata/:imageName/:lang', getMetadata_edit);
app.get('/getMetadata_edited/:imageName/:lang', getMetadata_edited);

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
    var lang='';

    if(req.params.lang){
           lang=req.params.lang; 
    }else{
        lang='en';
    }
    var metadata = getMetadata(imageDir, imageName, lang);
    metadata.then(function (value) {
        res.send(value);
    }), function (error) {
        res.status(404).send(error);
    };

}
function getMetadata_edited(req, res) {
    var imageName = req.params.imageName;
    var lang='';
    if(req.params.lang){
           lang=req.params.lang; 
    }else{
        lang='en';
    }
    var metadata = getMetadata(imageDir_edited, imageName, lang);
    metadata.then(function (value) {
        res.send(value);
    }), function (error) {
        res.status(404).send(error);
    };
}
function getMetadata(imageDir, imageName, lang) {
    return  new Promise(function (resolve, reject) {
        fs.readdir(imageDir, function (err, files) {
            if (files.indexOf(imageName) === -1) {
                reject('File does not exist.');
            }
            var data = exifTool.getMetadata(imageDir, imageName, lang);
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




app.listen(3000, function () {
  console.log("Listening on port 3000!");
});
