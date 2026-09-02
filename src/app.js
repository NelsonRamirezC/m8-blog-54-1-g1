import express from "express";
import authRoutes from "./routes/auth.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import publicacionesRoutes from "./routes/publicaciones.routes.js";
import comentariosRoutes from "./routes/comentarios.routes.js";
import fileUpload from "express-fileupload";

const app = express();

//MIDDLEWARES GLOBALES
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//GUARDA LOS FILES EN REQ.FILES
app.use(fileUpload());


//ENDPPINTS DE LA API
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/publicaciones", publicacionesRoutes);
app.use("/api/comentarios", comentariosRoutes);

//ENDPOINTS DE REGISTRO / LOGIN
app.use("/auth", authRoutes);

export default app;