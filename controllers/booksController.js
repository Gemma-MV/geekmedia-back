import { closeMongo } from '../databases/mongo.connection.js';
import dotenv from 'dotenv';
// Importamos el archivo genericMongoCrud que contiene la exportacion para buscar todos o buscar uno
import genericMongoCrud from '../models/crudMongo/genericMongoCrud.js';

dotenv.config();

export default {
    // La funcion allBooks contendra el getAll de genericMongoCrud y le pasamos como parametros dos argumentos: req (la solicitud HTTP) y res (la respuesta HTTP).
	allBooks: async (req, res) => {
		try {
            // Aqui le pedimos que se traiga de genericMongoCrud la funcion getAll que hace la busqueda de toda la coleccion, se lo decimos con process.env.COLL_BOOKS que la coleccion que se tiene que traer es la de los libros que estan en mongo y tenemos declarada en el archivo .env
			const result = await genericMongoCrud.getAll(process.env.COLL_BOOKS)
            // Aqui convertimos el resultado (todos los documentos de la colección books) a formato JSON y lo envía como respuesta a la solicitud HTTP.
			res.json(result)
        // Aqui capturamos si hubiese un error
		} catch (error) {
			res.status(500).send('Error Interno del Servidor');
		}
        // Y finalmente cerramos el servidor
		finally {
			await closeMongo()
		}
	},
	// oneBook: async (req, res) => {
	// 	const { id } = req.params;
	// 	try {
    //         // Aqui le pedimos que se traiga de genericMongoCrud la funcion getOne que hace la busqueda de un elemento de la coleccion, se lo decimos con process.env.COLL_BOOKS que la coleccion que se tiene que traer es la de los libros que estan en mongo y tenemos declarada en el archivo .env
	// 		const result = await genericMongoCrud.getOne(process.env.COLL_BOOKS, id)
    //         // Aqui convertimos el resultado a formato JSON y lo envía como respuesta a la solicitud HTTP.
	// 		res.json(result)
    //     // Aqui capturamos si hubiese un error
	// 	} catch (error) {
	// 		res.status(500).send('Error Interno del Servidor');
	// 	}
    //     // Y finalmente cerramos el servidor
	// 	finally {
	// 		await closeMongo()
	// 	}
	// }
}