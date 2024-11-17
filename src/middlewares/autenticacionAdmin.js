import jwt from "jsonwebtoken"
import Administrador from "../models/Administrador.js"
import Operarios from "../models/Operarios.js"
import dotenv from "dotenv"
dotenv.config()

const verificarAdministrador = async(req,res,next) =>{         
//METODO 3 vale 100%
try {
    // Verificar si hay token y extraerlo (usando tu método que funciona)
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
        return res.status(401).json({
            msg: "No hay token, autorización denegada"
        })
    }

    try {
        // Verificar token usando JWT_SECRET en lugar de JWRT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        // Buscar el administrador sin usar lean() para mantener los métodos
        const administrador = await Administrador.findById(decoded.id)
            .select("-token") // Excluimos token pero mantenemos password para matchPassword
        
        if (!administrador) {
            return res.status(401).json({
                msg: "Token no válido"
            })
        }

        // Verificar si el administrador está activo
        if (!administrador.status) {
            return res.status(403).json({
                msg: "Administrador inactivo"
            })
        }

        // Verificar rol si es necesario
        if (decoded.rol && decoded.rol !== "administrador") {
            return res.status(403).json({
                msg: "Ruta privada de administrador"
            })
        }

        // Agregar administrador al request
        req.administrador = administrador
        next()
        
    } catch (error) {
        console.log("Error al verificar token:", error)
        return res.status(401).json({   
            msg: "Token no válido"
        })
    }
    
} catch (error) {
    console.log("Error general:", error)
    return res.status(401).json({
        msg: "Token no válido"
    }) 
}
}

// Exportar el método
export default verificarAdministrador 