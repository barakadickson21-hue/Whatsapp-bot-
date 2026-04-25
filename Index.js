const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const P = require("pino");

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("session");

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: P({ level: "silent" })
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;

        const sender = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

        if (!text) return;

        const command = text.toLowerCase();

        // MENU
        if (command === "menu") {
            await sock.sendMessage(sender, {
                text: `🤖 *BOT MENU*

📊 check balance
👤 info
🔥 commands
😂 joke
🕒 time
📍 owner

Andika command 👇`
            });
        }

        // BALANCE
        else if (command === "check balance") {
            await sock.sendMessage(sender, {
                text: "💰 Balance yako: 0 TZS (demo)"
            });
        }

        // INFO
        else if (command === "info") {
            await sock.sendMessage(sender, {
                text: "👤 Bot powered by Railway ☁️"
            });
        }

        // COMMAND LIST
        else if (command === "commands") {
            await sock.sendMessage(sender, {
                text: `🔥 *COMMANDS*

menu
check balance
info
joke
time
owner`
            });
        }

        // JOKE
        else if (command === "joke") {
            await sock.sendMessage(sender, {
                text: "😂 Kwa nini developer hulala usiku? Kwa sababu bugs hulala mchana 😄"
            });
        }

        // TIME
        else if (command === "time") {
            const time = new Date().toLocaleTimeString();
            await sock.sendMessage(sender, {
                text: `🕒 Time sasa: ${time}`
            });
        }

        // OWNER
        else if (command === "owner") {
            await sock.sendMessage(sender, {
                text: "📍 Owner: Baraka Dickson 🤖"
            });
        }

    });

    console.log("🤖 Bot running with advanced commands...");
}

startBot();
