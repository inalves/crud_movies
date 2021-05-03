import { Dialog } from "@material-ui/core";
import MovieAddForm from "./components/movies/MovieAddForm";
import MovieEditForm from './components/movies/MovieEditForm'
import MovieList from "./components/movies/MovieLIst";
import LoginForm from "./components/ui/LoginForm";
import { useEffect, useState } from "react";
import TopNavbar from "./components/ui/TopNavbar";
import YouTube from "react-youtube";
import getYoutubeId from "get-youtube-id"
import SideNavbar from "./components/ui/SideNavbar";
import {BrowserRouter as Router, Route, Switch} from 'react-router'

function App() {
	const [movies, setMovies] = useState([]);
	const [editMovie, setEditMovie] = useState()
	const [openEdit, setOpenEdit] = useState(false)
	const [isLogged, setIsLogged] = useState(false)

	const getMovies = async () => {
		console.log(localStorage.getItem('accessToken'))
		const response = await fetch(
			"http://localhost:5000/api/movies",
			{ method: "GET", headers: { Authorization: localStorage.getItem('accessToken') } }
		);

		if (response.ok) {
			if(response.status === 403){
				setIsLogged(false)
				return
			}
			setIsLogged(true)
			const data = await response.json();
			console.log(data)
			setMovies(data);
		}
	};

	useEffect(() => { getMovies(); }, []);

	
	const handleMovieAdded = (newMovie) => {
		setMovies([...movies, newMovie])
	}

	const handleMovieDeleted = (id) => {
		setMovies(movies.filter(movie => movie._id !== id))
	}

	const handleEdit = (movie) => {
		setEditMovie(movie)
		setOpenEdit(true)
	}

	const handleCloseEdit = () => {
		setOpenEdit(false)
	}

	const [open, setOpen] = useState(false)
	const [trailerId, setTrailerId] = useState("");

	const handleTrailerPlay = (e) => {
		console.log(e)
		setTrailerId(getYoutubeId(e))
		handleOpen()
	};

	const handleClose = () => {
		setOpen(false)
	}

	const handleOpen = () => {
		setOpen(true)
	}

	if (true) {
	return (
		<div className="d-flex" style={{ backgroundColor: "#31373d" }}>
			<div className="d-block d-md-none">
				<TopNavbar />
			</div>
			<div className="d-none d-md-block">
				<SideNavbar />
			</div>
			<div className="container-fluid mt-5 mt-md-3">
				<MovieAddForm onMovieAdded={(newMovie) => handleMovieAdded(newMovie)} />
				<MovieEditForm onEditMovie={getMovies} setEditMovie={setEditMovie} editMovie={editMovie} openEdit={openEdit} closeEdit={handleCloseEdit} />
				<MovieList handleEdit={handleEdit} renderMovies={movies} onTrailerPlay={id => handleTrailerPlay(id)} handleMovieDeleted={id => handleMovieDeleted(id)}></MovieList>
			</div>

			<Dialog open={open} maxWidth="lg" onClose={handleClose}>
				<YouTube className="m-3" videoId={trailerId} opts={{ width: "720px", height: "480px", playerVars: { autoplay: 1 } }} ></YouTube>
			</Dialog>
		</div>

	);
	} else {
		return (
			<LoginForm />
		);
	}
}

export default App;
