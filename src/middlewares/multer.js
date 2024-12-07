import multer from "multer";
import path from "path"
import fs from "fs"

const uploadDir = "./uploads"
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        const filePath = path.join(uploadDir, file.originalname);

        // Verificar si el archivo ya existe para evitar sobrescrituras
        if (fs.existsSync(filePath)) {
            const extension = path.extname(file.originalname); //
            const baseName = path.basename(file.originalname, extension); 
            cb(null, `${baseName}-${Date.now()}${extension}`);
        } else {
            cb(null, file.originalname);
        }
    },
});

const fileFilter = (req,file,cb) =>{
    const allowedTypes = ['application/pdf']
    if(allowedTypes.includes(file.mimetype)){
        cb(null,true)
    }else{
        cb(new Error ('Solo se permiten archivos en formato PDF. '))
    }
}
//Middleware
const upload = multer({ storage,
    fileFilter,
    limits:{
        fileSize: 5 * 1024* 1024
    }
})

export default upload