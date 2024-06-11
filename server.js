//configuiração da documentaçao
import swaggerUi from "swagger-ui-express"
import swaggerSpec from "./swagger.js"
import path  from 'path'
import express from 'express'

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.set('view engine', 'ejs');
const __dirname  =  path.dirname('index.js');

app.set('views', path.join(__dirname, './src/views'));


//configuração do app
import app from "./app.js"


import varAmbiente from 'dotenv';
varAmbiente.config();



try {
    app.listen(process.env.PORTSERVER).on('error', (err) => {
        console.log('ERRO: ' + err)
        console.log('Saindo do servidor...')
    })
    console.log('Servidor ON na porta: ')
} catch (err) {
    console.log('ERRO: ' + err)
    console.log('Saindo do servidor...')
}