const mongoose = require("mongoose");

const DispositivoUsuarioSchema = new mongoose.Schema({
    usuario_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Usuario", 
        required: true, 
        unique: true 
    }, // ID del usuario
    dispositivos: [
        {
            producto_id: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Producto", 
                required: true 
            },
            fecha_agregado: { 
                type: Date, 
                default: Date.now 
            },
            estado: { 
                type: String, 
                enum: ["activo", "eliminado"], 
                default: "activo" 
            },
            ip: { 
                type: String, 
                default: null // Campo para la IP (inicialmente nulo)
            },
            nombre: { 
                type: String, 
                default: null // Campo para el nombre (inicialmente nulo)
            }
        }
    ]
});

module.exports = mongoose.model("DispositivoUsuario", DispositivoUsuarioSchema, "dispositivos_usuarios");
