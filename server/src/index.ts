//https://auth0.com/blog/use-typescript-to-create-a-secure-api-with-nodejs-and-express-getting-started/
import express from 'express';
import {Request, Response} from 'express';
import multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import * as http from 'http';
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import * as suffix from "../../utilities/image-suffixes";
import { ExifTool } from './exif-tool';
import { ReturnObject } from '../../src/app/types/return-object.interface';
import { METADATA_DELETED, IMAGE_EDITED } from '../../utilities/constants';
import { debug } from 'console';


export class Server {
    private imageDir: string;
    private imageDir_edited: string;
    private imageDir_original: string;
    private imageDir_complete: string;
    private templateDir: string;
    private fileNameForCategoryTree: string; 
    private configDir: string;
    public app: express.Express;
    private router; 
    private exifTool: ExifTool;
    private port: number;
    /** 
     * For the file upload when a file has been put
     *  into the drag and drop box.
     **/
    private storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'images_original/');
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    });
    private upload = multer({
        storage: this.storage
    });

    public static main(): http.Server {
        let server = new Server();
        let httpServer = server.start();
        return httpServer;
    }
    constructor() {
        this.imageDir = './images';
        this.imageDir_edited = './images_edited';
        this.imageDir_original = './images_original';
        this.imageDir_complete = './images_complete';
        this.configDir = './config';
        this.templateDir = this.configDir + '/templates';
        this.fileNameForCategoryTree = "category-tree.json"
        dotenv.config();

        if (!process.env.PORT) {
            console.error("no env variables!");
            process.exit(1);
        }
        this.port = parseInt(process.env.PORT as string, 10);

        this.app = express();
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({
            extended: false
        }));
        this.router = express.Router();
        this.exifTool = new ExifTool();
    }
    public start(): http.Server {
        this.configRoutes();
        this.configApp();
        let server: http.Server = this.app.listen(this.port, () => {
            console.log("Listening on port " + this.port + "!");
        });
        return server;
    }



    private configApp() {
        this.app.use("/images", express.static('images'));
        this.app.use("/images_edited", express.static('images_edited'));
        this.app.use("/images_original", express.static('images_original'));
        this.app.use("/images_complete", express.static('images_complete'));
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'dist/index.html'));

        });
        this.app.use(express.static(path.join(__dirname, 'dist')));

        this.app.use('/api', this.router);
    }
    private configRoutes() {
        this.router.get('/getImageNames', this.getFileNames);
        this.router.get('/getImageNames_edited', this.getFileNames_edited);
        this.router.get('/getImageNames_original', this.getFileNames_original);
        this.router.get('/getImageNames_complete', this.getFileNames_complete);

        this.router.get('/getMetadata/:imageName/:lang', this.getMetadata_edit);
        this.router.get('/getMetadata_edited/:imageName/:lang', this.getMetadata_edited);
        this.router.post('/deleteAllMetadata/:imageName', this.deleteAllMetadata);
        this.router.post('/editMetadata/:imageName', this.editMetadata);
        this.router.get('/getMetadataToEdit/:imageName', this.getMetadataToEdit);

        this.router.post('/newImage', this.upload.single('image'), this.newImage);
        this.router.delete('/deleteImage/:imageName', this.deleteImage);

        this.router.post('/copyImageForEditing/:imageName', this.copyImageToImageFolder);
        this.router.post('/moveImageBackForEditing/:imageName', this.moveImageBackToImageFolder);
        this.router.post('/moveImageToImageGallery/:imageName', this.moveImageToImageGallery);
        this.router.post('/moveImageToImagesComplete/:imageName', this.moveImageToImageComplete);

        this.router.get('/getTemplates', this.readTemplates);
        this.router.post('/writeTemplate', this.writeTemplate);
        this.router.delete('/deleteTemplate/:templateName', this.deleteTemplate);

        this.router.get('/getCategoryTree', this.readCategoryTree);

        this.router.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, 'dist/index.html')); 
        });
    }

    private getFileNames = (req: Request, res: Response) => {
        fs.readdir(this.imageDir, (err, files) => {
            console.log('REQUEST:getFileNames: ');
            console.log(files);
            let body: { data: string[] } = { data: files };
            res.status(200).send(body);
        });
    }

    private getFileNames_edited = (req: Request, res: Response) => {
        fs.readdir(this.imageDir_edited, (err, files) => {
            console.log('REQUEST:getFileNames_edited: ');
            console.log(files);
            let body: { data: string[] } = { data: files };
            res.send(body);
        });
    }

    private getFileNames_complete = (req: Request, res: Response) => {
        fs.readdir(this.imageDir_complete, (err, files) => {
            console.log('REQUEST:getFileNames_complete: ');
            console.log(files);
            let body: { data: string[] } = { data: files };
            res.send(body);
        });
    }

    private getFileNames_original = (req: Request, res: Response) => {
        fs.readdir(this.imageDir_original, (err, files) => {
            console.log('REQUEST:getFileNames_original: ');
            console.log(files);
            let body: { data: string[] } = { data: files };
            res.send(body);
        });
    }

    private newImage = (req: Request, res: Response) => {
        console.log('REQUEST:newImage: ' + req.file.filename);
        res.send(req.file.filename);
    }

    private deleteImage = (req: Request, res: Response) => {
        var imageName = req.params.imageName;
        fs.unlink(this.imageDir + '/' + imageName, (err) => {
            if (err) {
                console.error(err);
                res.status(400).send(err);
            }
            console.log("File " + imageName + " deleted!");
            res.status(200).send({});

        });
    }
    private getMetadata = (imageDir, imageName, lang) => {
        return new Promise((resolve, reject) => {
            fs.readdir(imageDir, (err, files) => {
                if (files.indexOf(imageName) === -1) {
                    reject('File with name: ' + imageName + ' does not exist.');
                } else {
                    let data = this.exifTool.getMetadataHumanreadable(imageDir, imageName, lang);
                    data.then((data) => {
                        console.log(data);
                        let body = { data: data };
                        resolve(body);
                    }, (error) => {
                        reject(error);
                    });
                }
            });
        });
    }
    private _getMetadataToEdit = (imageDir, imageName) => {
        return new Promise((resolve, reject) => {
            fs.readdir(imageDir, (err, files) => {
                if (files.indexOf(imageName) === -1) {
                    reject('File with name: ' + imageName + ' does not exist.');
                } else {
                    let data = this.exifTool.getMetadata(imageDir, imageName);
                    data.then((data) => {
                        console.log(data);
                        let body = { data: data };
                        resolve(body);
                    }, (error) => {
                        reject(error);
                    });
                }
            });
        });
    }
    private getMetadata_edit = (req: Request, res: Response) => {
        var imageName = req.params.imageName;
        var lang = '';

        if (req.params.lang) {
            lang = req.params.lang;
        } else {
            lang = 'en';
        }
        var metadata = this.getMetadata(this.imageDir, imageName, lang);
        metadata.then((value) => {
            res.send(value);
        }, (error) => {
            console.log(error)
            res.status(404).send(error);
        });

    }

    private getMetadata_edited = (req: Request, res: Response) => {
        var imageName = req.params.imageName;
        var lang = '';
        if (req.params.lang) {
            lang = req.params.lang;
        } else {
            lang = 'en';
        }
        var metadata = this.getMetadata(this.imageDir_edited, imageName, lang);
        metadata.then((value) => {
            res.send(value);
        }, (error) => {
            res.status(404).send(error);
        });
    }

    private getMetadataToEdit = (req: Request, res: Response) => {
        var imageName = req.params.imageName;

        var metadata = this._getMetadataToEdit(this.imageDir, imageName);
        metadata.then((value) => {
            res.send(value);
        }, (error) => {
            res.status(404).send(error);
        });
    }


    private copyImageToImageFolder = (req: Request, res: Response) => {
        let imageName = req.params.imageName;
        let result = this.copyImageAndMoveToImageFolder(imageName);
        result.then((value: ReturnObject) => {
            res.status(value.status).send(value);
        }, (error) => {
            res.status(error.status).send(error);
        });
    }

    private moveImageBackToImageFolder = (req: Request, res: Response) => {
        var imageName = req.params.imageName;
        var result = this.moveImage(this.imageDir_edited, this.imageDir, imageName, imageName);
        result.then((value: ReturnObject) => {
            res.status(value.status).send(value);
        }, (error) => {
            res.status(error.status).send(error);
        });
    }

    private moveImageToImageGallery = (req: Request, res: Response) => {
        var imageName = req.params.imageName;
        var result = this.moveImage(this.imageDir, this.imageDir_edited, imageName, imageName);
        result.then((value: ReturnObject) => {
            res.status(value.status).send(value);
        }, (error) => {
            res.status(error.status).send(error);
        });
    }

    private moveImageToImageComplete = (req: Request, res: Response) => {
        var imageName = req.params.imageName;
        let imageNameWithoutSuffix = suffix.getImageNameWithoutSuffix(imageName);
        console.log("Method: moveImageToImageComplete; imageNameWithoutSuffix: " + imageNameWithoutSuffix);
        var result = this.moveImage(this.imageDir_edited, this.imageDir_complete, imageName, imageNameWithoutSuffix);
        result.then((value: ReturnObject) => {
            res.status(value.status).send(value);
        }, (error) => {
            res.status(error.status).send(error);
        });
    }

    private moveImage = (imageDir_from, imageDir_to, imageName, imageName_new): Promise<ReturnObject> => {
        return new Promise((resolve, reject) => {
            fs.readdir(imageDir_from, (err, files) => {
                if (err) {
                    var object = {
                        status: 500,
                        error: err
                    };
                    console.error(object);
                    reject(object);
                }
                if (files.indexOf(imageName) === -1) {
                    let object: ReturnObject = {
                        status: 400,
                        error: err,
                        message: '400, File does not exist. imageName: ' + imageName + ' imageName_new  ' + imageName_new
                    };
                    console.error(object);
                    reject(object);
                }
                fs.rename(imageDir_from + '/' + imageName, imageDir_to + '/' + imageName_new, (err) => {
                    if (err) {
                        let object = {
                            status: 500,
                            error: err
                        };
                        console.error(object);
                        reject(object);
                    }
                    let object = {
                        status: 200
                    };
                    resolve(object);
                });
            });
        });
    }

    private copyImageAndMoveToImageFolder = (imageName) => {
        return new Promise((resolve, reject) => {
            fs.readdir(this.imageDir_original, (err, files) => {
                if (err) {
                    var object = {
                        status: 500,
                        error: err
                    };
                    console.error(object);
                    reject(object);
                }
                if (files.indexOf(imageName) === -1) {
                    let object: ReturnObject = {
                        status: 400,
                        error: err,
                        message: '400, File does not exist.'
                    };
                    console.error(object);
                    reject(object);
                }
                fs.readFile(this.imageDir_original + '/' + imageName, (err, image) => {
                    if (err) {
                        let object: ReturnObject = {
                            status: 500,
                            error: err,
                            message: ''
                        };
                        console.error(object);
                        reject(object);
                    }
                    const newImageName = imageName.replace(/\.([^\.]*)$/, IMAGE_EDITED + "." + '$1');
                    fs.writeFileSync(this.imageDir + '/' + newImageName, image);
                    let object = {
                        status: 200
                    };
                    resolve(object);
                });

            });
        });
    }

    private deleteAllMetadata = (req: Request, res: Response) => {
        let imageName = req.params.imageName;
        fs.readdir(this.imageDir, (err, files) => {
            if (files.indexOf(imageName) === -1) {
                res.status(404).send('File does not exist.');
            }
            let result = this.exifTool.deleteAllMetadata(this.imageDir, imageName);
            result.then((data) => {
                let _data = { body: data };
                console.log('deleteAllMetadata server.ts message:' + _data.body);
                res.status(data.status).send(_data);
            }, (error) => {
                var _error = { body: error };
                console.error('deleteAllMetadata server.ts  error:' + _error.body);
                res.status(500).send(_error);
            });
        });

    }

    private editMetadata = (req: Request, res: Response) => {
        let imageName = req.params.imageName;
        let metadata = req.body.metadata;
        console.log(metadata);
        res.status(200).send("OK");
    }

    private readTemplates = (req: Request, res: Response) => {
        const templates = [];
        let templateNames;

        templateNames = fs.readdirSync(this.templateDir);

        for (let templateName of templateNames) {
            const template = JSON.parse(fs.readFileSync(this.templateDir + "/" + templateName).toString());
            templates.push(template);
        }
        let body: { data:any} = { data: templates };
        res.status(200).send(body);

    }

    private writeTemplate = (req: Request, res: Response) => {
        const template = req.body.template;
        let data = JSON.stringify(template);
        fs.writeFileSync(this.templateDir + "/" + (<string>template.name).replace(" ", "").toLocaleLowerCase() + '.json', data);
        let body: { data:any} = { data: "OK" };
        res.status(200).send(body);
    }

    private deleteTemplate = (req: Request, res: Response) => {
        const templateName = req.params.templateName;
        fs.unlinkSync(this.templateDir + "/" + templateName.replace(" ", "").toLocaleLowerCase() + '.json'); 
        let body: { data:any} = { data: "OK" };
        res.status(200).send(body);
    }

    private readCategoryTree = (req, res) => {
        const categoryTree = JSON.parse(fs.readFileSync(this.configDir+"/"+this.fileNameForCategoryTree).toString());
        let body: { data:any} = { data: categoryTree };
        res.status(200).send(body);
    }

}

let _server = Server.main();

type ModuleId = string | number;

interface WebpackHotModule {
    hot?: {
        data: any;
        accept(
            dependencies: string[],
            callback?: (updatedDependencies: ModuleId[]) => void,
        ): void;
        accept(dependency: string, callback?: () => void): void;
        accept(errHandler?: (err: Error) => void): void;
        dispose(callback: (data: any) => void): void;
    };
}

declare const module: WebpackHotModule;

if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => _server.close());
}

