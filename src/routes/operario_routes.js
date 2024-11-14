import { Router } from "express";
import verificarAutenticacion from "../middlewares/autenticacion.js";
const router = Router ()

import { loginOperario,recuperarContraseña,nuevaContraseña,comprobarTokenContraseña,perfilOperario

 } from "../controllers/operario_controller.js";

router.post("/operario/login",loginOperario)
router.post("/operario/recuperar-password/:token",comprobarTokenContraseña)
router.post("/operario/recuperar-password",recuperarContraseña)
router.post("/operario/nuevo-password",verificarAutenticacion,nuevaContraseña)
router.get("/operario/perfil",perfilOperario)


export default router