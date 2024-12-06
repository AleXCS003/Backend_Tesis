import mongoose ,{Schema,model} from "mongoose"

const reporteSchema = new Schema({
    numero_acta:{
        type:String,
        require:true,
        trim:true,
        unique:true
    },
    nombre_custodio:{
        type:String,
        require:true,
        trim:true
    },
    fecha_ingreso:{
        type:Date,
        require:true,
        trim:true,
        


    },
    fecha_creacion:{
        type:Date,
        require:true,
        trim:true,
        default:Date.now() 


    },
    Dependencia: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dependencias',
        require: true
    },

     cantidad_bienes:{
     type: Number,
     require:true,
     min:1

     },
     estado:{
        type:String,
        enum:['pendiente','firmado'],
        require:true,
        default:'pendiente'
     },
     
     observacion:{
        type:String,
        require:true,
        trim:true
        

     },
     archivo:{
        type: String,  // Path del archivo
        required: function() {
            return this.estado === 'firmado'  // Archivo obligatorio solo si estado es 'firmado'
        }  
     },
   
    operario: {
        type: mongoose.Schema.Types.ObjectId,
        //type: String,
        ref: 'Operarios'
        },
    
});
export default model ('Reporte',reporteSchema);
