import request from "supertest"
import app from "../src/server.js"
import mongoose from "mongoose"

describe("Pruebas para Dependencias",() =>{
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI_PRODUCTION, { useNewUrlParser: true, useUnifiedTopology: true });
      });
      afterAll(async () => {
        await mongoose.connection.close();
      });
      test(" Debe permitir crear una nueva dependencia ",async() =>{
        const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MzVlNmUxZjdkZTg5MTE0NmUxOTU0MyIsInJvbCI6ImFkbWluaXN0cmFkb3IiLCJpYXQiOjE3MzQyOTMxOTYsImV4cCI6MTczNDM3OTU5Nn0.TtDPU5Oc90IlpLOl3r-KhGwogytUATQIB8zmOB9yWxQ";
        const response = await request(app)
        .post('/api/dependencia/agregar')
        .set("Authorization", `Bearer ${token}`)
        .send({
            "nombre":"CICAM"
        });
        expect(response.statusCode).toBe(201)
        
    },10000);
    test(" Debe permitir listar las dependencias ",async() =>{
        const response = await request(app)
        .get('/api/dependencia/listar')
        expect(response.statusCode).toBe(200)
        
    },10000);

    test(" Debe permitir eliminar una dependencia ",async() =>{
        const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MzVlNmUxZjdkZTg5MTE0NmUxOTU0MyIsInJvbCI6ImFkbWluaXN0cmFkb3IiLCJpYXQiOjE3MzQyOTMxOTYsImV4cCI6MTczNDM3OTU5Nn0.TtDPU5Oc90IlpLOl3r-KhGwogytUATQIB8zmOB9yWxQ";
        const response = await request(app)
        .delete('/api/dependencia/eliminar/675f382aaf73560ededa057e')
        .set("Authorization", `Bearer ${token}`)
        expect(response.statusCode).toBe(200)
        
    },10000);

})
