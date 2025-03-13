// Importamos sql para gestionar la conexión a la base de datos MySQL
import {mysqlconnection} from '../databases/mysql.connection.js';
import bcrypt from 'bcrypt';
// Importamos jwt para manejar tokens de autenticación (JSON Web Tokens)
import jwt from 'jsonwebtoken';

// Conectamos con mySQL
const connection = await mysqlconnection.mySQLConnection()
// Guardamos en una constante sign para crear un token y verify para validar los token existentes
const { sign, verify } = jwt
const hashedPassword = await bcrypt.hash(password, 10);

async function loginUserDB(values) {
    const query = 'SELECT id, email, isAdmin FROM clients WHERE email = ? AND pass = ?';
    const result = await connection.query(query, [...values])
    return result
}

// Aqui consultamos a la base de datos para verificar si existe un usuario con el correo y contraseña proporcionados
async function createUser(values) {
    const query = 'INSERT INTO ?? VALUES(NULL, ?, ?, ?)';
    const [result] = await connection.query(query, [...values]);
    return result.insertId;
}  

// Creamos varias funciones exportables
export default {
    // Creamos la funcion loginUser para realizar el inicio de sesion
  loginUser: async (req, res) => {
    try {
      // Guardamos del cuerpo de la solicitud req.body el email y la contraseña
      const { email, password } = req.body
      // Si faltase alguno de los datos o fuera incorrecto que nos de un error
      if (!email || !password) {
        return res.status(400).json({ message: 'Faltan datos obligatorios' })
      }
      const isValidPassword = await bcrypt.compare(password, user[0][0].pass);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

      // Guardamos en la constante values un array con las columnas que queremos recuperar (id, email); la tabla clients; las condiciones de búsqueda (email y password) y Los valores reales que vienen del cliente (email y password)
      const values = ['id', 'email', 'clients', 'email', email, 'password', password]
      // Llamamos a la función loginUserDB(values) que ejecuta la consulta en la base de datos para verificar si existe un usuario con esas credenciales
      const user = await loginUserDB(values)

      // Validar si se encontró el usuario
      if (user[0].length === 0) {
        return res.status(401).json({ message: 'Usuario no encontrado' })
      }

      // Creamos la funcion sign para general un token
      sign({ id: user[0][0].id, email: user[0][0].email, isAdmin: user[0][0].isAdmin }, process.env.JWT_SECRET, { expiresIn: '1000s' }, (err, token) => {
        if (err) {
          return res.status(504).json({ error: 'Error al generar token' });
        }
        const response = {
          usuario: user[0][0].email,
          isAdmin: user[0][0].isAdmin,
          token: 'Bearer ' + token,
          message: 'Login realizado con éxito'
        };
        return res.status(200).json(response);
      });
    
        // Guardamos en la constante response el mail del usuario, el token generado con el prefijo "Bearer" que lo identifica como un token JWT en la cabecera de autenticación y el mensaje de login realizado
        const response = {
          usuario: user[0][0].email,
          token: 'Bearer ' + token,
          message: 'Login realizado con exito'
        }
        // Y lo retornamos
        return res.status(200).json(response)
      // Sino devolvemos el error como respuesta
    } catch (error) {
      console.error('Error en login:', error)
      res.status(500).json({ message: 'Error en login', error })
    }
  },

  // Creamos la funcion para registrar un nuevo usuario
  registerUser: async (req, res) => {
    try {
      // Guardamos del cuerpo de la solicitud req.body el email, confirmar email, la contraseña y la confirmacion de contraseña
      const { email, confirmEmail, password, confirmPassword, isAdmin } = req.body;
      // Si faltase alguno de los datos o fuera incorrecto que nos de un error
      if (!email || !confirmEmail || !password || !confirmPassword) {
        return res.status(400).json({ message: 'Faltan datos obligatorios' })
      }
      // Si el mail y la confirmacion no coinciden que nos de un error
      if (email !== confirmEmail) {
        return res.status(400).json({ message: 'Los correos no coinciden' })
      }
      // Si la contraseña y la confirmacion no coinciden que nos de un error
      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Las contraseñas no coinciden' })
      }

      // Guardamos en la constante values la tabla donde ser guardaran los datos, el mail y la contraseña
      const values = ['clients', email, password, isAdmin ? 1 : 0];
      const newUserId = await createUser(values)

      res.status(201).json({ message: 'Usuario registrado correctamente', userId: newUserId })
    } catch (error) {
      console.error('Error en registro:', error)
      res.status(500).json({ message: 'Error en registro', error })
    }
  }
}