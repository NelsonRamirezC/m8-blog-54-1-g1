import { Sequelize } from "sequelize";

const URI_DATABASE =
    "postgres://postgres:123456@localhost:5432/m8_blog_54_1_g1";

const sequelize = new Sequelize(URI_DATABASE, {
    //logging: false
    quoteIdentifiers: true
});

export default sequelize;