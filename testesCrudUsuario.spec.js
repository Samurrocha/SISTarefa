import request from 'supertest'
import app from './app'
import supertest from 'supertest';
import { response } from 'express';

describe('testes do para criação de usuarios', () => {

    test('testar criação de usuario', async () => {

        const newUser = {
            Nome: 'Novo Usuário',
            Senha: 'senha123',
            Usuario_de_Acesso: 'novo_usuario',
            Email: 'novo_usuario@example.com',
            Nivel_Acesso: 'comum' // Nível de acesso válido
        };


        const response = await request(app)
            .post('/api/usuario')
            .send(newUser)
            .expect(401)

    });

})


describe('teste para leitura de usuarios', () => {

    test('teste na leitura de todos os usuario com usuario nao autorizado', async () => {

        const userAutorizado = {
            usuarioDeAcesso: "usuarioNoaAutorizado",
            senha: "senha nao cadatrada"

        }

        const response = await request(app)
            .get('/api/usuario')
            .expect(401)
        expect(response.body).toMatchObject({ errors: "Login requerido." })


    })


    test('teste na leitura de todos os usuario com dados gravados e usuario autorizado', async () => {


        const userAutorizado = {
            usuarioDeAcesso: "usuario de testeorigin",
            senha: "$2a$10$h1W.EbEK3wFyjhyDQiZgcu/kdncYi1GcKSwxjliiMXuTYbdDhmLX6"

        }

        const response = await request(app)
            .post('/login')
            .send(userAutorizado)
            expect(response.body).toHaveProperty('token');

            const authToken = await response.body.token

            const lerResponse = await request(app)           
            .get("/api/usuario")
            .set('Authorization', `Bearer ${authToken}`) 
            .expect(200)
            
            
        expect(lerResponse.body).toBeInstanceOf(Array)
        expect(lerResponse.body.length).toBeGreaterThanOrEqual(0)




    })





})
