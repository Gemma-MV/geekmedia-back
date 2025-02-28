// Importamos la biblioteca express 
import express,{ json, urlencoded } from 'express';
// Cors es Un mecanismo que permite que recursos restringidos en una página web sean solicitados desde otro dominio fuera del dominio desde el que se sirvió el recurso.
import cors from 'cors';
import { router } from '../geekmedia-back/routes/routes.js';
import { fileURLToPath } from 'url';
import path from 'path';
// Dotenv es lo que nos permite utilizar el archivo env
import dotenv from 'dotenv';

// Cargamos la configuracion de dotenv para poder utilizar los datos que estan en el archivo env
dotenv.config();

// Almacenamos en una constante app la aplicacion en express para que nos sea mas facil trabajar con ella
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors());
app.use(express.static(path.join(__dirname, 'resources/books')));
app.use(express.static(path.join(__dirname, 'resources/movies')));
app.use(express.static(path.join(__dirname, 'resources/music')));

// Agregamos el middleware (El middleware es una función que tiene acceso al objeto de solicitud (req), al objeto de respuesta (res) y a la siguiente función de middleware en el ciclo de solicitud-respuesta) y le agregamos el json para que nuestra aplicación pueda entender y procesar datos en formato JSON que se envíen en las solicitudes
app.use(json());
// Este middleware se utiliza para analizar los datos que llegan en las peticiones HTTP. La opción { extended: false } indica que se deben usar las capacidades de análisis incorporadas de Node.js.
app.use(urlencoded({ extended: false }));
//Este middleware que se utiliza para permitir solicitudes desde diferentes orígenes (dominios) a tu servidor. Sin CORS, las solicitudes de diferentes dominios estarían restringidas debido a la política de Same-Origin del navegador. Al usar cors(), le estás diciendo al servidor que permita solicitudes de cualquier origen por defecto, aunque puedes configurar CORS para permitir solo ciertos orígenes si lo prefieres.

app.use(router);

const port = process.env.PORT;

// Iniciamos el servidor solo después de establecer la conexión a la base de datos
app.listen(port, () => {
    console.log('Servidor escuchando en el puerto 3001');
});