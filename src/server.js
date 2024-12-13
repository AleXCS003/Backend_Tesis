import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import routerAdministrador from './routes/administrador_routes.js'
import routerOperario from './routes/operario_routes.js'
import routerReporte from './routes/reporte_routes.js'
import routerDependencia from './routes/dependencia_routes.js'





//inicializaciones 
const app = express()
dotenv.config()

//Configuraciones CORS
app.use(cors({
  origin: 'https://componente-frontend-tic.vercel.app',
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}))

app.options('*',cors({
  origin: 'https://componente-frontend-tic.vercel.app',
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}))

//configuraciones 
app.set('port',process.env.port || 3000)

//
app.use(express.json ())

//routes
app.use("/api",routerAdministrador)
app.use("/api",routerOperario)
app.use("/api",routerReporte)
app.use("/api",routerDependencia)
//Manejo de una ruta que no sea encontrada 
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))
app.use('/uploads', express.static('uploads'))

//exportar
export default app
