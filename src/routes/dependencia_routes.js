import { Router } from "express";

import verificarAdministrador from "../middlewares/autenticacionAdmin.js";
import { agregarDependencia, listarDependencias } from '../controllers/dependencia_controller.js'

const router = Router ()

router.post('/dependencia/agregar', agregarDependencia)
router.get('/listar', listarDependencias)

export default router