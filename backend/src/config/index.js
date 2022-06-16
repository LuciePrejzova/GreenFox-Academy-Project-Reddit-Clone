"use strict";

import "dotenv/config";
import Sequelize from "sequelize";
import "regenerator-runtime/runtime.js";


const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    dialect: process.env.DIALECT,
  }
);



export default sequelize;
