import { closeMongo } from '../databases/mongo.connection.js';
import dotenv from 'dotenv';
// Importamos el archivo genericMongoCrud que contiene la exportacion para buscar todos o buscar uno
import genericMongoCrud from '../models/crudMongo/genericMongoCrud.js';

dotenv.config();

export default {
    // La funcion allMusic contendra el getAll de genericMongoCrud y le pasamos como parametros dos argumentos: req (la solicitud HTTP) y res (la respuesta HTTP).
    allMusic: async (req, res) => {
        try {
            const result = await genericMongoCrud.getAll(process.env.COLL_MUSIC)
            res.json(result)
        } catch (error) {
            res.status(500).send('Error Interno del Servidor');
        }
        finally {
            await closeMongo()
        }
    }

}