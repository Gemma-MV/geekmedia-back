// Importamos bcrypt para encriptar (hashear) y comparar contraseñas de manera segura
import bcrypt from "bcryptjs";
// Importamos jwt para manejar tokens de autenticación (JSON Web Tokens)
import jwt from "jsonwebtoken";

// Creamos una funcion asincrona que vamos a exportar para manejar cuando el usuario haga el login
export const login = async (req, res) => {
    try {
        // Guardamos del cuerpo de la solicitud req.body el email y la contraseña
        const { email, password } = req.body;
        // Si faltase alguno de los datos que nos de un error
        if (!email || !password) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }
        
        // Buscamos en la base de datos un usuario con el email proporcionado usando User.findOne y le decimos donde ({ where: { email } })
        const user = await User.findOne({ where: { email } });
        // Si no encontramos el usuario con esos datos que nos devuelva el error
        if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

        // Guardamos en la constante isMatch la verificacion de si la contraseña ingresada coincide con la contraseña encriptada almacenada en la base de datos utilizando bcrypt.compare
        const isMatch = await bcrypt.compare(password, user.password);
        // Sino coincide devolvemos el error
        if (!isMatch) return res.status(401).json({ error: "Contraseña incorrecta" });

        // Guardamos en la constante token la creacion de un token con jwt que contenga los siguientes datos: Payload: Incluimos el ID del usuario y su rol de administrador (isAdmin);Clave secreta: process.env.JWT_SECRET protege la integridad del token y Expiración: El token será válido por 1 hora.
        const token = jwt.sign(
            { id: user.id, isAdmin: user.isAdmin }, // Payload del token
            process.env.JWT_SECRET, // Clave secreta
            { expiresIn: "1h" } // Duración del token
        );
        // Si todo es correcto que nos responda con un json que contenga un mensaje de éxito junto con el token y algunos datos del usuario (nombre, email y rol de administrador)
        res.json({ message: "Login exitoso", token, isAdmin: user.isAdmin, name: user.username, email: user.email});
    } catch (error) {
        // Si algo falla, devolvemos un error 500 (Internal Server Error) y mostramos detalles del error para ayudar con la depuración
        res.status(500).json({ error: "Error en el servidor", details: error });
    }
};

// Creamos una funcion asincrona que vamos a exportar para que gestione el registro de nuevos usuarios en la aplicacion
export const register = async (req, res) => {
    try {
        // Guardamos del cuerpo de la solicitud req.body el nombre de usuario, el email y la contraseña
        const { username, email, password } = req.body;
        // Si faltase alguno de los datos que nos de un error
        if (!username || !email || !password) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        // Buscamos en la base de datos un usuario con el email proporcionado usando User.findOne y le decimos donde ({ where: { email } })
        const existingUser = await User.findOne({ where: { email } });
        // Si existe que nos de el error del correo ya esta registrado
        if (existingUser) {
            return res.status(409).json({ error: "El correo ya está registrado" });
        }

        // Aqui hasheamos la contraseña que es una forma de convertirla en una cadena de texto irreconocible e irreversible. Este proceso es como aplicar una fórmula matemática compleja para proteger las contraseñas en una base de datos para que si alguien accede a la base de datos, no pueda saber cuáles eran las contraseñas originales
        // Guardamos en la constante salt la realizacion de un salt (sal) es un valor aleatorio que se añade a la contraseña antes de generar su hash para que aunque dos personas tengan la misma contraseña, sus hashes sean diferentes. Generamos un "salt" con un factor de complejidad de 10 usando bcrypt que hace la encriptacion y genSalt(10)
        const salt = await bcrypt.genSalt(10);
        // Guardamos en la constante hashedPassword el hash resultante de la mezcla del salt con la password del usuario siendo este una clave hash
        const hashedPassword = await bcrypt.hash(password, salt);

        // Guardamos en la constante newUser la creacion del usuario con los valores nombre de usuario, email, contraseña con el hash y si es administrador como falso para que de inicio no se creen usuarios como administrador 
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            isAdmin: false
        });

        // Crearmos el token JWT para el nuevo usuario, lo guardamos en la constante token y usamos la función sign del paquete jsonwebtoken para crear un JWT que contendra el id del nuevo usuario y si el nuevo usuario tiene permisos de administrador
        const token = jwt.sign(
            { id: newUser.id, isAdmin: newUser.isAdmin },
            process.env.JWT_SECRET,
            // Y establecemos que la duracion del token sea 1 hora
            { expiresIn: "1h" }
        );

        // Aqui le decimos que si ha ido todo bien nos devuelva en un json el mensaje de la creacion del usuario, con el token, el nombre del usuario, el mail y si es administrador
        res.status(201).json({
            message: "Usuario registrado con éxito",
            token,
            name: newUser.username,
            email: newUser.email,
            isAdmin: newUser.isAdmin
        });

    } catch (error) {
        // Si hubiera algun error que nos pase el mensaje
        res.status(500).json({ error: "Error en el servidor", details: error.message });
    }
};