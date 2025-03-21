const express = require('express');
const Peces = require('../model/Peces'); // Asegúrate de que la ruta al modelo sea correcta
const router = express.Router();

// Ruta para obtener todos los peces
router.get("/", async (req, res) => {
  try {
    const pez = await Peces.find(); // Obtiene todos los peces de la colección
    res.json(pez); // Retorna la lista de todos los peces
  } catch (error) {
    res.status(500).json({ message: error.message }); // Si ocurre un error, muestra el mensaje
  }
});

// Ruta para agregar un nuevo pez
router.post("/peces", async (req, res) => {
  try {
    const nuevoPez = new Pez({
      nombre: req.body.nombre,
      temperatura: req.body.temperatura,
      ph: req.body.ph,
      caracteristicas: req.body.caracteristicas,
      comida: req.body.comida,
      imagen: req.body.imagen
    });

    const pezGuardado = await nuevoPez.save();
    res.status(201).json(pezGuardado); // 201 es el código de estado para creación exitosa
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para editar un pez
router.put("/peces/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const actualizadoPez = await Pez.findByIdAndUpdate(
      id,
      {
        nombre: req.body.nombre,
        temperatura: req.body.temperatura,
        ph: req.body.ph,
        caracteristicas: req.body.caracteristicas,
        comida: req.body.comida,
        imagen: req.body.imagen
      },
      { new: true } // Devuelve el pez actualizado
    );
    
    if (!actualizadoPez) {
      return res.status(404).json({ message: 'Pez no encontrado' });
    }

    res.json(actualizadoPez);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para eliminar un pez
router.delete("/peces/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pezEliminado = await Pez.findByIdAndDelete(id);
    
    if (!pezEliminado) {
      return res.status(404).json({ message: 'Pez no encontrado' });
    }

    res.json({ message: 'Pez eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
