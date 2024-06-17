import { PrismaClient, nivel_de_acesso } from '@prisma/client'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'

const Prisma = new PrismaClient()

class tokenController {


    async store(req, res) {

        const { usuarioDeAcesso, senha } = req.body

        if (!usuarioDeAcesso || !senha) {

            return res.status(401).json({

                errors: 'Credenciais inválidas.'

            })

        }

        const user = await Prisma.tbl_usuarios.findUnique({

            where: {
                Usuario_de_Acesso: usuarioDeAcesso

            }
        })



        if (!user) {
            return res.status(401).json({ errors: 'Usuário não existe.' })
        }

        try {
            bcrypt.compare(senha, user.Senha, async(err, result) => {

                if (!result) {
                  
                    return res.status(401).json({ error: 'senha invalida' })
                    // Senha fornecida não corresponde ao hash armazenado
                }
            })
        } catch (err) { res.status(500).json({ ERROR: err }) }


        const { Id, Usuario_de_Acesso, Nivel_Acesso } = user

        try {
           
            const token = jwt.sign(
                { Id, Usuario_de_Acesso, Nivel_Acesso },
                process.env.TOKEN_SECRET,
                { expiresIn:parseInt(process.env.TOKEN_EXPIRATION) }
            )
            return res.json({token: token})
            //res.status(200).json({ status: "autenticação feita com sucesso" })
            

        } catch (error) {
            return res.status(400).json({ ERRO: `falha na autenticação\n ${error}` })
        }


    }

}


export default new tokenController()