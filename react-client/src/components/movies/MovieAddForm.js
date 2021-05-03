import {
	Button,
	DialogContent,
	Icon,
	Dialog,
	DialogTitle,
	DialogActions,
	Typography,
	DialogContentText,
	Fab,
} from "@material-ui/core";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	formControl: {
		width: "350px",
		marginBottom: "15px",
		[theme.breakpoints.down("sm")]: {
			width: "100%",
		},
	},
}));

const MovieAddForm = ({ onMovieAdded }) => {
	const [open, setOpen] = useState(false);
	const [imageSrc, setImageSrc] = useState();
	const [coverFile, setCoverFile] = useState();
	const [hasImage, sethasImage] = useState(false)
	const [saveBtnDisabled, setSaveBtnDisabled] = useState(true)
	const [fileHelperText, setFileHelperText] = useState("")
	const [formDataState, setFormDataState] = useState({
		title: "",
		country: "",
		year: "",
		trailer: "",
		cover: ""
	})

	const {
		reset,
	} = useForm();

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setImageSrc();
		reset();
		sethasImage(false);
		setSaveBtnDisabled(true)
	};

	const handleImageSelect = (e) => {

		if (e.target.files[0].type === "image/jpeg") {
			if (e.target.files.length) {
				setImageSrc(URL.createObjectURL(e.target.files[0]));
				setCoverFile(e.target.files[0]);
				sethasImage(true)
				e.target.classList.add("is-valid")
				e.target.classList.remove("is-invalid")
			} else {
				sethasImage(false)
				e.target.classList.remove("is-valid")
				e.target.classList.add("is-invalid")
			}
			document.querySelectorAll(".is-valid").length < document.getElementsByTagName("input").length ? setSaveBtnDisabled(true) : setSaveBtnDisabled(false)
		} else {
			handleRemoveCover()
			e.target.classList.remove("is-valid")
			setFileHelperText("El archivo debe ser .jpg/.jpeg")
			setSaveBtnDisabled(true)
		}
	};

	const handleRemoveCover = () => {
		const inputFile = document.getElementById("file_cover")
		inputFile.value = "";
		sethasImage(false)
		setImageSrc()
		setFileHelperText("La portada es requerida")
		inputFile.classList.add("is-invalid")
		inputFile.classList.remove("is-valid")
		setSaveBtnDisabled(true)
	}

	const handleOnChangeValidation = (e) => {
		setFormDataState({ ...formDataState, [e.target.name]: e.target.value })

		switch (e.target.getAttribute("id")) {
			case "txt_year":
				if (/^(18|19|20)\d{2}$/.test(e.target.value)) {
					e.target.classList.add("is-valid");
					e.target.classList.remove("is-invalid");
				} else {
					e.target.classList.add("is-invalid");
					e.target.classList.remove("is-valid");
				}
				break;
			case "txt_trailer":
				if (/^https:\/\/www.youtube.com\/watch\?v\=/.test(e.target.value)) {
					e.target.classList.add("is-valid");
					e.target.classList.remove("is-invalid");
				} else {
					e.target.classList.add("is-invalid");
					e.target.classList.remove("is-valid");
				}
				break;
			case "txt_country":
				if (/[A-Za-z]/.test(e.target.value)) {
					e.target.classList.add("is-valid");
					e.target.classList.remove("is-invalid");
				} else {
					e.target.classList.add("is-invalid");
					e.target.classList.remove("is-valid");
				}
				document.querySelectorAll(".is-valid").length < document.getElementsByTagName("input").length ? setSaveBtnDisabled(true) : setSaveBtnDisabled(false)

				return;
		}

		if (e.target.getAttribute("type") == "text") {
			if (e.target.value === "") {
				e.target.classList.add("is-invalid");
				e.target.classList.remove("is-valid");
			} else {
				e.target.classList.add("is-valid");
				e.target.classList.remove("is-invalid");
			}
		}
		document.querySelectorAll(".is-valid").length < document.getElementsByTagName("input").length ? setSaveBtnDisabled(true) : setSaveBtnDisabled(false)
	}


	const newMovieSubmit = async (e) => {
		e.preventDefault()
		const formData = new FormData();

		//SUBIR LA FOTO AL SERVIDOR
		formData.append("cover", coverFile);
		const coverRes = await fetch("http://localhost:5000/cover", {
			method: "POST",
			body: formData,
			headers: { Authorization: localStorage.getItem('accessToken') }
		});

		const coverSrc = await coverRes.json();
		if (coverSrc.uploaded) {

			formDataState.cover = coverSrc.location
			const response = await fetch(
				"http://localhost:5000/api/movies",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: localStorage.getItem('accessToken')
					},
					body: JSON.stringify(formDataState)
				}
			);

			if (response.ok) {
				const movieAdded = await response.json();
				//ACTUALIZAR LA LISTA DE PELICULAS
				onMovieAdded(movieAdded);
				handleClose();
			} else {
				alert(`Hubo un error ${response}`);
			}
		} else {
			//ELIMINAR FOTO QUE SE SUBIO
		}
	};

	return (
		<>
			<div className="container-fluid sticky-top pb-3 d-flex justify-content-between" style={{ backgroundColor: "#31373d" }}>
				<Button startIcon={<Icon>add</Icon>} color="primary" onClick={handleClickOpen} variant="contained">
					Agregar película
				</Button>
			</div>

			<Dialog open={open} maxWidth="lg" onClose={handleClose} scroll="paper" >
				<DialogTitle>
					<Typography variant="h4">Agregar película</Typography>
				</DialogTitle>
				<form onSubmit={newMovieSubmit} id="form_movie">
					<DialogContent dividers>
						<DialogContentText>
							<div className="d-flex justify-content-md-around flex-column flex-md-row">
								<div className="d-flex flex-column m-5">
									<div className="mb-3">
										<label className="form-label" for="txt_title">Título</label>
										<input type="text" name="title" className="form-control" id="txt_title" onChange={handleOnChangeValidation}></input>
										<div id="title_help" className="invalid-feedback">Título es requerido</div>
									</div>
									<div className="mb-3">
										<label className="form-label" for="txt_country">País</label>
										<input type="text" list="countries" name="country" className="form-control" id="txt_country" onChange={handleOnChangeValidation}></input>
										<div id="country_help"  className="invalid-feedback">País es requerido</div>
										<datalist id="countries">
											<option value="Afghanistan" />
											<option value="Albania" />
											<option value="Algeria" />
											<option value="American Samoa" />
											<option value="Andorra" />
											<option value="Angola" />
											<option value="Anguilla" />
											<option value="Antarctica" />
											<option value="Antigua and Barbuda" />
											<option value="Argentina" />
											<option value="Armenia" />
											<option value="Aruba" />
											<option value="Australia" />
											<option value="Austria" />
											<option value="Azerbaijan" />
											<option value="Bahamas" />
											<option value="Bahrain" />
											<option value="Bangladesh" />
											<option value="Barbados" />
											<option value="Belarus" />
											<option value="Belgium" />
											<option value="Belize" />
											<option value="Benin" />
											<option value="Bermuda" />
											<option value="Bhutan" />
											<option value="Bolivia" />
											<option value="Bosnia and Herzegovina" />
											<option value="Botswana" />
											<option value="Bouvet Island" />
											<option value="Brazil" />
											<option value="British Indian Ocean Territory" />
											<option value="Brunei Darussalam" />
											<option value="Bulgaria" />
											<option value="Burkina Faso" />
											<option value="Burundi" />
											<option value="Cambodia" />
											<option value="Cameroon" />
											<option value="Canada" />
											<option value="Cape Verde" />
											<option value="Cayman Islands" />
											<option value="Central African Republic" />
											<option value="Chad" />
											<option value="Chile" />
											<option value="China" />
											<option value="Christmas Island" />
											<option value="Cocos (Keeling) Islands" />
											<option value="Colombia" />
											<option value="Comoros" />
											<option value="Congo" />
											<option value="Congo, The Democratic Republic of The" />
											<option value="Cook Islands" />
											<option value="Costa Rica" />
											<option value="Cote D'ivoire" />
											<option value="Croatia" />
											<option value="Cuba" />
											<option value="Cyprus" />
											<option value="Czech Republic" />
											<option value="Denmark" />
											<option value="Djibouti" />
											<option value="Dominica" />
											<option value="Dominican Republic" />
											<option value="Ecuador" />
											<option value="Egypt" />
											<option value="El Salvador" />
											<option value="Equatorial Guinea" />
											<option value="Eritrea" />
											<option value="Estonia" />
											<option value="Ethiopia" />
											<option value="Falkland Islands (Malvinas)" />
											<option value="Faroe Islands" />
											<option value="Fiji" />
											<option value="Finland" />
											<option value="France" />
											<option value="French Guiana" />
											<option value="French Polynesia" />
											<option value="French Southern Territories" />
											<option value="Gabon" />
											<option value="Gambia" />
											<option value="Georgia" />
											<option value="Germany" />
											<option value="Ghana" />
											<option value="Gibraltar" />
											<option value="Greece" />
											<option value="Greenland" />
											<option value="Grenada" />
											<option value="Guadeloupe" />
											<option value="Guam" />
											<option value="Guatemala" />
											<option value="Guinea" />
											<option value="Guinea-bissau" />
											<option value="Guyana" />
											<option value="Haiti" />
											<option value="Heard Island and Mcdonald Islands" />
											<option value="Holy See (Vatican City State)" />
											<option value="Honduras" />
											<option value="Hong Kong" />
											<option value="Hungary" />
											<option value="Iceland" />
											<option value="India" />
											<option value="Indonesia" />
											<option value="Iran, Islamic Republic of" />
											<option value="Iraq" />
											<option value="Ireland" />
											<option value="Israel" />
											<option value="Italy" />
											<option value="Jamaica" />
											<option value="Japan" />
											<option value="Jordan" />
											<option value="Kazakhstan" />
											<option value="Kenya" />
											<option value="Kiribati" />
											<option value="Korea, Democratic People's Republic of" />
											<option value="Korea, Republic of" />
											<option value="Kuwait" />
											<option value="Kyrgyzstan" />
											<option value="Lao People's Democratic Republic" />
											<option value="Latvia" />
											<option value="Lebanon" />
											<option value="Lesotho" />
											<option value="Liberia" />
											<option value="Libyan Arab Jamahiriya" />
											<option value="Liechtenstein" />
											<option value="Lithuania" />
											<option value="Luxembourg" />
											<option value="Macao" />
											<option value="Macedonia, The Former Yugoslav Republic of" />
											<option value="Madagascar" />
											<option value="Malawi" />
											<option value="Malaysia" />
											<option value="Maldives" />
											<option value="Mali" />
											<option value="Malta" />
											<option value="Marshall Islands" />
											<option value="Martinique" />
											<option value="Mauritania" />
											<option value="Mauritius" />
											<option value="Mayotte" />
											<option value="Mexico" />
											<option value="Micronesia, Federated States of" />
											<option value="Moldova, Republic of" />
											<option value="Monaco" />
											<option value="Mongolia" />
											<option value="Montserrat" />
											<option value="Morocco" />
											<option value="Mozambique" />
											<option value="Myanmar" />
											<option value="Namibia" />
											<option value="Nauru" />
											<option value="Nepal" />
											<option value="Netherlands" />
											<option value="Netherlands Antilles" />
											<option value="New Caledonia" />
											<option value="New Zealand" />
											<option value="Nicaragua" />
											<option value="Niger" />
											<option value="Nigeria" />
											<option value="Niue" />
											<option value="Norfolk Island" />
											<option value="Northern Mariana Islands" />
											<option value="Norway" />
											<option value="Oman" />
											<option value="Pakistan" />
											<option value="Palau" />
											<option value="Palestinian Territory, Occupied" />
											<option value="Panama" />
											<option value="Papua New Guinea" />
											<option value="Paraguay" />
											<option value="Peru" />
											<option value="Philippines" />
											<option value="Pitcairn" />
											<option value="Poland" />
											<option value="Portugal" />
											<option value="Puerto Rico" />
											<option value="Qatar" />
											<option value="Reunion" />
											<option value="Romania" />
											<option value="Russian Federation" />
											<option value="Rwanda" />
											<option value="Saint Helena" />
											<option value="Saint Kitts and Nevis" />
											<option value="Saint Lucia" />
											<option value="Saint Pierre and Miquelon" />
											<option value="Saint Vincent and The Grenadines" />
											<option value="Samoa" />
											<option value="San Marino" />
											<option value="Sao Tome and Principe" />
											<option value="Saudi Arabia" />
											<option value="Senegal" />
											<option value="Serbia and Montenegro" />
											<option value="Seychelles" />
											<option value="Sierra Leone" />
											<option value="Singapore" />
											<option value="Slovakia" />
											<option value="Slovenia" />
											<option value="Solomon Islands" />
											<option value="Somalia" />
											<option value="South Africa" />
											<option value="South Georgia and The South Sandwich Islands" />
											<option value="Spain" />
											<option value="Sri Lanka" />
											<option value="Sudan" />
											<option value="Suriname" />
											<option value="Svalbard and Jan Mayen" />
											<option value="Swaziland" />
											<option value="Sweden" />
											<option value="Switzerland" />
											<option value="Syrian Arab Republic" />
											<option value="Taiwan, Province of China" />
											<option value="Tajikistan" />
											<option value="Tanzania, United Republic of" />
											<option value="Thailand" />
											<option value="Timor-leste" />
											<option value="Togo" />
											<option value="Tokelau" />
											<option value="Tonga" />
											<option value="Trinidad and Tobago" />
											<option value="Tunisia" />
											<option value="Turkey" />
											<option value="Turkmenistan" />
											<option value="Turks and Caicos Islands" />
											<option value="Tuvalu" />
											<option value="Uganda" />
											<option value="Ukraine" />
											<option value="United Arab Emirates" />
											<option value="United Kingdom" />
											<option value="United States" />
											<option value="United States Minor Outlying Islands" />
											<option value="Uruguay" />
											<option value="Uzbekistan" />
											<option value="Vanuatu" />
											<option value="Venezuela" />
											<option value="Viet Nam" />
											<option value="Virgin Islands, British" />
											<option value="Virgin Islands, U.S" />
											<option value="Wallis and Futuna" />
											<option value="Western Sahara" />
											<option value="Yemen" />
											<option value="Zambia" />
											<option value="Zimbabwe" />
										</datalist>
									</div>
									<div className="mb-3">
										<label className="form-label" for="txt_year">Año (1800  2099)</label>
										<input name="year" className="form-control" id="txt_year" onChange={handleOnChangeValidation}></input>
										<div id="year_help" className="invalid-feedback">Año es requerido</div>
									</div>
									<div className="mb-3">
										<label className="form-label" for="txt_trailer">Trailer de YouTube</label>
										<input name="trailer" className="form-control" id="txt_trailer" onChange={handleOnChangeValidation}></input>
										<div id="trailer_help" className="invalid-feedback">El trailer de YouTube es requerido</div>
									</div>
									<div className="mb-3">
										<label for="formFile" className="form-label">
											Foto de portada
										</label>
										<input name="cover" type="file" id="file_cover" className="form-control" onChange={handleImageSelect} />
										<div className="invalid-feedback">{fileHelperText}</div>
										<div className="valid-feedback">Archivo válido</div>
									</div>
								</div>
								<div className="d-flex flex-column my-3 mx-5 align-items-center">
									<b className="mb-2">Portada</b>
									<div className="bg-secondary" style={imageSrc ? { width: "350px" } : { width: "350px", height: "495px" }}>
										<img src={imageSrc} style={imageSrc ? { width: "100%", display: "block" } : { display: "none" }} alt="" />
									</div>
									<Fab className="mt-3" title="Quitar portada" onClick={handleRemoveCover} size="small" style={hasImage ? { backgroundColor: "#424242" } : { display: "none" }}><Icon style={{ color: "#fff" }}>undo</Icon></Fab>
								</div>
							</div>
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose} color="secondary" startIcon={<Icon>close</Icon>}>
							Cancelar
						</Button>
						<Button type="submit" color="primary" disabled={saveBtnDisabled} startIcon={<Icon>save</Icon>}>
							Guardar
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		</>
	);
};

export default MovieAddForm;
