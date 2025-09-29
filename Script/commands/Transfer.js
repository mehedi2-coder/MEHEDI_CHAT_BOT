const fs = require("fs");
const path = __dirname + "/coinxbalance.json";

if (!fs.existsSync(path)) {
  fs.writeFileSync(path, JSON.stringify({}, null, 2));
}

function getBalance(userID) {
  const data = JSON.parse(fs.readFileSync(path));
  if (data[userID]?.balance != null) return data[userID].balance;

  if (userID === "100089044681685") return 100000000000;
  return 10000;
}

function setBalance(userID, balance) {
  const data = JSON.parse(fs.readFileSync(path));
  data[userID] = { balance };
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

function formatBalance(num) {
  if (num >= 1e12) return (num / 1e12).toFixed(1).replace(/\.0$/, '') + "T$";
  if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, '') + "B$";
  if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + "M$";
  if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + "k$";
  return num + "$";
}

module.exports.config = {
  name: "Transfer",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐌𝐞𝐡𝐞𝐝𝐢 + 𝐗𝐞𝐧𝐨𝐛𝐨𝐭",
  description: "Transfer money to another user",
  commandCategory: "Economy",
  usages: "/Transfer Money <amount> @user",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args, Users }) {
  const { threadID, senderID, messageID, mentions } = event;

  if (!args[0] || args[0].toLowerCase() !== "money")
    return api.sendMessage("❌ Usage: /send Money <amount> @user", threadID, messageID);

  if (!args[1] || isNaN(args[1]))
    return api.sendMessage("❌ Please enter a valid amount.", threadID, messageID);

  if (!mentions || Object.keys(mentions).length === 0)
    return api.sendMessage("❌ Please tag a user to send money.", threadID, messageID);

  const targetID = Object.keys(mentions)[0];
  const amount = parseInt(args[1]);

  if (amount <= 0) return api.sendMessage("❌ Invalid amount.", threadID, messageID);

  let senderBalance = getBalance(senderID);
  if (senderBalance < amount)
    return api.sendMessage("❌ You don't have enough balance.", threadID, messageID);

  let receiverBalance = getBalance(targetID);

  senderBalance -= amount;
  receiverBalance += amount;

  setBalance(senderID, senderBalance);
  setBalance(targetID, receiverBalance);

  const senderName = await Users.getNameUser(senderID);
  const receiverName = await Users.getNameUser(targetID);

  return api.sendMessage(
    `✅ 𝐘𝐨𝐮𝐫 𝐓𝐫𝐚𝐧𝐬𝐚𝐜𝐭𝐢𝐨𝐧 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥!\n\n👤 ${senderName} 𝐬𝐞𝐧𝐭 ${formatBalance(amount)} to ${receiverName}.\n📌 𝐘𝐨𝐮𝐫 𝐍𝐞𝐰 𝐁𝐚𝐥𝐚𝐧𝐜𝐞: ${formatBalance(senderBalance)}`,
    threadID,
    messageID
  );
};
