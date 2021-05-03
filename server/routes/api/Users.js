const express = require("express");
const router = express.Router();

const User = require("../../models/User");

/**
 * @summary: Obtener a todos los usuarios desde la base de datos
 */
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

/**
 * @summary: Obtener un usuario
 */
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res
      .status(404)
      .json({ success: false, message: `Usuario no encontrado: ${err}` });
  }
});

/**
 * @summary: Agregar un usuario
 */
router.post("/add", async (req, res) => {
  console.log(req.body)
  const newUser = new User({
    name: req.body.name,
    dateOfBirth: req.body.dateOfBirth,
    country: req.body.country,
    username: req.body.username,
    password: req.body.password
  });

  const user = await newUser.save();
  res.json(user);
});

/**
 * @summary: Borrar un usuario
 */
router.delete("/delete/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.enabled = false
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ success: false, message: err });
  }
});

/**
 * @summary: Modificar un usuario
 */
router.put("/update/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    Object.assign(user, req.body);
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ success: false, message: `Hubo un error: ${err}` });
  }
});

module.exports = router;
