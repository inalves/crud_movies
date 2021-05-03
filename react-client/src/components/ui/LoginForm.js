import { Paper, TextField, Button, Icon } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { useState } from 'react'

const LoginForm = () => {
	const [credentialsState, setCredentialsState] = useState({ username: "", password: "" })
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();


	const logInSubmit = async () => {
		debugger
		const response = await fetch(
			"http://localhost:5000/user/auth",
			{
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(credentialsState)
			}
		);

		if (response.ok) {
			const login = await response.json();
			if (login.success) {
				//AGREGAR EL TOKEN AL LOCAL STORANGE
				localStorage.setItem('accessToken', login.token)
				console.log(localStorage.getItem('accessToken'));
				window.location = '/'
			} else {
				localStorage.clear();
			}
		} else {
			alert(`Hubo un error ${response}`);
		}
	};

	const handleOnChangeValidation = (e) => {
		setCredentialsState({ ...credentialsState, [e.target.name]: e.target.value })
		console.log(credentialsState);
	};

	return (
		<div className="row">
			<Paper className="card rounded border-0 col-11 col-md-6 col-lg-3 mx-auto mt-5">

				<form onSubmit={logInSubmit}>
					<div className="card-body d-flex flex-column">
						<h5 className="card-title my-5">Iniciar sesión</h5>

						<div className="mb-3">
							<label className="form-label" for="txt_title">Usuario</label>
							<input type="text" name="username" className="form-control" id="txt_title" onChange={handleOnChangeValidation}></input>
							<div id="title_help" className="invalid-feedback">Usuario es requerido</div>
						</div>
						<div className="mb-3">
							<label className="form-label" for="txt_title">Contraseña</label>
							<input type="password" name="password" className="form-control" id="txt_title" onChange={handleOnChangeValidation}></input>
							<div id="title_help" className="invalid-feedback">COntraseña es requerida</div>
						</div>
						<Button type="submit" color="primary" variant="contained" startIcon={<Icon>login</Icon>}>
							Entrar
						</Button>
					</div>
				</form>

			</Paper>
		</div>
	);
};

export default LoginForm;
