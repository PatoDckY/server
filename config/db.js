// /config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://jesushfernandezh:123FH45JHDckY28@cluster0.5bism.mongodb.net/fishcare?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error de conexión a MongoDB:', error.message);
    process.exit(1); // Detener la aplicación si no se puede conectar
  }
};

module.exports = connectDB;
