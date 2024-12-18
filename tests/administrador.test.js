import request from "supertest" 
import app from "../src/server.js"
import mongoose from "mongoose"


describe("Pruebas para el administrador",() =>{
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI_PRODUCTION, { useNewUrlParser: true, useUnifiedTopology: true });
      });
      
      afterAll(async () => {
        await mongoose.connection.close();
      });

       test("Debe permitir ingresar al sistema",async() =>{
        const response = await request(app)
            .post('/api/administrador/loginAdmin')
            .send({
            "username":"adminLenin",
            "password":"1010"
            });
            console.log(response)
        expect(response.statusCode).toBe(200)
        },10000);

        test(" Debe permitir  crear un  operario",async() =>{
        const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MzVlNmUxZjdkZTg5MTE0NmUxOTU0MyIsInJvbCI6ImFkbWluaXN0cmFkb3IiLCJpYXQiOjE3MzQyMDI3NDQsImV4cCI6MTczNDI4OTE0NH0.1TwqA7LcQSxPPGLt0N2TPLQb9E6weZdtEwX5OqOyeyg";
        const response = await request(app)
        .post('/api/administrador/registrar-operario')
        .set("Authorization", `Bearer ${token}`)
        .send({
            "username":"AlexfO",
            "nombre":"Alex",
            "apellido":"Cardenas",
            "extension":"2022",
            "email":"givefov506@datingel.com"
        });
       console.log(response)
        expect(response.statusCode).toBe(200)
    },50000);

    test("Debe listar todos los operarios ",async() =>{
        const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MzVlNmUxZjdkZTg5MTE0NmUxOTU0MyIsInJvbCI6ImFkbWluaXN0cmFkb3IiLCJpYXQiOjE3MzQyMDI3NDQsImV4cCI6MTczNDI4OTE0NH0.1TwqA7LcQSxPPGLt0N2TPLQb9E6weZdtEwX5OqOyeyg";
        const response = await request(app)
        .get('/api/administrador/listar-operarios')
        .set("authorization", `Bearer ${token}`)
        expect(response.statusCode).toBe(200)
    });
    test(" Debe cambiar el estado de un operario ",async() =>{
        const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MzVlNmUxZjdkZTg5MTE0NmUxOTU0MyIsInJvbCI6ImFkbWluaXN0cmFkb3IiLCJpYXQiOjE3MzQyMDI3NDQsImV4cCI6MTczNDI4OTE0NH0.1TwqA7LcQSxPPGLt0N2TPLQb9E6weZdtEwX5OqOyeyg";
        const response = await request(app)
        .post('/api/administrador/estado/675d05155f49ee72f7fd88ba')
        .set("Authorization", `Bearer ${token}`)
        .send({
            "estado":"false"
        });
        expect(response.statusCode).toBe(200)
    },10000);

    test(" Debe actualizar la informacion de un operario ",async() =>{
        const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MzVlNmUxZjdkZTg5MTE0NmUxOTU0MyIsInJvbCI6ImFkbWluaXN0cmFkb3IiLCJpYXQiOjE3MzQyMDI3NDQsImV4cCI6MTczNDI4OTE0NH0.1TwqA7LcQSxPPGLt0N2TPLQb9E6weZdtEwX5OqOyeyg";
        const response = await request(app)
        .put('/api/administrador/actualizar-operario/67488d5715f1dc8b39a8c588')
        .set("Authorization", `Bearer ${token}`)
        .send({
          "username":"AlexC",
          "nombre":"Alex",
          "apellido":"Cardenas",
          "extension":"2044" 
        });
        expect(response.statusCode).toBe(200)
    },10000);   

    test(" Debe actualizar la contraseña del administrador ",async() =>{
        const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MzVlNmUxZjdkZTg5MTE0NmUxOTU0MyIsInJvbCI6ImFkbWluaXN0cmFkb3IiLCJpYXQiOjE3MzQyMDI3NDQsImV4cCI6MTczNDI4OTE0NH0.1TwqA7LcQSxPPGLt0N2TPLQb9E6weZdtEwX5OqOyeyg";
        const response = await request(app)
        .post('/api/administrador/cambiar-password')
        .set("Authorization", `Bearer ${token}`)
        .send({
          "passwordActual": "1011",
          "nuevoPassword": "1010",
          "confirmarPassword": "1010"
        });
        expect(response.statusCode).toBe(200)
    },10000); 
    
    test(" Debe permitir recuperar la contraseña al usuario ",async() =>{
        const response = await request(app)
        .post('/api/recuperar-password')
        .send({
          "email":"alexd003cardenas@gmail.com"
        });
        expect(response.statusCode).toBe(200)
    },10000); 

    test(" Debe permitir crear una nueva contraseña ",async() =>{
        const response = await request(app)
        .post('/api/nuevo-password/jrimrrdx6fg')
        .send({
          "password": "A123",
          "confirmarPassword": "A123"
          
        });
        expect(response.statusCode).toBe(200)
    },10000); 


    
})



