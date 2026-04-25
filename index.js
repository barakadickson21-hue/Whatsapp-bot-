const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const P = require("pino");

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("session");
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        logger: P({ level: "silent" })
    });

    sock.ev.on("creds.update", saveCreds);

    // 👉 HAPA NDIO MUHIMU (PAIRING CODE)
    if (!sock.authState.creds.registered) {
        const phoneNumber = "255XXXXXXXXX"; // weka namba yako hapa (mf: 255712345678)
        const code = await sock.requestPairingCode(phoneNumber);
        console.log("🔗 Pairing code yako ni:", code);
    }

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;

        const sender = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

        if (!text) return;

        const cmd = text.toLowerCase();

        if (cmd === "menu") {
            await sock.sendMessage(sender, {
                text: `🤖 MENU

📊 check balance
👤 info
🔥 commands`
            });
        }
    });

    console.log("🤖 Bot running...");
}

startBot();
