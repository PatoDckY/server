const express = require("express");
const mongoose = require("mongoose");
const DispositivoUsuario = require("../model/DispositivoUsuario");
const router = express.Router();

// 📌 Agregar un producto a la lista del usuario
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
// 📌 Eliminar un producto de la lista del usuario
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
        const usuario = await DispositivoUsuario.findOne({ usuario_id });

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Buscar el dispositivo en el array y actualizar su estado
        const dispositivo = usuario.dispositivos.find(d => d.producto_id.equals(producto_id));

        if (!dispositivo) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        dispositivo.estado = "eliminado"; // Marcar como eliminado
        await usuario.save();

        res.json({ message: "Producto eliminado con éxito" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar producto" });
    }
});
// 📌 Actualizar nombre e IP de un dispositivo (modificado)
router.put("/actualizar/:usuario_id/:producto_id", async (req, res) => {
    const { usuario_id, producto_id } = req.params;
    const { nombre, ip } = req.body;

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(usuario_id)) {
        return res.status(400).json({ message: "ID de usuario no válido" });
    }
    if (!mongoose.Types.ObjectId.isValid(producto_id)) {
        return res.status(400).json({ message: "ID de producto no válido" });
    }

    try {
        const usuario = await DispositivoUsuario.findOne({ usuario_id });

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Buscar el dispositivo en el array y actualizar nombre e ip
        const dispositivo = usuario.dispositivos.find(d => d.producto_id.equals(producto_id));

        if (!dispositivo) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        // Actualizar los campos nombre e ip solo si se proporcionan
        if (nombre) dispositivo.nombre = nombre;
        if (ip) dispositivo.ip = ip;

        await usuario.save();
        res.json({ message: "Producto actualizado con éxito" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar producto" });
    }
});

// 📌 Actualizar nombre e IP de un dispositivo
router.put("/actualizar/:producto_id", async (req, res) => {
    const { producto_id } = req.params;
    const { nombre, ip } = req.body;

    if (!mongoose.Types.ObjectId.isValid(producto_id)) {
        return res.status(400).json({ message: "ID de producto no válido" });
    }

    try {
        // Buscar el usuario que contiene el dispositivo
        const usuario = await DispositivoUsuario.findOne({ "dispositivos.producto_id": producto_id });

        if (!usuario) {
            return res.status(404).json({ message: "Usuario o dispositivo no encontrado" });
        }

        // Buscar el dispositivo en el array
        const dispositivo = usuario.dispositivos.find(d => d.producto_id.equals(producto_id));

        if (!dispositivo) {
            return res.status(404).json({ message: "Dispositivo no encontrado" });
        }

        // Actualizar los campos nombre e ip
        dispositivo.nombre = nombre || dispositivo.nombre;
        dispositivo.ip = ip || dispositivo.ip;

        await usuario.save();
        res.json({ message: "Dispositivo actualizado con éxito" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar dispositivo" });
    }
});

// 📌 Verificar si los campos nombre e ip están llenos o son null
router.get("/verificar-campos/:usuario_id", async (req, res) => {
    const { usuario_id } = req.params;

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(usuario_id)) {
        return res.status(400).json({ message: "ID de usuario no válido" });
    }

    try {
        const usuario = await DispositivoUsuario.findOne({ usuario_id });

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Verificar los campos nombre e ip en cada dispositivo
        const dispositivosConCamposInvalidos = usuario.dispositivos
            .filter(d => d.estado === "activo") // Solo dispositivos activos
            .map(d => ({
                producto_id: d.producto_id,
                nombre: d.nombre,
                ip: d.ip,
                camposInvalidos: {
                    nombre: d.nombre === null || d.nombre === "",
                    ip: d.ip === null || d.ip === ""
                }
            }));

        res.json(dispositivosConCamposInvalidos);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al verificar campos" });
    }
});


module.exports = router;