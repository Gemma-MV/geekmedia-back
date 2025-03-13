// Importamos jwt, es un paquete para trabajar con jsonwebtoken (JSON Web Tokens), los tokens son una forma segura de identificar a los usuarios cambiando sus datos por un codigo largo
import jwt from "jsonwebtoken";

// Creamos la funcion exportable verifyToken para verificar si un usuario tiene un token válido. El parametro next nos permite pasar el control a la siguiente función si todo está bien
export const verifyToken = (req, res, next) => {
    // Guardamos en la constante token el token que el usuario envió en la cabecera llamada "authorization" de su petición
    const token = req.headers["authorization"];
    // Si no existe el token retornamos un error 401 al usuario, indicando que no tiene permiso para continuar porque falta el token
    if (!token) return res.status(401).json({ error: "Acceso denegado, token requerido" });

    try {
        // Guardamos en la variable decoded la verificacion jwt.verify para saber si el token es valido; con token.split(" ")[1] separamos la cadena "Bearer [token]" y tomamos solo el valor del token y si el token es válido, jwt.verify nos devuelve los datos del usuario que están dentro del token (decodificados)
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        // En req.user guardamos los datos del usuario (decodificados del token) para que otras partes del código puedan acceder a ellos
        req.user = decoded;
        // Si todo está bien, llamamos a next(), lo que permite que la petición continúe hacia el siguiente paso
        next();
    } catch (error) {
        // Si el token no es valido nos dara el siguiente error
        res.status(403).json({ error: "Token inválido" });
    }
};

// Creamos la funcion exportable isAdmin que comprueba si el usuario tiene privilegios de administrador
export const isAdmin = (req, res, next) => {
    // Verificamos si req.user no existe (es decir, el usuario no está autenticado) o si req.user.isAdmin es falso (el usuario no es administrador)
    if (!req.user || !req.user.isAdmin) {
        // Y si es asi enviamos un error 403 indicando que se necesita ser administrador para acceder
        return res.status(403).json({ error: "Acceso denegado, se requiere rol de administrador" });
    }
    // Si el usuario es administrador, permitimos que la petición continúe con next()
    next();
};