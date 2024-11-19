import generarJWT from "../helpers/crearJWT.js"
import Operarios from "../models/Operarios.js"
import { enviarRestablecimientoContraseña } from "../config/nodemailer.js"

//metodo login operario

const loginOperario = async(req,res)=>{
    const{username,password}=req.body
    if (Object.values(req.body).includes(""))return res.status(400).json 
    ({mgg:"Por favor completa todos los campos"})
    const OperarioBDD = await Operarios.findOne({username})

    if(!OperarioBDD)return res.status(404).json({msg:"Lo sentimos,el usuario no se encuentra registrado "})
    const verificarPassword=await OperarioBDD.matchPassword(password)
    if(!verificarPassword)return res.status(404).json({msg:"Lo sentimos, el password no es el correcto"})
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

//recuperar contraseña 
const recuperarContraseña = async(req,res) =>{
    const {email}= req.body
    if(Object.values(req.body).includes("")) return res.status(404).json({
        msg:"Lo sentimos debe llenar todos los campos"
    })
    const operario = await Operarios.findOne({email})
    if (!operario) return res.status(404).json({
        msg:"Lo sentimos pero el email que ingreso no esta registrado"
    })
    const token =await operario.createToken()
    operario.token=token
    await enviarRestablecimientoContraseña(email ,token)
    await operario.save()
    res.status(200).json({
        msg:"Revise su correo electronico para reestablecer su contraseña"
    })
    

}


///confirmar el token para la contraseña 
const comprobarTokenContraseña =async(req,res) =>{
    try {
        // Obtener token de los parámetros
        const { token } = req.params
        console.log("Token recibido:", token) // Debug

        // Verificar si hay token
        if (!token) {
            return res.status(400).json({
                msg: "Token no proporcionado"
            })
        }

        // Buscar operario con ese token
        const operario = await Operarios.findOne({ token })
        console.log("Operario encontrado:", operario) // Debug

        // Verificar si existe el operario y el token coincide
        if (!operario) {
            return res.status(404).json({
                msg: "Token no válido"
            })
        }

        // Responder éxito
        res.status(200).json({
            msg: "Token confirmado, puede crear la nueva contraseña"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Error al validar el token"
        })
    }
}


//actualizar contraseña

const nuevaContraseña =  async(req,res)=>{
    try {
        const {password, confirmarPassword} = req.body
        
        if(Object.values(req.body).includes("")) return res.status(404).json({
            msg: "Lo sentimos debe completar todos los campos"
        })
        
        if (password !== confirmarPassword) return res.status(400).json({
            msg: "Las contraseñas no coinciden"
        })
            
        const operario = await Operarios.findOne({token: req.params.token})
        
        if (!administrador) return res.status(404).json({
            msg: "Lo sentimos no hemos podido verificar su cuenta"
        })

        operario.token = null
        operario.password = await operario.encryptPassword(password)
        await operario.save()

        res.status(200).json({msg: "Contraseña actualizada con éxito"})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Hubo un error al actualizar la contraseña"})
    }

}

const perfilOperario =  (req,res) =>{
    delete req.operario.createdAt
    delete req.operario.updatedAt
    delete req.operario.token
    delete req.operario.status
    delete req.operario.__v
    
    res.status(200).json(req.operario)
    
}

const cambiarContraseñaOperario = async (res,req) =>{
    try {
        const operarioId = req.Operarios.id
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
    recuperarContraseña,
    comprobarTokenContraseña,
    nuevaContraseña,
    perfilOperario,
    cambiarContraseñaOperario
}