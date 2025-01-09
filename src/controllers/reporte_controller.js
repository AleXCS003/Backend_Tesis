import mongoose from "mongoose";
import Reporte from "../models/Reporte.js";
import Operarios from "../models/Operarios.js";
import Administrador from "../models/Administrador.js";
//import fs from "fs"



//metodo para  crear un reporte 
const registrarReporte = async (req, res) => {

    try {

        const { numero_acta, estado, adminId } = req.body

        // Validar campos requeridos
        if (Object.values(req.body).includes("")) {
            
            return res.status(400).json({

                msg: "Lo sentimos, debe completar todos los campos"
            })
        }
        if (!mongoose.Types.ObjectId.isValid(adminId)) {
            
            return res.status(400).json({
                msg: "ID de administrador no válido"
            });
        }

        const administradorExiste = await Administrador.findById(adminId);
        if (!administradorExiste) {
            
            return res.status(404).json({
                msg: "El administrador no existe"
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
        let archivoUrl = null;
        if (req.file) {
            // Convertir el buffer a base64
            const b64 = Buffer.from(req.file.buffer).toString('base64');
            const dataURI = `data:${req.file.mimetype};base64,${b64}`;
            
            // Subir a Cloudinary
            const resultado = await cloudinary.uploader.upload(dataURI, {
                resource_type: 'raw',
                format: 'pdf',
                folder: 'reportes' 
            });
            archivoUrl = resultado.secure_url;
        }

        // Crear nuevo reporte
        const nuevoReporte = new Reporte({
            ...req.body,
            archivo: archivoUrl,
            administrador: adminId, // ID del admin que crea el reporte
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
        let archivoUrl = null;
        if (req.file) {
            // Convertir el buffer a base64
            const b64 = Buffer.from(req.file.buffer).toString('base64');
            const dataURI = `data:${req.file.mimetype};base64,${b64}`;
            
            // Subir a Cloudinary
            const resultado = await cloudinary.uploader.upload(dataURI, {
                resource_type: 'raw',
                format: 'pdf',
                folder: 'reportes' 
            });
            archivoUrl = resultado.secure_url;
        }

        // Crear nuevo reporte
        const nuevoReporte = new Reporte({
            ...req.body,
            archivo: archivoUrl,
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

const listarReporte = async (req, res) => {
    try {
        const { adminId } = req.params;

        // Validar que el ID del administrador sea válido
        if (!mongoose.Types.ObjectId.isValid(adminId)) {
            return res.status(400).json({
                msg: "ID de administrador no válido"
            });
        }
        const reportes = await Reporte.find().populate('Dependencia', 'nombre')
            .populate('administrador', 'username')
            .populate('operario', 'username');
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
        const reportes = await Reporte.find({ operario: operarioId }).populate('Dependencia', 'nombre');
        /**/
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

        // Incluir Dependencia si está presente
        if (req.body.dependencias) {
            datosActualizacion.Dependencia = req.body.dependencias;
        }

        //validar campos
        if (Object.values(req.body).includes("")) {
            eliminarPDF()
            return res.status(400).json({
                msg: "Lo sentimos, debe completar todos los campos"
            })
        }

        // Validar que exista el reporte
        const reporteExiste = await Reporte.findById(id);
        if (!reporteExiste) {
            return res.status(404).json({
                msg: `No existe el reporte con ID: ${id}`
            });
        }

        // Validar si el numero de acta ya existe 
        if (datosActualizacion.numero_acta) {
            const reporteConNumeroActaExistente = await Reporte.findOne({ numero_acta: datosActualizacion.numero_acta });
            if (reporteConNumeroActaExistente && reporteConNumeroActaExistente._id.toString() !== id) {
                return res.status(400).json({
                    msg: "Este número de acta ya existe"
                });
            }
        }

        // Si hay un archivo nuevo, actualizamos la ruta
        if (req.file) {
            if (reporteExiste.archivo) {
                try {
                    // Extraer el public_id directamente de la URL de Cloudinary
                    const urlParts = reporteExiste.archivo.split('/');
                    const fileNameWithExtension = urlParts[urlParts.length - 1];
                    const fileName = fileNameWithExtension.split('.')[0];
                    const publicId = `reportes/${fileName}.pdf`;
                    
                    console.log("Public ID a eliminar:", publicId);
                    
                    const result = await cloudinary.uploader.destroy(publicId, { 
                        resource_type: 'raw'
                    });
                    console.log("Resultado de la eliminación:", result);
                } catch (error) {
                    console.error("Error al eliminar archivo:", error);
                }
            }

            // Subir nuevo archivo
            const dataURI = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
            const resultado = await cloudinary.uploader.upload(dataURI, {
                resource_type: 'raw',
                format: 'pdf',
                folder: 'reportes'
            });
            datosActualizacion.archivo = resultado.secure_url;
        } else {
            datosActualizacion.archivo = reporteExiste.archivo; 
        }

        // Actualizar el reporte incluyendo el archivo si existe
        const reporteActualizado = await Reporte.findByIdAndUpdate(
            id,
            datosActualizacion,
            { new: true }
        ).populate('Dependencia', 'nombre').populate('operario', 'username');

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
        if (req.file) {

            const b64 = Buffer.from(req.file.buffer).toString('base64');
            const dataURI = `data:${req.file.mimetype};base64,${b64}`;
            
            // Subir a Cloudinary
            const resultado = await cloudinary.uploader.upload(dataURI, {
                resource_type: 'raw',
                format: 'pdf',
                folder: 'reportes' // Especifica la carpeta en Cloudinary
            });
            datosActualizar.archivo = resultado.secure_url; 
        } else {
            datosActualizar.archivo = reporteActual.archivo;
        }

        const fechaCreacion = reporteActual._id.getTimestamp()
        const fechaLimite = new Date(fechaCreacion.getTime() + 2 * 24 * 60 * 60 * 1000) //2 dias 
        //const fechaLimite = new Date(fechaCreacion.getTime() + 2 * 60000) // 2 minutos en milisegundos
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
        ).populate('Dependencia', 'nombre').populate('operario', 'username')
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

const filtrarReportes = async (req, res) => {
    try {

        const { numero_acta, fecha_inicio, fecha_fin ,estado} = req.query ;

        const filter = {};

        // Filtrar por número de acta
        if (numero_acta) {
            filter.numero_acta = Number(numero_acta);
        }

        if (fecha_inicio && fecha_fin) {
            const startDate = new Date(fecha_inicio);
            const endDate = new Date(fecha_fin);
            endDate.setHours(23, 59, 59, 999);

            filter.fecha_ingreso = {
                $gte: startDate,
                $lte: endDate
            };
        }
        // Filtrar por estado
        if (estado && ['firmado', 'pendiente'].includes(estado.toLowerCase())) {
            filter.estado = estado.toLowerCase();
        }

        //filtrar por tipo de usuario 
        if (req.operario) {
            filter.operario = req.operario._id; // Filtrar solo los reportes del operario
        } else if (req.administrador) {
            // Si es administrador, no se aplica ningún filtro adicional
        }

        const reportes = await Reporte.find(filter).populate('Dependencia', 'nombre')
        .populate('administrador', 'username')
        .populate('operario', 'username');

        if (reportes.length === 0) {
            return res.status(404).json({ msg: "No se encontraron reportes" });
        }

        res.status(200).json(reportes);

    } catch (error) {
        console.error('Error al filtrar reportes:', error);
        res.status(500).json({ msg: "Error al filtrar reportes" });
    }
}

//obtener reporte 
const obtenerPDF = async (req, res) => {
    const { id } = req.params;
    try {
        const reporte = await Reporte.findById(id);
        if (!reporte || !reporte.archivo) {
            return res.status(404).json({ msg: "Reporte no encontrado" })
        }
        //Enviar el archivo
        res.sendFile(reporte.archivo, { root: '.' })

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al obtener el PDF" })
    }
}

export {
    registrarReporte,
    listarReporte,
    filtrarReportes,
    actualizarReporteOperario,
    actualizarReporte,
    registrarReporteOperario,
    listarReportesOperario,
    obtenerPDF
}