require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const handleWebSocketConnection = require("./wsHandler");
const routerAftorisation = require("./router/aftorisationRouter");
const routerAlert = require("./router/userAlertsRouter");
const routerMouny = require("./router/moneyRouter");
const ApiError = require("./middlewares/error-middleware");

const PORT = process.env.PORT || 5000;
const app = express();
require("express-ws")(app);
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/api", routerAftorisation);
app.use("/api", routerAlert);
app.use("/api", routerMouny);
app.use(ApiError);

app.ws("/api/chat/:idChat/:idUser", handleWebSocketConnection);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => {
      console.log(`HTTP Server started on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};
start();
