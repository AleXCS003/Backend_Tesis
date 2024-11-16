import { Router } from "express";

import verificarAdministrador from "../middlewares/autenticacionAdmin.js";
import { agregarDependencia, listarDependencias } from '../controllers/dependencia_controller.js'

const router = Router ()

router.post('/dependencia/agregar', verificarAdministrador,agregarDependencia)
router.get('/listar',verificarAdministrador, listarDependencias)

export default router