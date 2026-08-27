import sequelize from "./src/config/database.js";
import app from "./src/app.js";

const PORT = 3000;

const main = async () => {
    try {
        await sequelize.sync();
        console.log("Base de datos conectada...");
        app.listen(PORT, () => {
            console.log("Servidor iniciado.");
        });
    } catch (error) {
        console.log(error);
    }
};

main();
