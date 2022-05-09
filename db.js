import {MongoClient} from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()


export default async function connection() {
    const mongoClient = new MongoClient(process.env.MONGO_URL);
    await mongoClient.connect();
    const db = mongoClient.db(process.env.BANCO);
    return { mongoClient, db };
  }
  






/* const mongoClient= new MongoClient(process.env.MONGO_URL)
const promessa=mongoClient.connect();
promessa.then(()=>{let db=mongoClient.db(process.env.BANCO);return db})
promessa.catch(e=>console.log('erro ao conectar ao banco',e)) */

//export default db