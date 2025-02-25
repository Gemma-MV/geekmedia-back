import { mongoconnection } from '../../databases/mongo.connection.js';
import dotenv from 'dotenv';

dotenv.config();

// Aqui conectamos con la base de datos de mongo para poder hacer las busquedas en ella
const client = await mongoconnection();

export default {
    // GetAll contendra la llamada a todos los datos de la coleccion que le pasamos como parametro coll (collection)
    getAll: async(coll) => {
        // Aqui guardamos en una constante la base de datos que esta en el dato del archivo env y corresponde a geekmedia
        const db = client.db(process.env.MONGO_BBDD)
        // Aqui extraemos de la base de datos la coleccion y la guardamos en la constante collection 
        const collection = db.collection(coll)
        // Aqui le decimos que encuentre (find) con find({}) pero como no ponemos nada entre los corchetes encontrara todos los datos y con .toArray() que convierta el resultado en un array y guardamos el resultado en una constante result y la retornamos 
        const result = await collection.find({}).toArray()

        return result;
    },
    // GetOne contendra la llamada a uno de los datos de la coleccion que le pasamos como parametro coll (collection) y el parametro filter que sera el criterio de busqueda para encontrar un solo dato
    getOne: async(coll, filter) => {
        const db = client.db(process.env.MONGO_BBDD)
        const collection = db.collection(coll)
        // Aqui le decimos que busque uno para encontrar un solo dato (findOne) y filter que es el objeto que especifica los criterios de busqueda
        const result = await collection.findOne(filter)

        return result;
    } 
}