import {Router} from 'express'
import { getTransacoes, postTransacoes } from '../controllers/transacaoController.js'
const transacaoRouter=Router()

transacaoRouter.post('/transacoes',postTransacoes)
transacaoRouter.get('/transacoes',getTransacoes)

export default transacaoRouter