import { Router } from "express";
import verificarAdministrador from "../middlewares/autenticacionAdmin.js";

const router = Router ()

 import {
   registroAdministrador ,
   registroOperarios,
   loginAdminController,
   actualizarOperario,
   cambiarEstadoOperario,
   listarOperarios,
   nuevaContraseñaUsuario,
   cambiarContraseñaAdmin,
   perfilAdministrador,
   comprobarTokenContraseñaUsuario,
   recuperarContraseñaUsuario

   
 } from "../controllers/administrador_controller.js"

 //rutas  libres
 router.post("/administrador/register",registroAdministrador)
 router.post("/administrador/loginAdmin",loginAdminController)  
 router.post("/recuperar-password",recuperarContraseñaUsuario)
 router.get("/comprobar/:token",comprobarTokenContraseñaUsuario)
 router.post("/nuevo-password/:token", nuevaContraseñaUsuario);
 
 
 router.get("/administrador/listar-operarios",verificarAdministrador,listarOperarios)
 router.post("/administrador/registrar-operario",registroOperarios)
 router.put("/administrador/actualizar-operario/:id",verificarAdministrador,actualizarOperario)
 router.post("/administrador/estado/:id",verificarAdministrador,cambiarEstadoOperario)
 router.get("/administrador/perfil-admin",verificarAdministrador,perfilAdministrador)
 router.post("/administrador/cambiar-password",verificarAdministrador,cambiarContraseñaAdmin)
 
 export default router