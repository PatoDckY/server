// routes/servoRoutes.js
const express = require("express");
const router = express.Router();
const SensorData = require("../model/sensorDataModel"); // Importar el modelo de datos de los sensores

// Función para calcular el tiempo de activación del servo en función de la cantidad de peces
function calcularTiempoActivacion(cantidadPeces) {
  const tiempoBase = 1000; // Tiempo base en milisegundos (1 segundo por pez)
  return tiempoBase * cantidadPeces;
}

// Ruta para recibir la cantidad de peces y calcular el tiempo de activación del servo
router.post("/activar-servo", (req, res) => {
  const { cantidadPeces } = req.body;

  if (!cantidadPeces) {
    return res.status(400).json({ error: "El parámetro cantidadPeces es requerido" });
  }

  const tiempoActivacion = calcularTiempoActivacion(cantidadPeces);
  res.status(200).json({ tiempoActivacion });
});

// Ruta para recibir datos de los sensores (temperatura y nivel de agua) y guardarlos en MongoDB
router.post("/sensor-data", async (req, res) => {
  const { temperature, waterLevel } = req.body;

  if (!temperature || !waterLevel) {
    return res.status(400).json({ error: "Los parámetros temperature y waterLevel son requeridos" });
  }

  try {
    // Crear un nuevo documento con los datos de los sensores
    const newSensorData = new SensorData({
      temperature,
      waterLevel,
    });

    // Guardar el documento en MongoDB
    await newSensorData.save();

    res.status(201).json({ message: "Datos guardados correctamente", temperature, waterLevel });
  } catch (error) {
    console.error("Error al guardar los datos:", error);
    res.status(500).json({ error: "Error al guardar los datos en la base de datos" });
  }
});

module.exports = router;