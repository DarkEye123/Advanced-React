require("dotenv").config({ path: "variables.env" });
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const createServer = require("./createServer");
const db = require("./db");

const server = createServer();

server.use(cookieParser());

server.use((req, res, next) => {
  if (!req.cookies) {
    next();
  } else {
    const { token } = req.cookies;
    if (token) {
      console.log("detected token", token);
      const { userId } = jwt.verify(req.cookies.token, process.env.APP_SECRET);
      console.log("detected id:", userId);
      req.userId = userId;
    }
    next();
  }
});

server.start({ cors: { credentials: true, origin: [process.env.FRONTEND_URL, process.env.BACKED_URL] } }, deets => {
  console.log(`Server is now running on: http://localhost:${deets.port}`);
});
