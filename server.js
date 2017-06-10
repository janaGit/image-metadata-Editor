var express = require("express");
var path = require('path');

var bodyParser = require("body-parser");
var multer = require('multer');
var fs = require('fs');
var exifTool = require('./ExifTool.js');
var imageDir = './images';
var imageDir_edited = './images_edited';
var imageDir_original = './images_original';

var app = express();

app.use("/images", express.static('images'));
app.use("/images_edited", express.static('images_edited'));
app.use("/images_original", express.static('images_original'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'));

});
app.use(express.static(path.join(__dirname, 'dist')));

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// For the file upload when a file has been put
// into the drag and drop box.
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images_original/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({
  storage: storage
});

var router = express.Router();
app.use('/api', router);

router.get('/getImageNames', getFileNames);
router.get('/getImageNames_edited', getFileNames_edited);
router.get('/getImageNames_original', getFileNames_original);

router.get('/getMetadata/:imageName/:lang', getMetadata_edit);
router.get('/getMetadata_edited/:imageName/:lang', getMetadata_edited);
router.post('/deleteAllMetadata/:imageName', deleteAllMetadata);

router.post('/newImage', upload.single('image'), newImage);
router.delete('/deleteImage/:imageName', deleteImage);

router.post('/copyImageForEditing/:imageName', copyImageToImageFolder);
router.post('/moveImageBackForEditing/:imageName', moveImageBackToImageFolder);
router.post('/moveImageToImageGallery/:imageName', moveImageToImageGallery);


router.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});


function getFileNames(req, res) {
  fs.readdir(imageDir, function (err, files) {
    console.log('REQUEST:getFileNames: ');
    console.log(files);
    var body = {};
    body.data = files;
    res.send(body);
  });
}

function getFileNames_edited(req, res) {
  fs.readdir(imageDir_edited, function (err, files) {
    console.log('REQUEST:getFileNames_edited: ');
    console.log(files);
    var body = {};
    body.data = files;
    res.send(body);
  });
}

function getFileNames_original(req, res) {
  fs.readdir(imageDir_original, function (err, files) {
    console.log('REQUEST:getFileNames_original: ');
    console.log(files);
    var body = {};
    body.data = files;
    res.send(body);
  });
}

function newImage(req, res) {
  console.log('REQUEST:newImage: '+req.file.filename);
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
  var lang = '';

  if (req.params.lang) {
    lang = req.params.lang;
  } else {
    lang = 'en';
  }
  var metadata = getMetadata(imageDir, imageName, lang);
  metadata.then(function (value) {
    res.send(value);
  }, function (error) {
    console.log(error)
    res.status(404).send(error);
  });

}

function getMetadata_edited(req, res) {
  var imageName = req.params.imageName;
  var lang = '';
  if (req.params.lang) {
    lang = req.params.lang;
  } else {
    lang = 'en';
  }
  var metadata = getMetadata(imageDir_edited, imageName, lang);
  metadata.then(function (value) {
      res.send(value);
    }),
    function (error) {
      res.status(404).send(error);
    };
}

function getMetadata(imageDir, imageName, lang) {
  return new Promise(function (resolve, reject) {
    fs.readdir(imageDir, function (err, files) {
      if (files.indexOf(imageName) === -1) {
        reject('File with name: ' + imageName + ' does not exist.');
      } else {
        var data = exifTool.getMetadata(imageDir, imageName, lang);
        data.then(function (data) {
          console.log(data);
          var body = {};
          body.data = data;
          resolve(body);
        }, function (error) {
          reject(error);
        });
      }
    });
  });
}

function copyImageToImageFolder(req, res) {
  var imageName = req.params.imageName;
  var result = copyImage(imageDir_original, imageDir, imageName);
  result.then(function (value) {
    res.status(value.status).send(value);
  }, function (error) {
    res.status(error.status).send(error);
  });
}

function moveImageBackToImageFolder(req, res) {
  var imageName = req.params.imageName;
  var result = moveImage(imageDir_edited, imageDir, imageName);
  result.then(function (value) {
    res.status(value.status).send(value);
  }, function (error) {
    res.status(error.status).send(error);
  });
}

function moveImageToImageGallery(req, res) {
  var imageName = req.params.imageName;
  var result = moveImage(imageDir, imageDir_edited, imageName);
  result.then(function (value) {
    res.status(value.status).send(value);
  }, function (error) {
    res.status(error.status).send(error);
  });
}

function moveImage(imageDir_from, imageDir_to, imageName) {
  return new Promise(function (resolve, reject) {
    fs.readdir(imageDir_from, function (err, files) {
      if (err) {
        var object = {
          status: 500,
          error: err
        };
        console.error(object);
        reject(object);
      }
      if (files.indexOf(imageName) === -1) {
        var object = {
          status: 400,
          error: err,
          message: '400, File does not exist.'
        };
        console.error(object);
        reject(object);
      }
      fs.rename(imageDir_from + '/' + imageName, imageDir_to + '/' + imageName, function (err) {
        if (err) {
          var object = {
            status: 500,
            error: err
          };
          console.error(object);
          reject(object);
        }
        var object = {
          status: 200
        };
        resolve(object);
      });
    });
  });
}

function copyImage(imageDir_from, imageDir_to, imageName) {
  return new Promise(function (resolve, reject) {
    fs.readdir(imageDir_from, function (err, files) {
      if (err) {
        var object = {
          status: 500,
          error: err
        };
        console.error(object);
        reject(object);
      }
      if (files.indexOf(imageName) === -1) {
        var object = {
          status: 400,
          error: err,
          message: '400, File does not exist.'
        };
        console.error(object);
        reject(object);
      }
      fs.readFile(imageDir_from + '/' + imageName, function (err, image) {
        if (err) {
          var object = {
            status: 500,
            error: err
          };
          console.error(object);
          reject(object);
        }
        fs.writeFileSync(imageDir_to + '/' + 'edited_' + imageName, image);
        var object = {
          status: 200
        };
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
      var _data = {};
      _data.body = '' + data;
      console.log('exifTool message:' + _data.body);
      res.status(200).send(_data);
    }, function (error) {
      var _error = {};
      _error.body = '' + error;
      console.error('deleteAllMetadata app.js:' + _error);
      res.status(500).send(_error);
    });
  });

}




app.listen(3000, function () {
  console.log("Listening on port 3000!");
});
