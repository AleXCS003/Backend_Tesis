//importaa jwt y modelo 
 import jwt from 'jsonwebtoken'
 import Operarios from '../models/Operarios.js'
 import Administrador from '../models/Administrador.js'



 //metodo para proteger rutar
 const verificarAutenticacion =  async (req,res,next)=> {
/*
    ////METODO PRINCIPAL 
 //validar si se esta enviando el token 
    const token = req.headres.authorization
    if(!token) return res.status(404).json({
        msg:"lo sentimos primero debe prporcionar un token"
    })
     
    // Desestructurar el token pero del headers
    const {authorization} = req.headers

    // Capturar errores
    try {
        // verificar el token recuperado con el almacenado 
        const {id,rol} = jwt.verify(authorization.split(' ')[1],process.env.JWT_SECRET)
        
        // Verificar el rol
        if (rol==="operario"){
            // Obtener el usuario 
            req.operario = await Operarios.findById(id).lean().select("-password") // pendiente revisar la varible operario
            // Continue el proceso
            next()
        }
        else{
            req.administrador = await Administrador.findById(id).lean().select("-password")
            console.log(req.administrador);
            next()
        }



    } catch (error) {
        // Capturar errores y presentarlos
        const e = new Error("Formato del token no válido")
        return res.status(404).json({msg:e.message})
    }*/

        try {
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

}


export default verificarAutenticacion
  
 