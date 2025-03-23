const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // Importar la función de conexión a la base de datos
const productosRoutes = require("./routes/productos"); // Importar las rutas de productos
const nosotrosRoutes = require("./routes/nosotrosR"); // Importar las rutas de Nosotros
const PecesRoutes = require("./routes/peces");
const UsuariosRoutes = require("./routes/usuarios");
const preguntasRecuperacionRoutes = require("./routes/preguntas_recuperacion");
const IotRoutes = require("./routes/datosPecera"); // Importar las rutas del servo y sensores
const ContactoRoutes = require("./routes/contacto");
const SoporteRoutes = require("./routes/soporte");
const GuiaRoutes = require("./routes/guia");
const busqueda = require("./routes/busqueda");
const dispositivos = require("./routes/dispositivos");

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Permite peticiones desde el frontend

// Conectar con MongoDB
connectDB(); // Llamar a la función para conectar con MongoDB

// Rutas
app.use("/productos", productosRoutes); // Usar las rutas de productos
app.use("/nosotros", nosotrosRoutes);
app.use("/peces", PecesRoutes);
app.use("/usuarios", UsuariosRoutes);
app.use("/preguntas", preguntasRecuperacionRoutes);
app.use("/Iot", IotRoutes); // Usar las rutas del servo y sensores
app.use("/contacto", ContactoRoutes);
app.use("/soporte", SoporteRoutes);
app.use("/guia", GuiaRoutes);
app.use("/buscar", busqueda);
app.use("/dispositivos", dispositivos);

// Export the app for Vercel
module.exports = app;