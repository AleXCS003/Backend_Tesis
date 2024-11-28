import { Router } from "express";
import verificarAutenticacion from "../middlewares/autenticacion.js";
const router = Router ()

import { loginOperario,perfilOperario,cambiarContraseñaOperario

 } from "../controllers/operario_controller.js";



//rutas libre
router.post("/operario/login",loginOperario)

//rutas privadas
router.get("/operario/perfil-operario",verificarAutenticacion,perfilOperario)
router.post("/operario/cambiar-password",verificarAutenticacion,cambiarContraseñaOperario)


export default router