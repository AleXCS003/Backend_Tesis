import multer from "multer";
import path from "path"


const storage = multer.diskStorage({

    destination :(req,file,cb) =>{
        cb(null,'./uploads/')
    },
    filename:(req,file,cb)=>{
        const extension = path.extname(file.originalname)
        cb(null,`${Date.now()}-${file.originalname}`)
    }
});

const fileFilter = (req,file,cb) =>{
    const allowedTypes = ['application/pdf' , 'application/xlsx']
    if(allowedTypes.includes(file.mimetype)){
        cb(null,true)
    }else{
        cb(new Error ('Formato de archivo no valido. '))
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