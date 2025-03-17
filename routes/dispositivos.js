const express = require("express");
const mongoose = require("mongoose");
const DispositivoUsuario = require("../model/DispositivoUsuario");
const router = express.Router();

// 📌 Agregar un producto a la lista del usuario
router.post("/agregar", async (req, res) => {
    const { usuario_id, producto_id } = req.body;

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(usuario_id)) {
        return res.status(400).json({ message: "ID de usuario no válido" });
    }
    if (!mongoose.Types.ObjectId.isValid(producto_id)) {
        return res.status(400).json({ message: "ID de producto no válido" });
    }

    try {
        let usuario = await DispositivoUsuario.findOne({ usuario_id });

        if (!usuario) {
            // Si no existe, creamos un nuevo documento para el usuario con el primer dispositivo
            usuario = new DispositivoUsuario({
                usuario_id,
                dispositivos: [{
                    producto_id,
                    estado: "activo",
                    ip: null, // IP vacía
                    nombre: null // Nombre vacío
                }]
            });
        } else {
            // Verificar si el producto ya está agregado y activo
            const existe = usuario.dispositivos.some(d => d.producto_id.equals(producto_id) && d.estado === "activo");

            if (existe) {
                return res.status(400).json({ message: "El producto ya está agregado" });
            }

            // Agregar el producto al array con estado "activo"
            usuario.dispositivos.push({
                producto_id,
                estado: "activo",
                ip: null, // IP vacía
                nombre: null // Nombre vacío
            });
        }

        await usuario.save();
        res.json({ message: "Producto agregado con éxito" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al agregar producto" });
    }
});

// 📌 Obtener todos los productos agregados por un usuario
router.get("/:usuario_id", async (req, res) => {
    const { usuario_id } = req.params;

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(usuario_id)) {
        return res.status(400).json({ message: "ID de usuario no válido" });
    }

    try {
        const usuario = await DispositivoUsuario.findOne({ usuario_id }).populate("dispositivos.producto_id");

        if (!usuario) return res.json([]);

        // Filtrar solo dispositivos activos
        const dispositivosActivos = usuario.dispositivos.filter(d => d.estado === "activo");
        res.json(dispositivosActivos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener productos" });
    }
});

router.delete("/eliminar/:usuario_id/:producto_id", async (req, res) => {
    const { usuario_id, producto_id } = req.params;

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(usuario_id)) {
        return res.status(400).json({ message: "ID de usuario no válido" });
    }
    if (!mongoose.Types.ObjectId.isValid(producto_id)) {
        return res.status(400).json({ message: "ID de producto no válido" });
    }

    try {
        // Usar updateOne con $set y $elemMatch para actualizar el estado del producto específico
        const result = await DispositivoUsuario.updateOne(
            { 
                usuario_id, 
                "dispositivos.producto_id": mongoose.Types.ObjectId(producto_id) 
            },
            { 
                $set: { "dispositivos.$.estado": "eliminado" } 
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Producto no encontrado o ya eliminado" });
        }

        res.json({ message: "Producto eliminado con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar producto" });
    }
});


module.exports = router;
