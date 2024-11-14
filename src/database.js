//importar mongoose 
import mongoose from "mongoose"

//permitir que solo los campos definidos en 
//en el schema sena alamacenados en la BDD
mongoose.set('strictQuery',true)

//funcion para la conexion 
const connection  =async()=>{
    try{
        const {connection}= await mongoose.connect(process.env.MONGODB_URI_PRODUCTION)
        //MOSTRAR POR CONSOLA
        console.log(`Database is connected on ${connection.host} - ${connection.port} `)
    } catch (error){
        //capturar error  en  la conexion 
        console.log(error)
    }
}
export default connection