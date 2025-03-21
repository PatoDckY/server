const express = require("express");
const Usuario = require("../model/Usuarios"); // Importar el modelo de Usuario
const bcrypt = require("bcrypt"); // Para comparar las contraseñas de forma segura
const router = express.Router();

// 1. Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const usuarios = await Usuario.find(); // Obtener todos los documentos de la colección
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. Obtener un usuario por ID
router.get("/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Registro de usuario
router.post("/", async (req, res) => {
  try {
    const { nombre, apellidoP, apellidoM, telefono, email, contraseña, sexo, edad, pregunta_recuperacion } = req.body;

    // Verificar que los campos de pregunta_recuperacion estén presentes
    if (!pregunta_recuperacion || !pregunta_recuperacion.preg_id || !pregunta_recuperacion.respuesta) {
      return res.status(400).json({ error: "La pregunta de recuperación y su respuesta son obligatorias" });
    }

    // Verificar si ya existe un usuario con el mismo correo o teléfono
    const existingUser = await Usuario.findOne({ $or: [{ email }, { telefono }] });
    if (existingUser) {
      return res.status(400).json({ error: "El correo electrónico o el teléfono ya están registrados." });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);

    // Crear nuevo usuario con rol "Cliente" por defecto
    const nuevoUsuario = new Usuario({
      nombre,
      apellidoP,
      apellidoM,
      telefono,
      email,
      contraseña: hashedPassword,
      sexo,
      edad,
      pregunta_recuperacion,
      rol: "Cliente", // Se asigna automáticamente el rol Cliente
    });

    await nuevoUsuario.save();
    res.status(201).json({ mensaje: "Usuario creado exitosamente", nuevoUsuario });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Actualizar un usuario por ID
router.put("/:id", async (req, res) => {
  try {
    const { nombre, apellidoP, apellidoM, telefono, email, contraseña, sexo, edad } = req.body;

    // Actualizar el usuario por ID
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { nombre, apellidoP, apellidoM, telefono, email, contraseña, sexo, edad },
      { new: true } // Regresa el documento actualizado
    );

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario actualizado exitosamente", usuario });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 5. Eliminar un usuario por ID
router.delete("/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 6. Verificar si el correo o teléfono ya están registrados
// Asegúrate de importar el modelo Usuario

router.post("/check-duplicate", async (req, res) => {
  try {
    const { email, telefono } = req.body;

    // Verificar si el correo o teléfono ya están registrados
    const existingUser = await Usuario.findOne({
      $or: [{ email: email }, { telefono: telefono }],
    });

    if (existingUser) {
      return res.status(400).json({
        error: "El correo electrónico o el teléfono ya están registrados.",
      });
    }

    res.status(200).json({ message: "No hay duplicados. Puedes proceder con el registro." });
  } catch (error) {
    console.error("Error al verificar duplicados:", error);
    res.status(500).json({ message: "Hubo un error en el servidor." });
  }
});

// 7. Ruta de login - Verificar correo y contraseña
router.post("/login", async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    // Buscar el usuario por su correo electrónico
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(400).json({ error: "Correo o contraseña incorrectos." });
    }

    // Comparar la contraseña ingresada con la contraseña almacenada en la base de datos
    const passwordMatch = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!passwordMatch) {
      return res.status(400).json({ error: "Correo o contraseña incorrectos." });
    }

    // Si la contraseña es correcta, enviar el usuario y un mensaje de éxito
    res.status(200).json({
      message: "Login exitoso",
      usuario: {
        _id: usuario._id,
        nombre: usuario.nombre,
        rol: usuario.rol, // Asegúrate de enviar el rol
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para cambiar el rol de un usuario
router.put("/cambiar-rol/:id", async (req, res) => {
  try {
    const { rol } = req.body;

    // Verificar si el rol es válido
    if (!["Cliente", "Administrador"].includes(rol)) {
      return res.status(400).json({ message: "Rol no válido. Debe ser 'Cliente' o 'Administrador'." });
    }

    // Buscar el usuario por su ID
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizar el rol del usuario
    usuario.rol = rol;

    // Guardar los cambios
    const usuarioActualizado = await usuario.save();

    res.status(200).json({ message: `Rol actualizado a ${usuarioActualizado.rol}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cambiar contraseña
router.post("/:id/cambiar-password", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, usuario.contraseña);
    if (!passwordMatch) {
      return res.status(400).json({ error: "La contraseña actual es incorrecta." });
    }

    const salt = await bcrypt.genSalt(10);
    usuario.contraseña = await bcrypt.hash(newPassword, salt);
    await usuario.save();

    res.status(200).json({ message: "Contraseña cambiada exitosamente." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
