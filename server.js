//configuiração da documentaçao
import swaggerUi from "swagger-ui-express"
import swaggerSpec from "./swagger.js"
import path from 'path'
import express from 'express'
import varAmbiente from 'dotenv';
import app from "./app.js"

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.set('view engine', 'ejs');
const paginaInicio = path.dirname('index');
const relatorioUsuario = path.dirname('relatorioUsuario');
const relatorioTarefa = path.dirname('relatorioTarefa');
app.set('views', path.join(paginaInicio, './src/views'));
app.set('views', path.join(relatorioUsuario, './src/views'))
app.set('views', path.join(relatorioTarefa, './src/views'))


//configuração do app


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