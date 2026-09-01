import Usuario from "./Usuario.model.js";
import Comentario from "./Comentario.model.js";
import Publicacion from "./Publicacion.model.js";


//RELACIONES DE ERD

//UNO A MUCHOS ENTRE USUARIO Y PUBLICACIÓN
Usuario.hasMany(Publicacion, {
    foreignKey: "usuarioId",
    onDelete: "CASCADE"
});
Publicacion.belongsTo(Usuario, {
    foreignKey: "usuarioId"
});

//UNO A MUCHOS ENTRE USUARIO Y COMENTARIO
Usuario.hasMany(Comentario, {
    foreignKey: "usuarioId",
    onDelete: "CASCADE"
});
Comentario.belongsTo(Usuario, {
    foreignKey: "usuarioId"
});

//UNO A MUCHOS ENTRE PUBLICACION Y COMENTARIO
Publicacion.hasMany(Comentario, {
    foreignKey: "publicacionId",
    onDelete: "CASCADE"
});
Comentario.belongsTo(Publicacion, {
    foreignKey: "publicacionId"
});


export default {
    Usuario, Comentario, Publicacion
}