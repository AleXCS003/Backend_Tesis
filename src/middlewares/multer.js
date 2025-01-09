import multer from "multer";
//import path from "path"
//import fs from "fs"

const storage = multer.memoryStorage();

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