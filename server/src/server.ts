import app from "./app";
import deepgramService from "./services/deepgramService";
import websocketService from "./services/websocketService";
import constants from "./config/constants";

// Add health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    expressPort: constants.EXPRESS_PORT,
    websocketPort: constants.WEBSOCKET_PORT
  });
});

// Initialize the Deepgram connection
deepgramService
  .initConnection()
  .then(() => {
    // Set the Deepgram service in WebSocket service
    websocketService.setDeepgramService(deepgramService);
    console.log("Deepgram service initialized and connected to WebSocket");
  })
  .catch((err: Error) => console.error("Deepgram connection error:", err));

// Start the Express server
app.listen(constants.EXPRESS_PORT, () => {
  console.log(`Express server running on port ${constants.EXPRESS_PORT}`);
  console.log(`WebSocket server running on port ${constants.WEBSOCKET_PORT}`);
  console.log(`Health check available at http://localhost:${constants.EXPRESS_PORT}/health`);
});
