import generarJWT from "../helpers/crearJWT.js"
import Operarios from "../models/Operarios.js"
import { enviarRestablecimientoContraseña } from "../config/nodemailer.js"

//metodo login operario

const loginOperario = async(req,res)=>{
    const{username,password}=req.body
    if (Object.values(req.body).includes(""))return res.status(400).json 
    ({mgg:"Por favor completa todos los campos"})

    const OperarioBDD = await Operarios.findOne({username}).select("-status -createdAt -updatedAt -__v -token")

    if(!OperarioBDD)return res.status(404).json({msg:"Lo sentimos,el usuario no se encuentra registrado "})
    if (!OperarioBDD.estado) {return res.status(403).json({ msg: "Usuario deshabilitado" });}
    const verificarPassword=await OperarioBDD.matchPassword(password)
    if(!verificarPassword)return res.status(404).json({msg:"Lo sentimos la contraseña es incorrecta"})

    const token = generarJWT(OperarioBDD._id,"operario")
    const {username:usernameO,nombre,apellido,telefono,email,estado,_id}=OperarioBDD
    await OperarioBDD.save()

    res.status(200).json({
        token,
        usernameO,
        nombre,
        apellido,
        telefono,
        email,
        estado,
        _id
    })


}


const perfilOperario =  (req,res) =>{
    delete req.operario.createdAt
    delete req.operario.updatedAt
    delete req.operario.token
    delete req.operario.status
    delete req.operario.__v
    
    res.status(200).json(req.operario)
    
}

const cambiarContraseñaOperario = async (req,res) =>{
    try {
        const operarioId = req.operario._id
        const {passwordActual,nuevoPassword, confirmarPassword} = req.body
    // validar que todos los campos esten llenos 
    if (!passwordActual || !nuevoPassword || !confirmarPassword ){
        return res.status(404).json({
            msg:"Debe llenar todos los campos"
        })
    }
    const operario = await Operarios.findById(operarioId)
    const passwordCorrecto = await operario.matchPassword(passwordActual)
    if(!passwordCorrecto){
        return res.status(404) .json({
            msg:"La contraseña actual es incorrecta"
        })
    }

    //verificar que la nueva contraseña y la confirmacion coincidan
    if (nuevoPassword !== confirmarPassword){
        return res.status(400).json({
            msg: "Las contraseñas nuevas no coinciden"
        })
    }

    //actualiza la contraseña
    operario.password = await operario.encryptPassword(nuevoPassword)
    await operario.save()
    res.json({
        msg:"Contraseña actualizada correctamente"
    })
    } catch (error) {
        console.log (error)
        res.status(500).json(
            {
                msg:"Hubo un error al cambiar la contraseña"  
              }
        )
       
    }
} 


export {
    loginOperario,
    perfilOperario,
    cambiarContraseñaOperario
}