import request from "supertest"
import app from "../src/server.js"
import mongoose from "mongoose"

describe("Pruebas para Reportes",() =>{
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI_PRODUCTION);
      });
      afterAll(async () => {
        await mongoose.connection.close();
      });
      test(" Debe permitir registrar un reporte ",async() =>{
        const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MzVlNmUxZjdkZTg5MTE0NmUxOTU0MyIsInJvbCI6ImFkbWluaXN0cmFkb3IiLCJpYXQiOjE3MzQyOTMxOTYsImV4cCI6MTczNDM3OTU5Nn0.TtDPU5Oc90IlpLOl3r-KhGwogytUATQIB8zmOB9yWxQ";
        const response = await request(app)
        .post('/api/reporte/registrar-reporte')
        .set("Authorization", `Bearer ${token}`)
        .field("numero_acta", "12")
        .field("nombre_custodio", "Alex")
        .field("fecha_ingreso", "2024-01-20")
        .field("Dependencia", "674bc87463b6fbecad429fa6")
        .field("cantidad_bienes", 33)
        .field("estado", "firmado")
        .field("observacion", "ninguna")
        .field("adminId", "6735e6e1f7de891146e19543")
        .attach("archivo", "src/uploads/acta-12.pdf");
        console.log(response)
        expect(response.statusCode).toBe(201)    
    },15000);

    test(" Debe listar los reportes ",async() =>{
        const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MzVlNmUxZjdkZTg5MTE0NmUxOTU0MyIsInJvbCI6ImFkbWluaXN0cmFkb3IiLCJpYXQiOjE3MzQyOTMxOTYsImV4cCI6MTczNDM3OTU5Nn0.TtDPU5Oc90IlpLOl3r-KhGwogytUATQIB8zmOB9yWxQ";
        const response = await request(app)
        .get('/api/reporte/listar-reportes/6735e6e1f7de891146e19543')
        .set("Authorization", `Bearer ${token}`)
        console.log(response)
        expect(response.statusCode).toBe(200)    
    },15000);

    test(" Debe actualizar un campo del reporte  ",async() =>{
        const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MzVlNmUxZjdkZTg5MTE0NmUxOTU0MyIsInJvbCI6ImFkbWluaXN0cmFkb3IiLCJpYXQiOjE3MzQyOTMxOTYsImV4cCI6MTczNDM3OTU5Nn0.TtDPU5Oc90IlpLOl3r-KhGwogytUATQIB8zmOB9yWxQ";
        const response = await request(app)
        .put('/api/reporte/actualizar-reporte/675dc4860c5f08c7f022b0e1')
        .set("Authorization", `Bearer ${token}`)
        .field("estado", "firmado")
        .field("observacion", "ninguna")
        .field("adminId", "6735e6e1f7de891146e19543")
        .attach("archivo", "src/uploads/acta-12.pdf");
        console.log(response)
        expect(response.statusCode).toBe(200)    
    },15000);
    
    test(" Debe filtrar por numero de acta un  reporte  ",async() =>{
        const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MzVlNmUxZjdkZTg5MTE0NmUxOTU0MyIsInJvbCI6ImFkbWluaXN0cmFkb3IiLCJpYXQiOjE3MzQyOTMxOTYsImV4cCI6MTczNDM3OTU5Nn0.TtDPU5Oc90IlpLOl3r-KhGwogytUATQIB8zmOB9yWxQ";
        const response = await request(app)
        .get('/api/reporte/filtrar-reporte-administrador?numero_acta=7')
        .set("Authorization", `Bearer ${token}`)
        console.log(response)
        expect(response.statusCode).toBe(200)    
    },15000);
})