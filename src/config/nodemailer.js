import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()
const transporter = nodemailer.createTransport({
    service : "gmail",
    host : process.env.HOST_MAILTRAP,
    port :process.env.PORT_MAILTRAPL,
    auth :{
        user: process.env.USER_MAILTRAP,
        pass:process.env.PASS_MAILTRAP
    }

})

const enviarRestablecimientoContraseña = async(correoUsuario,token) =>{
    let opcionesCorreo = await transporter.sendMail({
        from: process.env.USER_MAILTRAP,
      to: correoUsuario,
      subject: "Recupera tu Contraseña",
      html: `<h1>Sistema de gestión</h1>
      <hr>
      <p>Haz click <a href=${process.env.URL_BACKEND}usuarios/recuperar-password/${token}>aqui</a> para restablecer tu contraseña</p>`  
    })


    console.log("Mensaje enviado satisfactoriamente",opcionesCorreo.messageId)
}

const sendMailToOperario = async (userMail,password,username)=>{
    let info = await transporter.sendMail({
    from : 'unidaddebienes24@gmail.com',
    to : userMail,
    subject:"correo de bienvenida",
    html:`
    <h1>Sistema de gestión (UNIDAD DE BIENES )</h1>
    <hr>
    <p>usuario de acceso: ${username}</p>
    <p>Contraseña de acceso: ${password}</p>
    <a href=${process.env.URL_BACKEND}operario/login>Clic para iniciar sesión</a>
    <hr>
    <footer>La unidad de control de bienes te da la Bienvenida!</footer>


    `

    });
    console.log("mesaje enviado satisfactoriamente",info.messageId);
}
export { enviarRestablecimientoContraseña,sendMailToOperario}