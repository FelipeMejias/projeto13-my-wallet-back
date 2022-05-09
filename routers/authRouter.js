import {Router} from 'express'
import {postCadastro, postLogin} from '../controllers/authController.js'
const authRouter=Router()

authRouter.post('/cadastro',postCadastro)
authRouter.post('/login',postLogin)

export default authRouter