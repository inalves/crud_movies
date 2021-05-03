const jwt = require("jsonwebtoken");
const sk = require("../../config/keys").SECRET_KEY;

const User = require("../../models/User");

module.exports = {
	/**
	 *
	 * @param {any} credentials Credenciales del usuario
	 * @returns True: Usuario autentificado | False: Usuario no autentificado
	 */
	signInUser: async (credentials) => {
		console.log(credentials);
		try {
			const user = await User.find({
				username: credentials.username,
				password: credentials.password,
			});

			if (user.length) {
				return { success: true, user };
			} else {
				return {
					success: false,
					message: `Usuario y/o contraseña incorrectos`,
				};
			}

		} catch (err) {
			return {
				success: false,
				message: `Hubo un error: ${err}`,
			};
		}
	},

	/**
	 * @summary Genera un token de acceso
	 * @returns Token del usuario
	 */
	generateUserToken: (user) => {
		return jwt.sign({ user }, sk, { expiresIn: "5m" });
	},

	/**
	 * @summary Validar un token
	 */
	validateToken: (req, res, next) => {
		const accessToken = req.headers["authorization"];
		if (!accessToken)
			res.status(403).json({ message: "Acceso no autorizado" });

		jwt.verify(accessToken, sk, (err) => {
			if (err) {
				res.status(403).json({ message: "Inicio de sesion expirado" });
			} else {
				next();
			}
		});
	},
};
