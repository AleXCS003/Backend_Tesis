import mongoose, {Schema,model} from "mongoose";
import bycrypt  from "bcryptjs"

const adminSchema= new Schema({

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
    extension:{
        type:Number,
        trim:true,
        default:null,
        unique:true,
        trim:true
    },
    email:{
        type:String,
        require:true,
        trim:true,
        unique:true 
    },
    password:{
        type :String,
        require:true,
        trim:true
    },
    
    status:{
        type:Boolean,
        default:true} ,

    token:{
        type:String,
        default:null,
        trim:true
    },
    

    
},{
    timestramps : true
});

adminSchema.methods.encryptPassword = async function(password) {
    const salt = await bycrypt.genSalt(10)
    const passwordEncrypt= await bycrypt.hash(password,salt)
    return passwordEncrypt
    
}
adminSchema.methods.matchPassword = async function (password) {
    const response= await bycrypt.compare(password,this.password)
    return response
    
}
// metodo para crear un token 
adminSchema.methods.createToken=async function () {
    const tokenGenerado = Math.random().toString(36).slice(2)
    return tokenGenerado
    
}

export  default model ("administradores",adminSchema)