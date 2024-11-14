import { Router } from "express";
import upload from "../middlewares/multer.js";
import verificarAutenticacion from "../middlewares/autenticacion.js";

const router = Router ()

import { registrarReporte,
    filtrarReportes,
    actualizarReporteOperario,
    actualizarReporte, 
    listarReporte,
    registrarReporteOperario

 } from "../controllers/reporte_controller.js";

router.get("/reporte/listar-reportes/",listarReporte)
router.post("/reporte/registrar-reporte",upload.single('archivo'),registrarReporte)
router.get("/reporte/filtar-reporte",filtrarReportes)
router.put("/reporte/actualizar-reporte-operario/:id",upload.single('archivo'),actualizarReporteOperario)
router.put("/reporte/actualizar-reporte/:id",upload.single('archivo'),actualizarReporte)
router.post("/reporte/registrar-reporte-operario",upload.single('archivo'),registrarReporteOperario)



export default router