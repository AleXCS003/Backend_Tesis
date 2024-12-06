import mongoose from "mongoose";
import Reporte from "../models/Reporte.js";
import Operarios from "../models/Operarios.js";

//metodo para  crear un reporte 
const registrarReporte = async (req, res) => {
    try {
        const { numero_acta, estado } = req.body

        // Validar campos requeridos
        if (Object.values(req.body).includes("")) {
            return res.status(400).json({
                msg: "Lo sentimos, debe completar todos los campos"
            })
        }

        // Verificar si ya existe el reporte
        const reporteExistente = await Reporte.findOne({ numero_acta })
        if (reporteExistente) {
            return res.status(400).json({
                msg: "Lo sentimos, este reporte ya se encuentra registrado"
            })
        }

        // Validar archivo para estado firmado
        if (estado === "firmado") {
            if (!req.file) {
                return res.status(400).json({
                    msg: "Debe cargar un archivo para el estado firmado"
                })
            }
        }

        // Crear nuevo reporte
        const nuevoReporte = new Reporte({
            ...req.body,
            archivo: req.file ? req.file.path : null,
            Administrador: req.administrador._id, // ID del admin que crea el reporte
            Dependencia: req.body.dependencias,
            fecha_creacion: Date.now()
        })

        await nuevoReporte.save()

        res.status(201).json({
            msg: "Reporte registrado con éxito"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Error al registrar el reporte"
        })
    }
}

const registrarReporteOperario = async (req, res) => {
    try {
        const { numero_acta, estado, operarioId } = req.body

        // Validar campos requeridos
        if (Object.values(req.body).includes("")) {
            return res.status(400).json({
                msg: "Lo sentimos, debe completar todos los campos"
            })
        }
        if (!mongoose.Types.ObjectId.isValid(operarioId)) {
            return res.status(400).json({
                msg: "ID de operario no válido"
            });
        }

        const operarioExiste = await Operarios.findById(operarioId);
        if (!operarioExiste) {
            return res.status(404).json({
                msg: "El operario no existe"
            });
        }


        // Verificar si ya existe el reporte
        const reporteExistente = await Reporte.findOne({ numero_acta })
        if (reporteExistente) {
            return res.status(400).json({
                msg: "Lo sentimos, este reporte ya se encuentra registrado"
            })
        }

        // Validar archivo para estado firmado
        if (estado === "firmado") {
            if (!req.file) {
                return res.status(400).json({
                    msg: "Debe cargar un archivo para el estado firmado"
                })
            }
        }

        // Crear nuevo reporte
        const nuevoReporte = new Reporte({
            ...req.body,
            archivo: req.file ? req.file.path : null,
            operario: operarioId,  // Asignamos el operario al reporte
            Dependencia: req.body.dependencias,
            fecha_creacion: Date.now()
        })

        await nuevoReporte.save()

        res.status(201).json({
            msg: "Reporte registrado con éxito"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Error al registrar el reporte"
        })
    }

}

// metodo para listar todos los reportes 
/*const listarReporte = async(req,res)=>{

    const reportes = await Reporte.find()
    res.status(200).json(reportes)


}*/
const listarReporte = async (req, res) => {
    try {
        const reportes = await Reporte.find().populate('Dependencia', 'nombre');
        res.status(200).json(reportes);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Error al obtener los reportes"
        });
    }
};

const listarReportesOperario = async (req, res) => {
    try {
        const { operarioId } = req.params;

        // Validar que el ID del operario sea válido
        if (!mongoose.Types.ObjectId.isValid(operarioId)) {
            return res.status(400).json({
                msg: "ID de operario no válido"
            });
        }

        // Buscar todos los reportes asociados al operario
        const reportes = await Reporte.find({ operario: operarioId })
            .populate('operario', 'username')
        // .sort({ fecha_creacion: -1 }); // Ordenar por fecha de creación descendente

        if (reportes.length === 0) {
            return res.status(404).json({
                msg: "No se encontraron reportes para este operario"
            });
        }

        res.status(200).json(reportes);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Error al obtener los reportes del operario"
        });
    }
}
//metodo para modificar el reporte 

const actualizarReporte = async (req, res) => {
    try {
        const { id } = req.params;
        const datosActualizacion = { ...req.body };

        // Validar que exista el reporte
        const reporteExiste = await Reporte.findById(id);
        if (!reporteExiste) {
            return res.status(404).json({
                msg: `No existe el reporte con ID: ${id}`
            });
        }
        // Si hay un archivo nuevo, actualizamos la ruta
        if (req.file) {
            datosActualizacion.archivo = req.file.filename;
        }

        // Actualizar el reporte incluyendo el archivo si existe
        const reporteActualizado = await Reporte.findByIdAndUpdate(
            id,
            datosActualizacion,
            { new: true }
        );

        res.status(200).json({
            msg: "Actualización exitosa del reporte",
            reporte: reporteActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Error al actualizar el reporte"
        });
    }

}

//metodo para modificar el reporte para los operarios
const actualizarReporteOperario = async (req, res) => {



    try {
        const { id } = req.params
        const datosActualizar = {}
        if (req.body.estado) datosActualizar.estado = req.body.estado;
        if (req.body.observacion) datosActualizar.observacion = req.body.observacion;

        // Si hay un nuevo archivo, añadirlo a los datos
        if (req.file) {
            datosActualizar.archivo = req.file.filename
        }
        // Validar campos vacíos
        if (Object.values(req.body).includes("")) {
            return res.status(400).json({
                msg: "Lo sentimos, debe completar todos los campos"
            })
        }

        // Validar ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                msg: `Lo sentimos, no existe el reporte ${id}`
            })
        }

        // Obtener el reporte actual
        const reporteActual = await Reporte.findById(id)
        if (!reporteActual) {
            return res.status(404).json({
                msg: `Lo sentimos, no se encontró el reporte ${id}`
            })
        }


        if (req.body.estado === "firmado" && !req.file && !reporteActual.archivo) {
            return res.status(400).json({
                msg: "Debe cargar un archivo para el estado firmado"
            })
        }


        const fechaCreacion = reporteActual._id.getTimestamp()
        const fechaLimite = new Date(fechaCreacion.getTime() + 2 * 60000) // 5 minutos en milisegundos
        const ahora = new Date()

        console.log('Fecha Creación:', fechaCreacion)
        console.log('Fecha Límite:', fechaLimite)
        console.log('Ahora:', ahora)
        console.log('Tiempo restante (minutos):', (fechaLimite - ahora) / 60000)

        if (ahora > fechaLimite) {
            return res.status(403).json({
                msg: "No puede modificar el reporte pasados 2 minutos desde su creación"
            })
        }

        // Actualizar el reporte
        const reporteActualizado = await Reporte.findByIdAndUpdate(
            id,
            datosActualizar,
            {
                new: true,
                runValidators: true
            }
        )
        res.status(200).json({
            msg: "Actualización exitosa del reporte",
            reporte: reporteActualizado
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Error al actualizar el reporte"
        })
    }


}


//filtrar reportes

const   filtrarReportes = async (req, res) => {
    try {

        const { numero_acta, fecha_inicio, fecha_fin } = req.body;

        const filter = {};

        // Filtrar por número de acta
        if (numero_acta && numero_acta.trim()) {
            filter.numero_acta = new RegExp(numero_acta, 'i');
        }

        if (fecha_inicio && fecha_fin) {
            const startDate = new Date(fecha_inicio);
            const endDate = new Date(fecha_fin);
            endDate.setHours(23, 59, 59, 999);

            filter.fecha_creacion = {
                $gte: startDate,
                $lte: endDate
            };
        }

        if (req.operario) {
            filter.operario = req.operario._id; // Filtrar solo los reportes del operario
        } else if (req.administrador) {
            // Si es administrador, no se aplica ningún filtro adicional
        }

        const reportes = await Reporte.find(filter).populate('Dependencia','nombre').populate('operario','username');

        if (reportes.length === 0) {
            return res.status(404).json({ msg: "No se encontraron reportes" });
        }

        res.status(200).json(reportes);

    } catch (error) {
        console.error('Error al filtrar reportes:', error);
        res.status(500).json({ msg: "Error al filtrar reportes" });
    }
}


export {
    registrarReporte,
    listarReporte,
    filtrarReportes,
    actualizarReporteOperario,
    actualizarReporte,
    registrarReporteOperario,
    listarReportesOperario
}