import { Router } from "express";

import verificarAdministrador from "../middlewares/autenticacionAdmin.js";
import { agregarDependencia, listarDependencias,eliminarDependencia} from '../controllers/dependencia_controller.js'

const router = Router ()

//rutas privadas
router.post('/dependencia/agregar', verificarAdministrador,agregarDependencia)
router.delete('/dependencia/eliminar/:id',verificarAdministrador,eliminarDependencia)

//rutas libres
router.get('/dependencia/listar', listarDependencias)

export default router