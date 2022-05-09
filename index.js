import cors from 'cors'
import dayjs from 'dayjs'
import dotenv from 'dotenv'
import express, {json} from 'express'

import db from './db.js'
import authRouter from './routers/authRouter.js'
import transacaoRouter from './routers/transacaoRouter.js'

dotenv.config()
const app=express()
app.use(cors())
app.use(json())
const port=process.env.PORTA || 5000

app.use(authRouter)
app.use(transacaoRouter)


app.listen(port,()=>console.log('servidor em pé'))