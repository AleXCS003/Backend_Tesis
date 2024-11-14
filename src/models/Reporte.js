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
    Dependencia:{
        type:String,
        enum:['Consejo Politecnico','Rectorado','Vicerrectorado de Docencia','Vicerrectorado de Investación,Innovación y Vinculación ','Escuela de Formación de Tecnólogos','Centros de Modelización Matematica','Museo','Observatorio Astrónomico de Quito','Auditoria Interna','Asesoria Jurídica','Planificación','Relaciones Institucionales','Comunicación','Secretaria General','Administrativo--PENDIENTE(GESTION,BODEGAS/INMUEBLES/HEMICILIO)','Financiero','Talento Humano','Gestión de la Información y Procesos','Facultad de Ciencias ','Facultad de Ciencias Administrativas','Facultad de Ingeniería Química y Agroindustria','Facultad de Ingeniería Eléctrica y Electrónica','Facultad de Ingeniería en Geología y Petroleos','Facultad de Ingeniería Civíl y Ambiental','Facultad de Ingeniería en Sistemas' ,'Departamento de Formación Básica','Departamento de Ciencias Sociales','Metal Mecanica San Bartolo','Geofisíco','Centro de Educación Continua'],
        require:true
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
    /* Dependencia: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dependencia',
        require: true
    }*/
});
export default model ('Reporte',reporteSchema);