import { Icon, Typography } from "@material-ui/core"

const TopNavbar = () => {
	return (
		<nav className="navbar navbar-dark bg-dark fixed-top">
			<div className="container-fluid">
				<span className="navbar-brand mb-0 h1">CRUD Peliculas</span>
				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
					<Icon>menu</Icon>
				</button>
				<div className="collapse navbar-collapse" id="navbarNavAltMarkup">
					<ul className="nav navbar-nav nav-pills">
						<li className="nav-item">
							<a href="#" className="nav-link active"><Typography>Inicio</Typography></a>
						</li>
						<li className="nav-item">
							{/* <a href="#" className="nav-link text-white"><Typography>Usuarios</Typography></a> */}
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default TopNavbar;
