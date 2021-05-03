import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, Icon } from "@material-ui/core"
import { useState } from 'react'

const MovieCard = ({ renderMovie, onTrailerPlay, handleMovieDeleted, accessToken, handleEdit }) => {
	const [openConfirm, setOpenConfirm] = useState(false)
	const [deleteMovie, setdeleteMovie] = useState({})

	const handleOpenConfirm = (movie) => {
		setdeleteMovie(movie)
		setOpenConfirm(true)
	}

	const handleCloseConfirm = () => {
		setOpenConfirm(false)
	}

	const handleDelete = async (id) => {

		try {
			const response = await fetch(`http://localhost:5000/api/movies/${id}`,
				{
					method: "DELETE",
					headers: { Authorization: localStorage.getItem('accessToken') }
				});

			if (response.ok) {
				setOpenConfirm(false)
				handleMovieDeleted(id)
			}
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<div className="card m-3 border-0 bg-transparent" style={{ width: "180px" }}>

			<img src={renderMovie.cover} className="w-100" alt="" style={{ height: "255px", objectFit: "cover" }} onClick={() => onTrailerPlay(renderMovie.trailer)} />
			<div className="card-body text-white px-0">
				<h5 className="card-title" style={{ minHeight: "80px" }}>{renderMovie.title}</h5>
				<div className="card-text">
					<div className="d-flex justify-content-between">
						<span>{renderMovie.country}</span>
						<small className="text-muted">{renderMovie.year}</small>
					</div>

					<div className="d-flex justify-content-around mt-3">
						<Fab title="Borrar" onClick={() => handleOpenConfirm(renderMovie)} size="small" style={{ backgroundColor: "#c62828" }}><Icon style={{ color: "#fff" }}>delete</Icon></Fab>
						<Fab title="Editar" onClick={() => handleEdit(renderMovie)} size="small"><Icon>edit</Icon></Fab>
					</div>
				</div>
			</div>
			<Dialog open={openConfirm} onClose={handleCloseConfirm}>
				<DialogTitle>{`¿Eliminar ${deleteMovie.title}?`}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Esta acción es irreversible
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseConfirm} color="secondary" startIcon={<Icon>cancel</Icon>}>No</Button>
					<Button onClick={() => handleDelete(deleteMovie._id)} color="primary" startIcon={<Icon>check</Icon>}>Si</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

MovieCard.defaultProps = {
	renderMovie: {
		title: "no encontrado",
	},
};

export default MovieCard;
