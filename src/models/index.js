import Usuario from "./Usuario.model.js";
import Comentario from "./Comentario.model.js";
import Publicacion from "./publicacion.model.js";


//RELACIONES DE ERD

//UNO A MUCHOS ENTRE USUARIO Y PUBLICACIÓN
Usuario.hasMany(Publicacion, {
    foreignKey: "usuario_id"
});
Publicacion.belongsTo(Usuario, {
    foreignKey: "usuario_id"
});

//UNO A MUCHOS ENTRE USUARIO Y COMENTARIO
Usuario.hasMany(Comentario, {
    foreignKey: "usuario_id"
});
Comentario.belongsTo(Usuario, {
    foreignKey: "usuario_id"
});

//UNO A MUCHOS ENTRE PUBLICACION Y COMENTARIO
Publicacion.hasMany(Comentario, {
    foreignKey: "publicacion_id"
});
Comentario.belongsTo(Publicacion, {
    foreignKey: "publicacion_id"
});


export default {
    Usuario, Comentario, Publicacion
}