import jwt from "jsonwebtoken"
import Administrador from "../models/Administrador.js"
import Operarios from "../models/Operarios.js"
import dotenv from "dotenv"
dotenv.config()

const verificarAdministrador = async(req,res,next) =>{      
    try {
        // 1. Verificar que exista el header de autorización
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            return res.status(401).json({
                msg: "No hay administrador autenticado"
            });
        }

        // 2. Obtener y verificar el token
        const token = req.headers.authorization.split(' ')[1];
        
        // 3. Decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Buscar el administrador
        const administrador = await Administrador.findById(decoded.id)
            .select("-password -token");

        if (!administrador) {
            return res.status(401).json({
                msg: "Token no válido - usuario no existe"
            });
        }

        // 5. Guardar el administrador en el request
        req.Administrador = administrador;
        next();

    } catch (error) {
        console.log("Error de autenticación:", error);
        return res.status(401).json({
            msg: "No hay administrador autenticado"
        });
    } 


}

// Exportar el método
export default verificarAdministrador 