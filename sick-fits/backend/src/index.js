require("dotenv").config({ path: "variables.env" });
const cookieParser = require("cookie-parser");
const createServer = require("./createServer");
const db = require("./db");

const server = createServer();

server.use(cookieParser());

server.start({ cors: { credentials: true, origin: process.env.FRONTEND_URL } }, deets => {
  console.log(`Server is now running on: http://localhost:${deets.port}`);
});
