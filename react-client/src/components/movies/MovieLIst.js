import MovieCard from "./MovieCard";
import {
	Card,
	CardContent,
	Typography,
} from "@material-ui/core";

const MovieList = ({ renderMovies, onTrailerPlay, handleMovieDeleted, handleEdit }) => {

	if (renderMovies.length) {
		return (
			<div className="row row-cols-2 row-cols-md-3 row-cols-lg-5">
				{renderMovies.map((movie) => {
					return (
						<div className="col" key={movie._id}>
							<MovieCard
								onTrailerPlay={onTrailerPlay}
								renderMovie={movie}
								handleEdit={handleEdit}
								handleMovieDeleted={handleMovieDeleted}
							/>
						</div>
					);
				})}
			</div>
		);
	} else {
		return (
			<Card>
				<CardContent>
					<Typography>No hay peliculas</Typography>
				</CardContent>
			</Card>
		);
	}
};

export default MovieList;
