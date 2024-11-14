import mongoose,{Schema,model} from "mongoose";
import bycrypt  from "bcryptjs"

const operarioSchema= new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim:true
      },
    nombre :{
        type:String,
        require:true,
        trim: true 
    },

    apellido:{
        type:String,
        require:true,
        trim:true
        
    },
    telefono:{
        type:Number,
        trim:true,
        default:null
    },
    email:{
        type:String,
        require:true,
        trim:true,
        unique:true 
    },
    password:{
        type :String,
        require:true
    },
   
    estado:{
        type:Boolean,
        default:true,
        require:false,
    },
    Administrador: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Administrador'
    }
    
},{
    timestamps:true
});



operarioSchema.methods.encryPassword = async function (password) {

    const salt = await bycrypt.genSalt(10)
    const passwordEncryp= await bycrypt.hash
    (password,salt)
    return passwordEncryp

}


operarioSchema.methods.matchPassword= async function(password){
    const response = await bycrypt.compare(password, this.password)
    return response
}

operarioSchema.methods.createToken = function () {
    const tokenGenerado = this.token = Math.random().toString(36).slice(2)
    return tokenGenerado
}
export default model ('Operarios',operarioSchema)