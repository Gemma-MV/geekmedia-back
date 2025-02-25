// Importamos del archivo user.model la funcion que conecta con ambas bases de datos
import {conectionModel} from "../models/conection.model.js";

// Creamos una funcion que contenga a la funcion que conecta con la conexion a las bases de datos de user.model que sera lo que nos llevemos al enpoint del server
export async function genericControler (req, res) {
    await conectionModel();
    res.send('Conexiones realizadas');
}