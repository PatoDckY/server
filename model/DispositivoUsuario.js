const mongoose = require("mongoose");

const DispositivoUsuarioSchema = new mongoose.Schema({
    usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true, unique: true }, // ID del usuario
    dispositivos: [
        {
            producto_id: { type: mongoose.Schema.Types.ObjectId, ref: "Producto", required: true },
            fecha_agregado: { type: Date, default: Date.now },
            estado: { type: String, enum: ["activo", "eliminado"], default: "activo" }
        }
    ]
});

module.exports = mongoose.model("DispositivoUsuario", DispositivoUsuarioSchema, "dispositivos_usuarios");