"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = __importStar(require("ws"));
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const displayRoutes = require("express-routemap");
const PORT = 8080;
const app = (0, express_1.default)();
const cors = require("cors");
app.use(cors());
const wss = new WebSocket.WebSocketServer({ port: PORT });
// จัดเก็บ WebSocket Clients
let clients = [];
console.log(`WebSocket server is running on ws://localhost:${PORT} 🚀`);
// เมื่อ client เชื่อมต่อ
wss.on("connection", (ws) => {
    console.log("New client connected 🗣️");
    clients.push(ws);
    // เมื่อมีข้อความส่งมาจาก client
    ws.on("message", (message) => {
        console.log(`Received message 📩 : ${message}`);
    });
    // เมื่อ client ตัดการเชื่อมต่อ
    ws.on("close", () => {
        clients = clients.filter((client) => client !== ws);
        console.log("Client disconnected ❌");
    });
});
// API ที่ใช้ส่งข้อมูลไปยัง WebSocket Clients
app.use(express_1.default.json());
app.post("/send-to-socket", (req, res) => {
    // ส่งข้อความไปยัง WebSocket ทุก client
    clients.forEach((client) => {
        const message = JSON.stringify(req.body);
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
    res.send(`Message sent to ${clients.length} clients 👤✅`);
});
// เริ่ม HTTP Server
const HTTP_PORT = process.env.HTTP_PORT || 3003;
app.listen(HTTP_PORT, () => {
    console.log(`HTTP server is running on http://localhost:${HTTP_PORT} 🌐`);
    displayRoutes(app);
});
