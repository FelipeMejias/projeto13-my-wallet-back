import joi from 'joi'

import bcrypt from 'bcrypt'
import connection from '../db.js'
import { v4 as uuid } from 'uuid';


export  async function postCadastro(req,res){
    const body=req.body
    const skema=joi.object({
        nome:joi.string().required(),
        email:joi.string().email().required(),
        senha:joi.string().required(),
        confirmacao:joi.ref('senha')
    })
    const {error}=skema.validate(body)
    if(error){res.status(500).send(error);return}
    
    const senhaCriptografada = bcrypt.hashSync(body.senha, 10)

    try{
        const { mongoClient, db } = await connection();

        const usuario=await db.collection('usuarios').findOne({email:body.email})
        
        if(usuario){res.status(500).send("Esse e-mail já está em uso!");return}
        await db.collection('usuarios').insertOne({
            nome:body.nome,
            email:body.email,
            senha:senhaCriptografada
        })
        res.status(200).send('Você foi registrado!')

        await mongoClient.close();
    }catch(e){res.send(e);console.log(e)}
}

export async function postLogin(req,res){
    const body=req.body;
    const skema=joi.object({
        email:joi.string().email().required(),
        senha:joi.string().required()
    })
    const {error}=skema.validate(body)
    if(error){res.status(500).send(error);return}
    

    
    const token = uuid();
    try{
        const { mongoClient, db } = await connection();
        const usuario=await db.collection('usuarios').findOne({email:body.email})
        
        if(usuario && bcrypt.compareSync(body.senha, usuario.senha)){
            delete usuario.senha
            await db.collection('sessoes').insertOne({...usuario,token})
            res.send({token,nome:usuario.nome})

        }else{res.sendStatus(500)}
        await mongoClient.close();
    }catch(e){res.sendStatus(500)}

}