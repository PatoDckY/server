const express = require("express");
const DispositivoUsuario = require("../model/DispositivoUsuario");
const router = express.Router();

// 📌 Agregar un producto a la lista del usuario
router.post("/agregar", async (req, res) => {
    const { usuario_id, producto_id } = req.body;

    try {
        let usuario = await DispositivoUsuario.findById(usuario_id);

        if (!usuario) {
            // Si no existe, creamos un nuevo documento para el usuario
            usuario = new DispositivoUsuario({
                _id: usuario_id,
                dispositivos: [{ producto_id }]
            });
        } else {
            // Verificar si el producto ya está agregado
            const existe = usuario.dispositivos.some(d => d.producto_id.equals(producto_id) && d.estado === "activo");

            if (existe) {
                return res.status(400).json({ message: "El producto ya está agregado" });
            }

            // Agregar el producto al array
            usuario.dispositivos.push({ producto_id });
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
    try {
        const usuario = await DispositivoUsuario.findById(req.params.usuario_id).populate("dispositivos.producto_id");

        if (!usuario) return res.json([]);

        res.json(usuario.dispositivos.filter(d => d.estado === "activo"));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener productos" });
    }
});

// 📌 Eliminar un producto de la lista del usuario
router.delete("/eliminar/:usuario_id/:producto_id", async (req, res) => {
    try {
        const { usuario_id, producto_id } = req.params;

        await DispositivoUsuario.updateOne(
            { _id: usuario_id, "dispositivos.producto_id": producto_id },
            { $set: { "dispositivos.$.estado": "eliminado" } }
        );

        res.json({ message: "Producto eliminado con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar producto" });
    }
});

module.exports = router;
