import joi from 'joi'

import dayjs from 'dayjs'
import connection from '../db.js'
export async function postTransacoes(req,res){
    const body=req.body
    const { auth } = req.headers;
    const skema=joi.object({
        valor:joi.number().required(),
        descricao:joi.string().required()
    })
    const {error}=skema.validate(body)
    if(error){res.status(500).send(error);return}

    try{
        const { mongoClient, db } = await connection();
        const token = auth?.replace('Bearer ', '');
        if(!token) {res.sendStatus(401);return}

        const session = await db.collection('sessoes').findOne({ token:token });  
        if (!session) return res.sendStatus(402);

        console.log(session)
        const usuario = await db.collection('usuarios').findOne({ email:session.email })
        if(!usuario) return res.sendStatus(403);

        await db.collection('transacoes').insertOne({ 
            dia:dayjs().format('DD/MM'),
            valor:body.valor,
            descricao:body.descricao,
            email:usuario.email 
        });
        res.sendStatus(200)

        await mongoClient.close();
    }catch(e){res.sendStatus(500)}
}

export async function getTransacoes(req,res){
    try{
        const { mongoClient, db } = await connection();
    const {auth} = req.headers;
    const token = auth?.replace('Bearer ', '');
    if(!token) return res.sendStatus(401);

    const session = await db.collection('sessoes').findOne({ token });  
    if (!session) return res.sendStatus(401);

    const usuario = await db.collection('usuarios').findOne({ email:session.email })
    if(!usuario) return res.sendStatus(401);

    const listaTransacoes = await db.collection('transacoes').find({ email:usuario.email }).toArray();
    res.send(listaTransacoes)

    await mongoClient.close();
    }catch(e){res.send(e);console.log(e)}
}