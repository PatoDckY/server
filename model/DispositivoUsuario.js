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
                required: true,
                index: true  // Agregar índice para optimizar consultas
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
                required: true, // Campo obligatorio
                default: null // Inicialmente nulo si no se proporciona
            },
            nombre: { 
                type: String, 
                required: true, // Campo obligatorio
                default: null // Inicialmente nulo si no se proporciona
            }
        }
    ]
});

module.exports = mongoose.model("DispositivoUsuario", DispositivoUsuarioSchema, "dispositivos_usuarios");
