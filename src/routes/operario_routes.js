import { Router } from "express";
import verificarAutenticacion from "../middlewares/autenticacion.js";
const router = Router ()

import { loginOperario,recuperarContraseña,nuevaContraseña,comprobarTokenContraseña,perfilOperario,cambiarContraseñaOperario

 } from "../controllers/operario_controller.js";



//rutas libre
router.post("/operario/login",loginOperario)
router.get("/operario/comprobar/:token",comprobarTokenContraseña)
router.post("/operario/recuperar-password",recuperarContraseña)
router.post("/operario/nuevo-password/:token",nuevaContraseña)

//rutas privadas
router.get("/operario/perfil-operario",verificarAutenticacion,perfilOperario)
router.post("/operario/cambiar-password",verificarAutenticacion,cambiarContraseñaOperario)


export default router