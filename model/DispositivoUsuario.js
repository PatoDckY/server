const mongoose = require("mongoose");

const DispositivoUsuarioSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" }, // ID del usuario como clave única
    dispositivos: [
        {
            producto_id: { type: mongoose.Schema.Types.ObjectId, ref: "Producto", required: true },
            fecha_agregado: { type: Date, default: Date.now },
            estado: { type: String, enum: ["activo", "eliminado"], default: "activo" }
        }
    ]
});

module.exports = mongoose.model("DispositivoUsuario", DispositivoUsuarioSchema, "dispositivos_usuarios");

