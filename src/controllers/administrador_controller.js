
import Administrador from "../models/Administrador.js";
import generarJWT from "../helpers/crearJWT.js";
import Operarios from "../models/Operarios.js";
import mongoose from "mongoose";
import { sendMailToOperario, enviarRestablecimientoContraseña } from "../config/nodemailer.js";
//endpoint no  se usa en el frontend

const registroAdministrador = async (req, res) => {
    const { username, email, password} = req.body
    if (Object.values(req.body).includes("")) return res.status(400).json
        ({ mgg: "Por favor completa todos los campos" })

    const existe = await Administrador.findOne({ email })
    if (existe) return res.status(400).json({ msg: "Este usuario ya se encuentra registrado" })

    const respuesta = new Administrador(req.body)
    respuesta.password = await respuesta.encryptPassword(password)
    await respuesta.save()
    res.status(200).json({ msg: "Administrador registrado exitosamente" })
}

// metodo para el login 

const loginAdminController = async (req, res) => {
    const { username, password } = req.body
    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Por favor completa todos los campos" })

    const administradorEncontrado = await Administrador.findOne({ username }).select("-status -createdAt -updatedAt -__v -token")

    if (!administradorEncontrado) return res.status(404).json({ msg: "El usuario es incorrecto,inténtalo nuevamente " })

    const confirmarPassword = await administradorEncontrado.matchPassword(password)
    if (!confirmarPassword) return res.status(404).json({ msg: " Lo sentimos la contraseña es incorrecta" })

    //pendiente 
    const token = generarJWT(administradorEncontrado._id, "administrador")
    const { _id, nombre, apellido, email } = administradorEncontrado
    await administradorEncontrado.save()
    res.status(200).send({
        _id,
        username: administradorEncontrado.username,
        nombre,
        apellido,
        token,
        email,
        token
    })

}

//Registrar Operarios
const registroOperarios = async (req, res) => {
    const { username, email ,extension} = req.body

    if (Object.values(req.body).includes("")) return res.status(404).json({
        msg: "Lo sentimos debe completar todos los campos "
    })

    const operario = await Operarios.findOne({
        $or: [{ username }, { email }]
    })
    if (operario) return res.status(404).json({ msg: "Lo sentimos ya se encuentra registrado este operario con este Username o Email" }
    )
    const extensionExiste = await Operarios.findOne({extension})
    if (extensionExiste) return res.status(404).json({msg:" Lo sentimos esta extension ya existe"})


    const nuevoOperario = new Operarios(req.body)

    const password = Math.random().toString(36).slice(2)

    nuevoOperario.password = await nuevoOperario.encryptPassword(password)

    await sendMailToOperario(email, password, username)

    await nuevoOperario.save()
    res.status(200).json({ msg: "Operario registrado exitosamente y correo enviado" })
}

//Listar operarios 
const listarOperarios = async (req, res) => {
    const operario = await Operarios.find()
    res.status(200).json(operario)
}

//modificar operarios
const actualizarOperario = async (req, res) => {
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
        //verificar si el email ,username o extension ya existe la BDD
        const { email, username, extension } = req.body;
        const operarioDuplicado = await Operarios.findOne({
            $or: [
                { email, _id: { $ne: id } },
                { username, _id: { $ne: id } },
                { extension, _id: { $ne: id } }
            ]
        });

        if (operarioDuplicado) {
            return res.status(400).json({
                msg: "El email, username o extension ya existen"
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
const cambiarEstadoOperario = async (req, res) => {
    const { id } = req.params
    const { estado } = req.body

    if (!id) return res.status(400).json({
        msg: "Lo sentimos, el ID es requerido"
    })
    if (estado === undefined) return res.status(400).json({
        msg: "Lo sentimos, el estado es requerido"
    });

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({
        msg: "Lo sentimos el id proporcionado no existe"
    });

    try {
        await Operarios.findByIdAndUpdate(id, { estado })
        res.status(200).json({ msg: "Estado del usuario modificado exitosamente" });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al cambiar el estado del usuario" });
        
    }
    
}



//modificar la contraseña dentro del sistema;
const cambiarContraseñaAdmin = async (req, res) => {
    try {
        const administradorId = req.administrador._id
        const { passwordActual, nuevoPassword, confirmarPassword } = req.body
        // validar que todos los campos esten llenos 
        if (!passwordActual || !nuevoPassword || !confirmarPassword) {
            return res.status(404).json({
                msg: "Debe llenar todos los campos"
            })
        }
        const administrador = await Administrador.findById(administradorId)
        const passwordCorrecto = await administrador.matchPassword(passwordActual)
        if (!passwordCorrecto) {
            return res.status(404).json({
                msg: "La contraseña actual es incorrecta"
            })
        }

        //verificar que la nueva contraseña y la confirmacion coincidan
        if (nuevoPassword !== confirmarPassword) {
            return res.status(400).json({
                msg: "Las contraseñas nuevas no coinciden"
            })
        }

        //actualiza la contraseña
        administrador.password = await administrador.encryptPassword(nuevoPassword)
        await administrador.save()
        res.json({
            msg: "Contraseña actualizada correctamente"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json(
            {
                msg: "Hubo un error al cambiar la contraseña"
            }
        )

    }
}

//Recuperar contraseña para ambos roles
const recuperarContraseñaUsuario = async (req, res) => {
    const { email } = req.body; // Solo necesitas el email
    if (!email) {
        return res.status(400).json({
            msg: "Lo sentimos, debe llenar todos los campos"
        });
    }
    
    // Buscar en ambos modelos
    let usuario = await Administrador.findOne({ email });
    if (!usuario) {
        usuario = await Operarios.findOne({ email });
    }

    if (!usuario) {
        return res.status(404).json({
            msg: "Lo sentimos, pero el email que ingresó no está registrado"
        });
    }
    
    // Generar un token y enviar el correo de restablecimiento
    const token = await usuario.createToken();
    usuario.token = token; 
    await enviarRestablecimientoContraseña(email, token); 
    await usuario.save(); 

    res.status(200).json({
        msg: "Revise su correo electrónico para restablecer su contraseña"
    });
}

const perfilAdministrador = (req, res) => {
    delete req.administrador.createdAt
    delete req.administrador.updatedAt
    delete req.administrador.token
    delete req.administrador.status
    delete req.administrador.__v

    res.status(200).json(req.administrador)

}

//confirmar token para ambos roles 
const comprobarTokenContraseñaUsuario= async (req, res) => {
    try {
        // Obtener token de los parámetros
        const { token } = req.params;
        console.log("Token recibido:", token);

        // Verificar si hay token
        if (!token) {
            return res.status(400).json({
                msg: "Token no proporcionado"
            });
        }

        // Buscar en ambos modelos
        let usuario = await Administrador.findOne({ token });
        if (!usuario) {
            usuario = await Operarios.findOne({ token });
        }

        // Verificar si existe el usuario y el token coincide
        if (!usuario) {
            return res.status(404).json({
                msg: "Token no válido"
            });
        }

        // Responder éxito
        res.status(200).json({
            msg: "Token confirmado, puede crear la nueva contraseña"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Error al validar el token"
        });
    }
}


//nueva contraseña para ambos roles 
const nuevaContraseñaUsuario = async (req, res) => {
    
     const { password, confirmarPassword } = req.body;
    try {
        // Verificar que todos los campos estén llenos
        if (Object.values(req.body).includes("") || password === undefined || confirmarPassword === undefined) {
            return res.status(400).json({ msg: "Lo sentimos, todos los campos deben de estar llenos" });
        }

        // Verificar que las contraseñas coincidan
        if (password !== confirmarPassword) {
            return res.status(400).json({ msg: "Lo sentimos,las contraseñas nuevas no coinciden" });
        }

        // Buscar en ambos modelos usando el token
        let usuario = await Administrador.findOne({ token: req.params.token });
        if (!usuario) {
            usuario = await Operarios.findOne({ token: req.params.token });
        }

        // Verificar si se encontró al usuario
        if (!usuario) {
            return res.status(404).json({ msg: "Lo sentimos, no hemos podido verificar su cuenta" });
        }


        usuario.token = null;
        usuario.password = await usuario.encryptPassword(password);
        await usuario.save();
        res.status(200).json({ msg: "Contraseña actualizada con éxito" });

    } catch (error) {
        console.log(error);
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`);
    }
}



export {
    registroAdministrador,
    loginAdminController,
    registroOperarios,
    listarOperarios,
    cambiarEstadoOperario,
    actualizarOperario,
    nuevaContraseñaUsuario,
    cambiarContraseñaAdmin,
    recuperarContraseñaUsuario,
    comprobarTokenContraseñaUsuario,
    perfilAdministrador
};
