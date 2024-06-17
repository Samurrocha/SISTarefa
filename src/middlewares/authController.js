import jwt from 'jsonwebtoken';


export default (req, res, next) => {

  
    const { authorization } = req.headers
    


    if (!authorization) {
        return res.status(401).json({
            errors: 'Login requerido.'
        })
    }
  
    const [, token]  = authorization.split(" ")

   console.log(token)
    try {
        
        const dados = jwt.verify(token, process.env.TOKEN_SECRET)

      
        const { Id, Usuario_de_Acesso, Nivel_Acesso } = dados
        
        req.userId = Id
        req.usuario_de_acesso = Usuario_de_Acesso
        req.nivel_de_acesso = Nivel_Acesso

         console.log(dados)
        return next()

    } catch (error) {
        return res.status(401).json({
            errors: `Token expirado ou inválido. ${error}`

        })
    }

}