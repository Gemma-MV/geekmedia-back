// Importamos la conexion a mysql y a mongo que esta en la carpeta de databases
import {mysqlconnection} from '../databases/mysql.connection.js';
import {mongoconnection} from '../databases/mongo.connection.js';

// Creamos una instancia de Sequelize que conecta con la conexion a mysql
// const sequelize = connectToMySQL();

// Aqui metemos el enlace a las conexiones de mysql y mongo a la vez para que conecte con las 2 juntas en una funcion que vamos a exportar
export async function conectionModel () {
    try {
        // Creamos una instancia de Sequelize que conecta con la conexion a mysql
        const sequelize = await mysqlconnection();
        // Autenticamos la conexión a la base de datos mysql
        await sequelize.authenticate();
        console.log('Conectado a MySQL');

        // Sincronizamos con la base de datos
        await sequelize.sync();
        console.log('Modelos sincronizados');
      
        // Hacemos un await que conecta con mongo
        await mongoconnection();
        console.log('Conectado a Mongoose');
  
      } catch (err) {
        console.error('Error de conexión a las bases de datos:', err);
      }
};