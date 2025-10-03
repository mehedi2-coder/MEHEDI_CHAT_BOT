const fs = require("fs");
const path = __dirname + "/coinxbalance.json";

if (!fs.existsSync(path)) {
  fs.writeFileSync(path, JSON.stringify({}, null, 2));
}

function getBalance(userID) {
  const data = JSON.parse(fs.readFileSync(path));
  if (data[userID]?.balance != null) return data[userID].balance;

  if (userID === "100089044681685") return 100000000000;
  return 100000;
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
  name: "balance",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧", //© Don't Remove Credits
  description: "Check your coin balance & Transfer Coins",
  commandCategory: "Economy",
  usages: "balance /transfer <@user> <amount>",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args, Users }) {
  const { threadID, senderID, messageID, mentions } = event;

  try {
    
    if (args[0] && args[0].toLowerCase() === "transfer") {
      if (!mentions || Object.keys(mentions).length === 0)
        return api.sendMessage("❌ Please tag a user to transfer coins.", threadID, messageID);

      const targetID = Object.keys(mentions)[0];
      const amount = parseInt(args[1]);

      if (isNaN(amount) || amount <= 0)
        return api.sendMessage("❌ Please provide a valid amount to transfer.", threadID, messageID);

      let senderBalance = getBalance(senderID);
      if (senderBalance < amount)
        return api.sendMessage("❌ You don't have enough coins to transfer.", threadID, messageID);

      let receiverBalance = getBalance(targetID);
      senderBalance -= amount;
      receiverBalance += amount;

      setBalance(senderID, senderBalance);
      setBalance(targetID, receiverBalance);

      const senderName = await Users.getNameUser(senderID);
      const receiverName = await Users.getNameUser(targetID);

      return api.sendMessage(
        `✅ Transfer Successful!\n💰 ${senderName} sent ${formatBalance(amount)} to ${receiverName}.\n📌 Your New Balance: ${formatBalance(senderBalance)}`,
        threadID,
        messageID
      );
    }

    let balance = getBalance(senderID);
    const userName = await Users.getNameUser(senderID);

    return api.sendMessage(
      `•—»✨ 𝗨𝘀𝗲𝗿 𝗜𝗻𝗳𝗼 ✨«—•\n╭•┄┅═══❁💵❁═══┅┄•╮\n🆔 𝗡𝗮𝗺𝗲: ${userName}\n🅱 𝗠𝗮𝗶𝗻 𝗕𝗮𝗹𝗮𝗻𝗰𝗲: ${formatBalance(balance)}\n╰•┄┅═══❁💵❁═══┅┄•╯`,
      threadID,
      messageID
    );
  } catch (err) {
    console.error(err);
    return api.sendMessage("Error⚠ ব্যালেন্স ট্রান্সফার করতে সমস্যা হয়েছে!", threadID, messageID);
  }
};
