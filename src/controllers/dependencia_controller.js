import Dependencia from "../models/Dependencia.js"
const agregarDependencia = async (req, res) => {
    try {
        const { nombre } = req.body

        // Validar que venga el nombre
        if(!nombre) {
            return res.status(400).json({
                msg: "El nombre de la dependencia es obligatorio"
            })
        }

        // Verificar si ya existe
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

export {
    agregarDependencia,
    listarDependencias
}