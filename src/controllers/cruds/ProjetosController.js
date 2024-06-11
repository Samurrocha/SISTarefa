import { PrismaClient } from "@prisma/client";
import moment from "moment";
const Prisma = new PrismaClient


class ProjetosController {


    async create(req, res) {

        const idGerente = parseInt(req.body.idGerente)
        const { nome, dataInicio } = req.body;

        const properties = ["nome", "idGerente", "dataInicio"]

        for (const prop of properties) {
            if (!(prop in req.body)) {
                return res.status(400).send(`É necessária a propriedade '${prop}'`);
            }
            
        }


        const project = await Prisma.tbl_projetos.findUnique({
            where: {
                Nome: nome
            }
        })


        const usuario = await Prisma.tbl_usuarios.findUnique({
            where: {
                Id: idGerente
            }
        })


        if (!usuario) {
            return res.status(400).send("não  existe este usuario gerente")
        }

        if (project) {
            return res.status(400).send("Não pode ser criado um projeto com um nome ja existente")
        }

        // Verificar se a data é válida
        function isValidISO8601(dateString) {
            return moment(dateString, moment.ISO_8601, true).isValid();
        }


        if (!isValidISO8601(dataInicio)) {
            return res.status(400).send(`'Data_Inicio' nao está no formato 'ISO8601'`)
        }

        const inicio = new Date(dataInicio).toISOString()

        // query
        try {
            const newProject = await Prisma.tbl_projetos.create({
                data: {
                    Nome: nome,
                    Data_Inicio: inicio,
                    Usuario_Gerente: {
                        connect: { Id: idGerente }
                    }

                }
            })
            res.send(newProject)
        } catch (error) { res.status(500).send(`Erro do servidor ao criar o projeto: \n ${error.message}`) }
    }


    async read(req, res) {



        try {
            const allProjects = await Prisma.tbl_projetos.findMany();

            res.send(allProjects);
        } catch (error) { res.status(500).send(`Erro do servidor ler os projetos: \n ${error.message}`) }
    };


    async update(req, res) {


        let { coluna, valor } = req.body;
        const id = parseInt(req.body.id);
        const properties = ["id", "coluna", "valor"];

        for (const prop of properties) {
            if (!(prop in req.body)) {
                return res.status(400).send(`É necessária a propriedade '${prop}'`);
            }
        }

        const allProjects = await Prisma.tbl_projetos.findUnique({
            where: {
                Id: id
            }
        })

        if (!allProjects) {
            return res.status(400).send(`não existe projeto com este 'id'`)
        }

        const colunasUsuarios = ["Nome", "Data_Inicio", "Id_Gerente"]

        if (!colunasUsuarios.includes(coluna)) {

            return res.status(400).send("nao existe essa coluna")

        }

        if (coluna == "Data_Inicio") {

            // Verificar se a data é válida
            function isValidISO8601(dateString) {
                return moment(dateString, moment.ISO_8601, true).isValid();
            }

            if (!isValidISO8601(valor)) {
                return res.status(400).send(`'Data_Inicio' nao está no formato 'ISO8601'`)
            }

            valor = new Date(valor).toISOString()
        }

        if (coluna == "Id_Gerente") {
            valor = parseInt(valor)

            const usuario = await Prisma.tbl_usuarios.findUnique({
                where: {
                    Id: valor
                }
            })

            if (!usuario) {
                return res.status(400).send("não  existe este usuario gerente")
            }
        }


        try {
            const UpdateProject = await Prisma.tbl_projetos.update({

                where: {
                    Id: id

                },
                data: {

                    [coluna]: valor
                }
            })
            res.send(UpdateProject)
        } catch (error) { res.status(500).send(`Erro do servidor ao atualizar o projeto: \n ${error.message}`) }
    }



    async delete(req, res) {

        if (!("id" in req.body)) {
            return res.status(400).send(`É necssária a coluna 'id'`)
        }

        const id = parseInt(req.body.id);

        const project = await Prisma.tbl_projetos.findUnique({
            where: {
                Id: id
            }
        })

        if (project == null) {
            return res.status(400).send("não existe projeto com o Id indicado")
        }



        try {
            const delProject = await Prisma.tbl_projetos.delete({
                where: {
                    Id: id
                }
            })

            return res.send(`O seguinte projeto foi deletado:\n ${JSON.stringify(delProject)}`)

        } catch (error) { res.status(500).send(`Erro do servidor ao deletar projeto: ${error.message}`) };


    }

}







export default new ProjetosController();

