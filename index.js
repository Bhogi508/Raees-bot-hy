import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason
} from "@whiskeysockets/baileys"

import express from "express"
import http from "http"
import { Server } from "socket.io"
import QRCode from "qrcode"
import Pino from "pino"

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static("public"))

async function startBot() {
  const { state, saveCreds } =
    await useMultiFileAuthState("./auth")

  const sock = makeWASocket({
    auth: state,
    logger: Pino({ level: "silent" }),
    browser: ["Ruman Raees Bot", "Chrome", "1.0.0"]
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", async (update) => {
    const { connection, qr, lastDisconnect } = update

    if (qr) {
      const qrImage = await QRCode.toDataURL(qr)
      io.emit("qr", qrImage)
      console.log("📸 QR sent to website")
    }

    if (connection === "open") {
      io.emit("status", "✅ WhatsApp Connected")
      console.log("✅ Bot connected")
    }

    if (connection === "close") {
      const reason =
        lastDisconnect?.error?.output?.statusCode

      if (reason !== DisconnectReason.loggedOut) {
        startBot()
      } else {
        console.log("❌ Logged out, delete auth folder")
      }
    }
  })
}

startBot()

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log("🌐 Website running on port " + PORT)
})
