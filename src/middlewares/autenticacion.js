//importaa jwt y modelo 
 import jwt from 'jsonwebtoken'
 import Operarios from '../models/Operarios.js'



 //metodo para proteger rutar
 const verificarAutenticacion =  async (req,res,next)=> {
    try {
        // 1. Verificar que exista el header de autorización
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            return res.status(401).json({
                msg: "No hay operario autenticado"
            });
        }

        // 2. Obtener y verificar el token
        const token = req.headers.authorization.split(' ')[1];
        
        // 3. Decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Buscar el administrador
        const operario = await Operarios.findById(decoded.id)
            .select("-password -token");

        if (!operario) {
            return res.status(401).json({
                msg: "Token no válido - usuario no existe"
            });
        }

        // 5. Guardar el administrador en el request
        req.Operarios = operario;
        next();

    } catch (error) {
        console.log("Error de autenticación:", error);
        return res.status(401).json({
            msg: "No hay operario autenticado"
        });
    }

}


export default verificarAutenticacion
  
 