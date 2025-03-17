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
// 📌 Actualizar nombre e IP de un dispositivo
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

        // Actualizar los campos nombre e ip
        dispositivo.nombre = nombre || dispositivo.nombre; // Si no se pasa un nombre, mantiene el valor actual
        dispositivo.ip = ip || dispositivo.ip; // Lo mismo para la IP

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
// 📌 Obtener detalles de un dispositivo por su ID (para verificar si tiene nombre e IP)
router.get("/detalles/:producto_id", async (req, res) => {
    const { producto_id } = req.params;

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(producto_id)) {
        return res.status(400).json({ message: "ID de producto no válido" });
    }

    try {
        // Buscar el dispositivo en la base de datos
        const dispositivo = await DispositivoUsuario.aggregate([
            { $unwind: "$dispositivos" },
            { $match: { "dispositivos.producto_id": mongoose.Types.ObjectId(producto_id) } },
            { $project: { nombre: "$dispositivos.nombre", ip: "$dispositivos.ip" } }
        ]);

        if (dispositivo.length === 0) {
            return res.status(404).json({ message: "Dispositivo no encontrado" });
        }

        // Devolver los detalles del dispositivo
        res.json(dispositivo[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener dispositivo" });
    }
});



module.exports = router;