import { PrismaClient } from "@prisma/client";
import moment from "moment";
const Prisma = new PrismaClient


class TarefasController {


    async create(req, res) {


        const { dataInicio, dataTermino, descricao } = req.body;
        const idProjeto = parseInt(req.body.idProjeto)

        const properties = ["dataInicio", "dataTermino", "idProjeto", "descricao"]

        for (const prop of properties) {
            if (!(prop in req.body)) {
                return res.status(400).send(`É necessária a propriedade '${prop}'`);
            }
        };


        const projetos = await Prisma.tbl_projetos.findUnique({
            where: {
                Id: idProjeto
            }
        })

        if (!projetos) {
            return res.status(400).send(`Não existe esse projeto cadastrado`)
        };


        // Verificar se a data é válida
        function isValidISO8601(dateString) {
            return moment(dateString, moment.ISO_8601, true).isValid();
        }

        if (!isValidISO8601(dataInicio) || !isValidISO8601(dataTermino)) {
            return res.status(400).send(`'dataInicio' e/ou 'dataTermino' nao estao no formato 'ISO8601'`)
        }

        const inicio = new Date(dataInicio).toISOString()
        const termino = new Date(dataTermino).toISOString()

        try {
            const newTask = await Prisma.tbl_tarefas.create({
                data: {

                    Data_Inicio: inicio,
                    Data_Termino: termino,
                    Projeto_Associada: {
                        connect: { Id: idProjeto }
                    },
                    Descricao_Tarefa: descricao,


                }
            })

            return res.send(newTask)

        } catch (error) { `Erro do servidor ao criar tarefa, ERRO : \n ${error}` }
    }


    async read(req, res) {

        try {
            const allTasks = await Prisma.tbl_tarefas.findMany();

            res.send(allTasks);
        } catch (error) { }
    };


    async update(req, res) {

        const id = parseInt(req.body.id)
        let { coluna, valor } = req.body;
        const properties = ["coluna", "valor", "id"]

        for (const prop of properties) {
            if (!(prop in req.body)) {
                return res.status(400).send(`É necessária a propriedade '${prop}'`);
            }
        }

        const tarefa = await Prisma.tbl_tarefas.findUnique({
            where:{
                Id:id
            }
        })

        if (!tarefa) {
            return res.status(400).send(`não existe tarefa com este 'Id'`)
        }

        const colunasTarefas = [ "Data_Inicio", "Data_Termino", "Id_Projeto","Descricao_Tarefa","Concluida"]

        if (!colunasTarefas.includes(coluna)) {

            return res.status(400).send("nao existe essa coluna")

        }

        if (coluna == "Data_Inicio" || coluna == "Data_Termino") {

            // Verificar se a data é válida
            function isValidISO8601(dateString) {
                return moment(dateString, moment.ISO_8601, true).isValid();
            }

            if (!isValidISO8601(valor)) {
                return res.status(400).send(`'Data_Inicio' nao está no formato 'ISO8601'`)
            }

            valor = new Date(valor).toISOString()
        }

        try {
            const updateTask = await Prisma.tbl_tarefas.update({

                where: {
                    Id: id

                },
                data: {

                    [coluna]: valor
                }
            })

            res.send(updateTask)
        } catch (error) { `erro ao tentar atualiza o ${coluna} para ${valor}`}
    }



    async delete(req,res) {
        const id = parseInt(req.body.id);

        const tarefa = await Prisma.tbl_tarefas.findUnique({
            where:{
                Id:id
            }
        })

        if (!tarefa) {
            return res.status(400).send(`não existe tarefa com este 'Id'`)
        }

        try {
            const delTask = await Prisma.tbl_tarefas.delete({
                where: {
                    Id: id
                }
            })

            res.send(delTask)
        } catch (error) { `erro  do servidor a tentar  deletar tarefa de id = ${id}` }
    }


}




export default new TarefasController();

