const express = require("express");
const router = express.Router();

const Movie = require("../../models/Movie");

/**
 * @summary: Obtener todas las peliculas
 */
router.get("/", async (req, res) => {
  const movies = await Movie.find();
  res.json(movies);
});

/**
 * @summary: Obtener una pelicula
 */
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.json(movie);
  } catch (err) {
    res
      .status(404)
      .json({ success: false, message: `Pelicula no encontrada: ${err}` });
  }
});

/**
 * @summary: Agregar una pelicula
 */
router.post("/", async (req, res) => {
  console.log(req.body)
  const newMovie = new Movie({
    title: req.body.title.trim(),
    country: req.body.country.trim(),
    year: req.body.year.trim(),
    cover: req.body.cover.trim(),
    trailer: req.body.trailer.trim()
  });

  const movie = await newMovie.save();
  res.json(movie);
});

/**
 * @summary: Borrar una pelicula
 */
router.delete("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    await movie.remove();
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500).json({ success: false, message: err });
  }
});

/**
 * @summary: Modificar una pelicula
 */
router.put("/:id", async (req, res) => {
  try {
    console.log(req.params)
    const movie = await Movie.findById(req.params.id);
    Object.assign(movie, req.body);
    movie.save();
    console.log(movie)
    res.sendStatus(200)
  } catch (err) {
    res.status(500).json({ success: false, message: `Hubo un error: ${err}` });
  }
});

module.exports = router;
