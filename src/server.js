import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import usersRouter from "./services/users/index.js";
import itemsRouter from "./services/items/index.js";
import lib from "./lib/index.js";

const { errorHandlers, serverConfig } = lib;

const server = express();

const port = process.env.PORT || 3001;

server.use(cors(serverConfig));
server.use(express.json());

server.use("/users", usersRouter);
server.use("/items", itemsRouter);

server.use(errorHandlers.badRequest);
server.use(errorHandlers.unauthorized);
server.use(errorHandlers.forbidden);
server.use(errorHandlers.notFound);
server.use(errorHandlers.server);

mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to mongo!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running at ${port}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log("MONGO ERROR: ", err);
});
