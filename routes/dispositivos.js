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
                    ip: "0.0.0.0", // IP vacía
                    nombre: "Dispositivo" // Nombre vacío
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
                ip: "0.0.0.0", // IP vacía
                nombre: "Dispositivo" // Nombre vacío
            });
        }

        await usuario.save();
        res.json({ message: "Producto agregado con éxito" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al agregar producto" });
    }
});

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
// 📌 Eliminar un producto de la lista de dispositivos del usuario
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

        // Buscar el dispositivo dentro del array de dispositivos
        const dispositivoIndex = usuario.dispositivos.findIndex(d => d.producto_id.equals(producto_id) && d.estado === "activo");

        if (dispositivoIndex === -1) {
            return res.status(404).json({ message: "Producto no encontrado o ya eliminado" });
        }

        // Marcar el dispositivo como eliminado
        usuario.dispositivos[dispositivoIndex].estado = "eliminado";

        // Guardar los cambios
        await usuario.save();
        res.json({ message: "Producto eliminado con éxito" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar producto" });
    }
});
// 📌 Obtener un producto específico de un usuario
router.get("/:usuario_id/:producto_id", async (req, res) => {
    const { usuario_id, producto_id } = req.params;

    // Validar los ObjectId
    if (!mongoose.Types.ObjectId.isValid(usuario_id)) {
        return res.status(400).json({ message: "ID de usuario no válido" });
    }
    if (!mongoose.Types.ObjectId.isValid(producto_id)) {
        return res.status(400).json({ message: "ID de producto no válido" });
    }

    try {
        // Buscar el usuario y filtrar el dispositivo específico
        const usuario = await DispositivoUsuario.findOne(
            { usuario_id, "dispositivos.producto_id": producto_id },
            { "dispositivos.$": 1 } // Solo extrae el dispositivo que coincida
        );

        if (!usuario || !usuario.dispositivos.length) {
            return res.status(404).json({ message: "Dispositivo no encontrado" });
        }

        res.json(usuario.dispositivos[0]); // Enviar solo el dispositivo encontrado
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el dispositivo" });
    }
});
// 📌 Actualizar un producto específico de un usuario
router.put("/actualizar/:usuario_id/:producto_id", async (req, res) => {
    const { usuario_id, producto_id } = req.params;
    const { nombre, ip } = req.body; // Obtenemos los nuevos valores para nombre y ip

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(usuario_id)) {
        return res.status(400).json({ message: "ID de usuario no válido" });
    }
    if (!mongoose.Types.ObjectId.isValid(producto_id)) {
        return res.status(400).json({ message: "ID de producto no válido" });
    }

    try {
        // Buscar el usuario y el dispositivo que queremos actualizar
        const usuario = await DispositivoUsuario.findOne({ usuario_id });

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Buscar el dispositivo dentro del array de dispositivos
        const dispositivo = usuario.dispositivos.find(d => d.producto_id.equals(producto_id) && d.estado === "activo");

        if (!dispositivo) {
            return res.status(404).json({ message: "Producto no encontrado o ya eliminado" });
        }

        // Actualizar los campos 'nombre' y 'ip'
        dispositivo.nombre = nombre || dispositivo.nombre; // Si el nombre no se pasa, mantener el actual
        dispositivo.ip = ip || dispositivo.ip; // Si la IP no se pasa, mantener la actual

        // Guardar los cambios
        await usuario.save();
        res.json({ message: "Producto actualizado con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar producto" });
    }
});

router.get("/todos", async (req, res) => {
    try {
        const dispositivosUsuarios = await DispositivoUsuario.find()
            .populate({
                path: "usuario_id",
                select: "nombre correo" // Ajusta los campos según tu modelo de Usuario
            })
            .populate({
                path: "dispositivos.producto_id",
                select: "nombre descripcion" // Ajusta los campos según tu modelo de Producto
            });

        if (!dispositivosUsuarios.length) {
            return res.status(404).json({ message: "No hay registros disponibles" });
        }

        res.json(dispositivosUsuarios);
    } catch (error) {
        console.error("Error al obtener los dispositivos y usuarios:", error);
        res.status(500).json({ message: "Error interno del servidor", error });
    }
});

module.exports = router;
