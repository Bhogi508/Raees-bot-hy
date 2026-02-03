import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys"

const startBot = async () => {
  const { state, saveCreds } = await useMultiFileAuthState("auth")
  const sock = makeWASocket({ auth: state })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message || msg.key.fromMe) return

    const text = msg.message.conversation?.toLowerCase()
    const jid = msg.key.remoteJid

    // START
    if (text === "hi" || text === "hello") {
      await sock.sendMessage(jid, {
        text:
`👋 *Welcome to Ruman Raees Web Services*

Choose a package:
1️⃣ Cheap Website – 1000 PKR
2️⃣ Pro Website – 3000 PKR
3️⃣ Ultimate Website – 5000 PKR

Reply with *1, 2 or 3*`
      })
    }

    // OPTION 1
    if (text === "1") {
      await sock.sendMessage(jid, {
        text:
`✅ *Cheap Website Selected*

💰 Price: 1000 PKR
📲 Easypaisa: *03158479223*

Send payment screenshot after payment.`
      })
    }

    // OPTION 2
    if (text === "2") {
      await sock.sendMessage(jid, {
        text:
`🔥 *Pro Website Selected*

💰 Price: 3000 PKR
📲 Easypaisa: *03158479223*

Send payment screenshot.`
      })
    }

    // OPTION 3
    if (text === "3") {
      await sock.sendMessage(jid, {
        text:
`🚀 *Ultimate Website Selected*

💰 Price: 5000 PKR
📲 Easypaisa: *03158479223*

Send payment screenshot.`
      })
    }
  })
}

startBot()
