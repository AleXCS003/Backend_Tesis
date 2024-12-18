import request from "supertest"
import app from "../src/server.js"
import mongoose from "mongoose"

describe("Pruebas para operario",() =>{
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI_PRODUCTION, { useNewUrlParser: true, useUnifiedTopology: true });
      });
      afterAll(async () => {
        await mongoose.connection.close();
      });
      test("Bebe permitir ingresar al sistema",async() =>{
        const response = await request(app)
            .post('/api/operario/login')
            .send({
            "username":"AlexC",
            "password":"A123"
            });
        expect(response.statusCode).toBe(200)
    },10000);

      test(" Debe mostrar la informacion del operario ",async() =>{
        const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDg4ZDU3MTVmMWRjOGIzOWE4YzU4OCIsInJvbCI6Im9wZXJhcmlvIiwiaWF0IjoxNzM0Mjg5MjI4LCJleHAiOjE3MzQzNzU2Mjh9.dg4mnQ7WKro0_LbqITdE_cV0K0GvDppVEbJ6-cbwqCQ";
        const response = await request(app)
        .get('/api/operario/perfil-operario')
        .set("Authorization", `Bearer ${token}`)
        expect(response.statusCode).toBe(200)
    },50000);   

    test(" Debe actualizar la contraseña del operario ",async() =>{
        const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDg4ZDU3MTVmMWRjOGIzOWE4YzU4OCIsInJvbCI6Im9wZXJhcmlvIiwiaWF0IjoxNzM0Mjg5MjI4LCJleHAiOjE3MzQzNzU2Mjh9.dg4mnQ7WKro0_LbqITdE_cV0K0GvDppVEbJ6-cbwqCQ";
        const response = await request(app)
        .post('/api/operario/cambiar-password')
        .set("Authorization", `Bearer ${token}`)
        .send({
          "passwordActual": "A123",
          "nuevoPassword": "A1234",
          "confirmarPassword": "A1234"
        });
        expect(response.statusCode).toBe(200)
    },10000);
})
