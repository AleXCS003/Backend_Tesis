//importaa jwt y modelo 
 import jwt from 'jsonwebtoken'
 import Operarios from '../models/Operarios.js'
 import Administrador from '../models/Administrador.js'



 //metodo para proteger rutar
 const verificarAutenticacion =  async (req,res,next)=> {


       /* try {
            // Verificar token
            const token = req.headers.authorization
            if(!token) {
                return res.status(401).json({
                    msg: "Token no proporcionado"
                })
            }
    
            // Obtener token limpio
            const tokenLimpio = token.split(' ')[1]
            
            // Verificar token
            const decoded = jwt.verify(tokenLimpio, process.env.JWT_SECRET)
            
            // Buscar operario
            const operario = await Operarios.findById(decoded.id)
                .select("-token") // Mantener password para matchPassword
            
            if(!operario) {
                return res.status(404).json({
                    msg: "Operario no encontrado"
                })
            }
    
            // Agregar operario al request
            req.operario = operario
            next()
    
        } catch (error) {
            console.log(error)
            return res.status(401).json({
                msg: "Token no válido"
            })
        }

}*/

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
        const operario = await Operarios.findById(decoded.id)
            .select("-token") // Excluimos token pero mantenemos password para matchPassword
        
        if (!operario) {
            return res.status(401).json({
                msg: "Token no válido"
            })
        }

        // Verificar si el administrador está activo
        if (!operario.status) {
            return res.status(403).json({
                msg: "Operario inactivo"
            })
        }

        // Verificar rol si es necesario
        if (decoded.rol && decoded.rol !== "operario") {
            return res.status(403).json({
                msg: "Ruta  de operario"
            })
        }

        // Agregar administrador al request
        req.operario = operario
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


export default verificarAutenticacion
  
 