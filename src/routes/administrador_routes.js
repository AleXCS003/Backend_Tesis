import { Router } from "express";
import verificarAdministrador from "../middlewares/autenticacionAdmin.js";

const router = Router ()

 import {
   registroAdministrador ,registroOperarios,loginAdminController,actualizarOperario,cambiarEstadoOperario,listarOperarios,
   nuevaContraseñaAdmin,cambiarContraseñaAdmin,perfilAdministrador

   
 } from "../controllers/administrador_controller.js"


 router.get("/administrador/listar-operarios",verificarAdministrador,listarOperarios)
 router.post("/administrador/register",registroAdministrador)
 router.post("/administrador/loginAdmin",loginAdminController)  
 router.post("/administrador/registrar-operario",verificarAdministrador,registroOperarios)
 router.put("/administrador/actualizar-operario/:id",verificarAdministrador,actualizarOperario)
router.post("/administrador/estado/:id",verificarAdministrador,cambiarEstadoOperario)
router.post("/administrador/nueva-password/:token", nuevaContraseñaAdmin);
router.post("/administrador/cambiar-password",verificarAdministrador,cambiarContraseñaAdmin)
router.get("/administrador/perfil-admin",verificarAdministrador,perfilAdministrador)
 
 export default router