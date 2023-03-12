const ApiError = require("./exceptions/api-error");
const RootChatController = require("./controllers/rootChat-controller");

const handleWebSocketConnection = async (ws, req) => {
  await RootChatController.startChat(ws, req);
  console.log("START");
  ws.on("message", async (message) => {
    await RootChatController.controllReq(message, ws, req);
  });
  ws.on("error", function (err) {
    const apiError = ApiError.BadRequest("Ошибка соединения", []);
    ws.send(JSON.stringify(apiError));
  });
  ws.on("close", async () => {
    await RootChatController.closeChat(req);
  });
};
module.exports = handleWebSocketConnection;
