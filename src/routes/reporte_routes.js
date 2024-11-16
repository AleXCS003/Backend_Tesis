import { Router } from "express";
import upload from "../middlewares/multer.js";
import verificarAutenticacion from "../middlewares/autenticacion.js";
import verificarAdministrador from "../middlewares/autenticacionAdmin.js";

const router = Router ()

import { registrarReporte,
    filtrarReportes,
    actualizarReporteOperario,
    actualizarReporte, 
    listarReporte,
    registrarReporteOperario,
    listarReportesOperario

 } from "../controllers/reporte_controller.js";

//endopoints para administrador

router.get("/reporte/listar-reportes",verificarAdministrador,listarReporte)
router.post("/reporte/registrar-reporte",upload.single('archivo'),verificarAdministrador,registrarReporte)
router.put("/reporte/actualizar-reporte/:id",upload.single('archivo'),verificarAdministrador,actualizarReporte)


//endpoints para operario
router.post("/reporte/registrar-reporte-operario",upload.single('archivo'),verificarAutenticacion,registrarReporteOperario)
router.get("/reporte/listar-reporte-operario",verificarAutenticacion,listarReportesOperario)
router.put("/reporte/actualizar-reporte-operario/:id",upload.single('archivo'),verificarAutenticacion,actualizarReporteOperario)    

//rutas libres
router.get("/reporte/filtar-reporte",filtrarReportes)

export default router
