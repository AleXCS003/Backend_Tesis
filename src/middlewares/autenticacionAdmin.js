import jwt from "jsonwebtoken"
import Administrador from "../models/Administrador.js"

const verificarAdministrador = async(req,res,next) =>{         

    const token = req.headers.authorization
    if(!token) return res.status(404).json({msg: "Lo sentimos primero debe proporcionar un token"})

    const {authorization} = req.headers
    try {
        const {id, rol} = jwt.verify(authorization.split(" ")[1], process.env.JWT_SECRET)
        if(rol === "administrador"){
        req.administrador = await Administrador.findById(id).lean()
        next()
     } else{
        return res.status(403).json({msg: "Lo sentimos pero no puede acceder a esta ruta"})
    }
} catch (error) {
    const e = new Error("Error al confirmar token")
    return res.status(401).json({msg: e.message})
}

}

// Exportar el método
export default verificarAdministrador 