import jwt from 'jsonwebtoken'
 import Operarios from '../models/Operarios.js'



 //metodo para proteger rutar
 const verificarAutenticacion =  async (req,res,next)=> {
const token = req.headers.authorization
if(!token) return res.status(404).json({msg: "Lo sentimos primero debe proporcionar un token"})

const {authorization} = req.headers
try {
    const {id, rol} = jwt.verify(authorization.split(" ")[1], process.env.JWT_SECRET)
    if(rol === "operario"){
        req.operario = await Operarios.findById(id).lean()
        next()
    } else{
        return res.status(403).json({msg: "Lo sentimos ruta denegada"})
    }
   } catch (error) {
    const e = new Error("Error para confirmar el token")
    return res.status(401).json({msg: e.message})
    }
}


export default verificarAutenticacion
  