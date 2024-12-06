import Dependencia from "../models/Dependencia.js"
import mongoose from "mongoose"
const agregarDependencia = async (req, res) => {
    try {
        const { nombre } = req.body
        if(!nombre) {
            return res.status(400).json({
                msg: "El nombre de la dependencia es obligatorio"
            })
        }
        const dependenciaExistente = await Dependencia.findOne({ nombre })
        if(dependenciaExistente) {
            return res.status(400).json({
                msg: "Esta dependencia ya existe"
            })
        }

        // Crear nueva dependencia
        const dependencia = new Dependencia({ nombre })
        await dependencia.save()

        res.status(201).json({
            msg: "Dependencia agregada correctamente",
            dependencia
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Error al agregar la dependencia"
        })
    }
}

const listarDependencias = async (req, res) => {
    try {
        const dependencias = await Dependencia.find({ activo: true })
        res.json(dependencias)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Error al obtener las dependencias"
        })
    }
}

const eliminarDependencia = async (req ,res) => {
    try {
        const { id } = req.params; 
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                msg: "ID de dependencia no válido"
            });
        }
        const dependenciaExistente = await Dependencia.findById(id);
        if (!dependenciaExistente) {
            return res.status(404).json({
                msg: "Dependencia no encontrada"
            });
        }

        await Dependencia.findByIdAndDelete(id);

        res.status(200).json({
            msg: "Dependencia eliminada correctamente"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Error al eliminar la dependencia"
        });
    }


}

export {
    agregarDependencia,
    listarDependencias,
    eliminarDependencia
}