const express = require("express");
const mongoose = require("mongoose");
const authenticator = require("./routes/api/Authentication");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const sd = require('./config/keys').SERVER_DOMAIN

//SERVER
const app = express();
app.use(
	cors({
		origin: "*",
	})
);
app.use(
	fileUpload({
		createParentPath: true,
	})
);

// ROUTES
const movies = require("./routes/api/Movies");
const users = require("./routes/api/Users");

// MIDDLEWARES
app.use(express.json());
app.use(express.static('public'));
app.use("/api/movies", movies);
app.use("/api/users", users);

// DATABASES
const db = require("./config/keys").mongoURI;
mongoose
	.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => "DB Connected")
	.catch((err) => console.log(err));

// ENDPOINTS
/**
 * @summary: Obtener un token
 */
app.post("/user/auth", async (req, res) => {
	const authenticated = await authenticator.signInUser(req.body);
	console.log(req.body);
	console.log(authenticated);

	if (!authenticated.success) {
		res.json({
			message: authenticated.message,
			success: false,
			token: null,
		});
	} else {
		const accessToken = authenticator.generateUserToken(req.body.user);

		res.header("authorization", accessToken);
		res.json({
			message: "Usuario autenticado",
			success: true,
			token: accessToken,
		});
	}
});

/**
 * @summary Subir la portada al servidor
 */
app.post("/cover", async (req, res) => {
	try {
		if (!req.files) {
			res.send({
				uploaded: false,
				location: null,
			});
		} else {
			const { cover } = req.files;

			cover.mv(`./public/covers/${cover.name}`);

			res.send({
				uploaded: true,
				location: `${sd}/covers/${cover.name}`,
			});
		}
	} catch (e) {
		res.status.length(500).send(e);
	}
});

app.listen(5000, () => {
	console.log("Server started aut port 5000");
});