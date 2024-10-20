import * as WebSocket from "ws";
import express, { Request, Response } from "express";
import "dotenv/config";
import { SuccessResponseDTO, ErrorResponseDTO } from "./dto/response";
const displayRoutes = require("express-routemap");

const PORT = 8080;
const app = express();
const cors = require("cors");
app.use(cors());
const wss = new WebSocket.WebSocketServer({ port: PORT });

// จัดเก็บ WebSocket Clients
let clients: WebSocket[] = [];
console.log(`WebSocket server is running on ws://localhost:${PORT} 🚀`);

// เมื่อ client เชื่อมต่อ
wss.on("connection", (ws: WebSocket) => {
  console.log("New client connected 🗣️");
  clients.push(ws);

  // เมื่อมีข้อความส่งมาจาก client
  ws.on("message", (message: string) => {
    console.log(`Received message 📩 : ${message}`);
  });

  // เมื่อ client ตัดการเชื่อมต่อ
  ws.on("close", () => {
    clients = clients.filter((client) => client !== ws);
    console.log("Client disconnected ❌");
  });
});

// API ที่ใช้ส่งข้อมูลไปยัง WebSocket Clients
app.use(express.json());

app.post("/send-to-socket", (req: Request, res: Response) => {
  try {
    // ส่งข้อความไปยัง WebSocket ทุก client
    clients.forEach((client: WebSocket) => {
      const message = JSON.stringify(req.body);
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
    const successResponse: SuccessResponseDTO<typeof req.body> = {
      success: true,
      statusCode: 200,
      message: `Successfully sent message to clients`,
      data: req.body,
    };

    res.status(200).json(successResponse);
  } catch (error) {
    const errorResponse: ErrorResponseDTO = {
      success: false,
      statusCode: 500,
      message: "An error occurred while sending the message",
      error: error instanceof Error ? error.message : String(error),
    };

    res.status(500).json(errorResponse);
  }
});

// เริ่ม HTTP Server
const HTTP_PORT = process.env.HTTP_PORT || 3003;
app.listen(HTTP_PORT, () => {
  console.log(`HTTP server is running on http://localhost:${HTTP_PORT} 🌐`);
  displayRoutes(app);
});
