
import Administrador from "../models/Administrador.js";
import generarJWT from "../helpers/crearJWT.js";
import Operarios from "../models/Operarios.js";
import mongoose from "mongoose";
import { sendMailToOperario } from "../config/nodemailer.js";
//endpoint no  se usa en el frontend

const registroAdministrador =  async (req,res) =>{
    const {username,email,password,nombre,apellido} = req.body 
    if (Object.values(req.body).includes(""))return res.status(400).json 
    ({mgg:"Por favor completa todos los campos"})

    const existe = await Administrador.findOne({email})
    if (existe) return res.status (400).json({msg:"Este usuario ya se encuentra registrado"})

    const respuesta = new Administrador(req.body)
    respuesta.password = await respuesta.encryptPassword(password)
    await respuesta.save()
    res.status (200).json({msg:"Administrador registrado exitosamente"})
}

// metodo para el login 

const loginAdminController = async (req,res)=>{
    const {username,password}= req.body 
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Por favor completa todos los campos"})

    const administradorEncontrado = await Administrador.findOne({username}).select("-status -createdAt -updatedAt -__v -token")

    if (!administradorEncontrado) return res.status(404).json({msg:"El usuario es incorrecto,inténtalo nuevamente "})
    
    const confirmarPassword = await administradorEncontrado.matchPassword(password)
    if(!confirmarPassword) return res.status (404). json({msg:"Contraseña es incorrecta"})
    
    //pendiente 
    const token  = generarJWT(administradorEncontrado._id,"administrador")
    const{_id,nombre,apellido,email} = administradorEncontrado
    await administradorEncontrado.save()
    res.status(200).send({
        _id,
        username:administradorEncontrado.username,
        nombre,
        apellido,
        token,
        email,})

}

//Registrar Operarios
const registroOperarios= async(req,res)=>{
    const {username,email} = req.body

    if (Object.values(req.body).includes("")) return res.status(404).json({
        msg:"Lo sentimos debe completar todos los campos "
    })
    
    const operario = await Operarios.findOne({
        $or:[{username},{email}]
    })
    if (operario) return res.status(404).json({msg:"Lo sentimos ya se encuentra registrado este operario"}
    )
        
    const nuevoOperario = new Operarios(req.body)

    const password = Math.random().toString(36).slice(2)

    nuevoOperario.password = await nuevoOperario.encryPassword(password)

    await sendMailToOperario(email,password,username)

    await nuevoOperario.save()
    res.status(200).json({msg:"Operario registrado exitosamente y correo enviado"})
}

//Listar operarios 
const listarOperarios =async(req,res)=>{
    const operario = await Operarios.find()
    res.status(200).json(operario)
}

//modificar operarios
const actualizarOperario = async(req,res)=>{
    try {
        const { id } = req.params;

        // Validar campos vacíos
        if (Object.values(req.body).includes("")) {
            return res.status(400).json({
                msg: "Lo sentimos, debe completar todos los campos"
            });
        }

        // Validar formato del ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                msg: "ID de operario no válido"
            });
        }

        // Verificar si el operario existe
        const operarioExiste = await Operarios.findById(id);
        if (!operarioExiste) {
            return res.status(404).json({
                msg: `No existe el operario con ID: ${id}`
            });
        }

        // Actualizar operario
        const operarioActualizado = await Operarios.findByIdAndUpdate(
            id,
            req.body,
            { new: true } // Esto retorna el documento actualizado
        );

        res.status(200).json({
            msg: "Actualización exitosa del operario",
            operario: operarioActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Error al actualizar el operario"
        });
    }

}

//deshabilitar operarios 
const cambiarEstadoOperario = async (req,res) =>{
    const {id} = req.params
    
    if(!id) return res.status(400).json({
        msg: "Lo sentimos, el ID es requerido"
    })
    
    if (Object.values(req.body).includes("")) return res.status(400).json(
        {msg:"Lo sentimos debe completar todos los campos"})
        console.log("id:",id)
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({
        msg:"Lo sentimos el id proporcionado no existe"
    })
    await Operarios.findByIdAndUpdate(id,{estado:false})
    res.status(200).json({msg:"Estado del usuario modificado exitosamente"})
}

//cambiar contraseña
const nuevaContraseñaAdmin = async (req, res) => {
        try {
            const {password, confirmarPassword} = req.body
            
            if(Object.values(req.body).includes("")) return res.status(404).json({
                msg: "Lo sentimos debe completar todos los campos"
            })
            
            if (password !== confirmarPassword) return res.status(400).json({
                msg: "Las contraseñas no coinciden"
            })
                
            const administrador = await Administrador.findOne({token: req.params.token})
            
            if (!administrador) return res.status(404).json({
                msg: "Lo sentimos no hemos podido verificar su cuenta"
            })
    
            administrador.token = null
            administrador.password = await administrador.encryptPassword(password)
            await administrador.save()
    
            res.status(200).json({msg: "Contraseña actualizada con éxito"})
            
        } catch (error) {
            console.log(error)
            res.status(500).json({msg: "Hubo un error al actualizar la contraseña"})
        }
    }

//modificar la contraseña dentro del sistema;
const cambiarContraseñaAdmin =async (req,res) =>{
    try {
        const administradorId = req.administrador._id
        const {passwordActual,nuevoPassword, confirmarPassword} = req.body
    // validar que todos los campos esten llenos 
    if (!passwordActual || !nuevoPassword || !confirmarPassword ){
        return res.status(404).json({
            msg:"Debe llenar todos los campos"
        })
    }
    const administrador = await Administrador.findById(administradorId)
    const passwordCorrecto = await administrador.matchPassword(passwordActual)
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
    administrador.password = await administrador.encryptPassword(nuevoPassword)
    await administrador.save()
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


const comprobarTokenContraseñaAdmin =async(req,res) =>{
    try {
        // Obtener token de los parámetros
        const { token } = req.params
        console.log("Token recibido:", token)

        // Verificar si hay token
        if (!token) {
            return res.status(400).json({
                msg: "Token no proporcionado"
            })
        }

        // Buscar administrador con ese token
        const administrador = await Administrador.findOne({ token })
        console.log("Administrador encontrado:", ad) // Debug

        // Verificar si existe el administrador y el token coincide
        if (!administrador) {
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

const recuperarContraseñaAdmin = async(req,res) =>{
    const {email}= req.body
    if(Object.values(req.body).includes("")) return res.status(404).json({
        msg:"Lo sentimos debe llenar todos los campos"
    })
    const administrador = await Administrador.findOne({email})
    if (!operario) return res.status(404).json({
        msg:"Lo sentimos pero el email que ingreso no esta registrado"
    })
    const token =await administrador.createToken()
    administrador.token=token
    await enviarRestablecimientoContraseña(email ,token)
    await administrador.save()
    res.status(200).json({
        msg:"Revise su correo electronico para reestablecer su contraseña"
    })
    

}

const perfilAdministrador = (req,res) =>{
    delete req.administrador.createdAt
    delete req.administrador.updatedAt
    delete req.administrador.token
    delete req.administrador.status
    delete req.administrador.__v

    res.status(200).json(req.administrador)
    
}


export  {
    registroAdministrador,
    loginAdminController,
    registroOperarios,
    listarOperarios,
    cambiarEstadoOperario,
    actualizarOperario,
    nuevaContraseñaAdmin,
    cambiarContraseñaAdmin,
    recuperarContraseñaAdmin,
    comprobarTokenContraseñaAdmin,
    perfilAdministrador
};




//router.get("/usuarios/recuperar-password/:token", comprobarTokenContraseña);

//router.post("/administrador/nueva-password/:token", nuevaContraseña);
//router.post("/usuarios/recuperar-password", recuperarContraseña);