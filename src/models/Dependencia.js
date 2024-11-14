import mongoose from "mongoose"

const dependenciaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    activo: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('Dependencias', dependenciaSchema)