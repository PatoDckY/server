const express = require('express');
const Producto = require('../model/Producto');
const router = express.Router();

// Ruta para obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para obtener productos de la categoría "Alimentos"
router.get("/alimento", async (req, res) => {
  try {
    const productos = await Producto.find({ categoria: "Alimento" });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para obtener productos de la categoría "Dispositivos"
router.get("/dispositivos", async (req, res) => {
  try {
    const productos = await Producto.find({ categoria: "Dispositivos" });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para obtener productos de la categoría "Decoraciones"
router.get("/decoracion", async (req, res) => {
  try {
    const productos = await Producto.find({ categoria: "Decoracion" });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para obtener productos de la categoría "Acuarios"
router.get("/acuarios", async (req, res) => {
  try {
    const productos = await Producto.find({ categoria: "Acuarios" });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para obtener productos de la categoría "Equipamiento"
router.get("/equipamiento", async (req, res) => {
  try {
    const productos = await Producto.find({ categoria: "Equipamiento" });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para obtener productos de la categoría "Sustrato"
router.get("/sustrato", async (req, res) => {
  try {
    const productos = await Producto.find({ categoria: "Sustrato" });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para obtener productos de la categoría "Iluminacion"
router.get("/iluminacion", async (req, res) => {
  try {
    const productos = await Producto.find({ categoria: "Iluminacion" });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para obtener productos de la categoría "Accesorios"
router.get("/accesorios", async (req, res) => {
  try {
    const productos = await Producto.find({ categoria: "Accesorios" });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para obtener productos de la categoría "Mantenimiento"
router.get("/mantenimiento", async (req, res) => {
  try {
    const productos = await Producto.find({ categoria: "Mantenimiento" });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para obtener productos de la categoría "Tratamiento"
router.get("/tratamiento", async (req, res) => {
  try {
    const productos = await Producto.find({ categoria: "Tratamiento" });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para obtener un producto por su ID
router.get("/:id", async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para actualizar un producto por su ID
router.put("/:id", async (req, res) => {
  try {
    const productoActualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!productoActualizado) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(productoActualizado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para eliminar un producto por su ID
router.delete("/:id", async (req, res) => {
  try {
    const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
    if (!productoEliminado) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para agregar un nuevo producto
router.post("/", async (req, res) => {
  try {
    const { nombre, categoria, descripcion, precio, stock, imagen } = req.body;
    const nuevoProducto = new Producto({
      nombre,
      categoria,
      descripcion,
      precio,
      stock,
      imagen,
    });

    const productoGuardado = await nuevoProducto.save();
    res.status(201).json(productoGuardado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
