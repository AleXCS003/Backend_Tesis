import app from './server.js'
//importar la conexion de database.js
import connection from './database.js'

connection()

app.listen(app.get('port'),()=>{
    console.log(`Server ok on http://host:${app.get('port')}`);
})
