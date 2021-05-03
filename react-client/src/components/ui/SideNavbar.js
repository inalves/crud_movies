
const SideNavbar = () => {
    return (
        <>
			<div className="d-flex flex-column p-3 text-white bg-dark sticky-top" style={{ width: "280px", height:"100vh" }}>
				<a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
					<span className="fs-4">CRUD Películas</span>
				</a>
				<hr />
				<ul className="nav nav-pills flex-column mb-auto">
					<li className="nav-item">
						<a href="#" className="nav-link active">Inicio</a>
					</li>
					{/* <li>
						<a href="#" className="nav-link text-white">Usuarios</a>
					</li> */}
				</ul>
			</div>
		</>
    )
}

export default SideNavbar
