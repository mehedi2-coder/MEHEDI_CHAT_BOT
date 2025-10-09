
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

module.exports.config = {
  name: "coin",
  version: "1.2.0",
  hasPermssion: 0,
  credits: "Mehedi Hasan", // © Don't Remove Credits
  description: "Check, add, or remove a user's balance (admin-only for add/remove)",
  commandCategory: "economy",
  usages: "[Tag] | add <amount> | remove <amount>",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args, Users, permssion }) {
  const { threadID, messageID, senderID, mentions } = event;
  const userName = await Users.getNameUser(senderID);

  const adminIDs = ["100089044681685"]; // <-- Add your own or your team members' IDs here

  if (!args[0]) {
    const balance = getBalance(senderID);
    return api.sendMessage(
      `•—»✨ 𝗨𝘀𝗲𝗿 𝗜𝗻𝗳𝗼 ✨«—•\n╭•┄┅═══❁💵❁═══┅┄•╮\n🆔 Name: ${userName}\n💰 Balance: ${balance}$\n╰•┄┅═══❁💵❁═══┅┄•╯`,
      threadID,
      messageID
    );
  }

  if (args[0] === "add") {
    if (!adminIDs.includes(senderID))
      return api.sendMessage("🚫 You don’t have permission to use this command.", threadID, messageID);

    if (Object.keys(mentions).length !== 1)
      return api.sendMessage("❌ Please tag one user to add coins.", threadID, messageID);

    const mentionID = Object.keys(mentions)[0];
    const mentionName = await Users.getNameUser(mentionID);
    const amount = parseInt(args[1]);

    if (isNaN(amount) || amount <= 0)
      return api.sendMessage("❌ Please enter a valid positive number.", threadID, messageID);

    const oldBalance = getBalance(mentionID);
    const newBalance = oldBalance + amount;
    setBalance(mentionID, newBalance);

    return api.sendMessage(
      `✅ Successfully added ${amount}$ to ${mentionName}'s balance.\n💰 New Balance: ${newBalance}$`,
      threadID,
      messageID
    );
  }

  if (args[0] === "remove") {
    if (!adminIDs.includes(senderID))
      return api.sendMessage("🚫 You don’t have permission to use this command.", threadID, messageID);

    if (Object.keys(mentions).length !== 1)
      return api.sendMessage("❌ Please tag one user to remove coins.", threadID, messageID);

    const mentionID = Object.keys(mentions)[0];
    const mentionName = await Users.getNameUser(mentionID);
    const amount = parseInt(args[1]);

    if (isNaN(amount) || amount <= 0)
      return api.sendMessage("❌ Please enter a valid positive number.", threadID, messageID);

    const oldBalance = getBalance(mentionID);
    const newBalance = Math.max(0, oldBalance - amount);
    setBalance(mentionID, newBalance);

    return api.sendMessage(
      `✅ Successfully removed ${amount}$ from ${mentionName}'s balance.\n💰 New Balance: ${newBalance}$`,
      threadID,
      messageID
    );
  }

  if (Object.keys(mentions).length === 1) {
    const mentionID = Object.keys(mentions)[0];
    const mentionName = await Users.getNameUser(mentionID);
    const balance = getBalance(mentionID);

    return api.sendMessage(
      {
        body: `💰 ${mentionName}\n•—»✨ 𝗨𝘀𝗲𝗿 𝗜𝗻𝗳𝗼 ✨«—•\n╭•┄┅═══❁💵❁═══┅┄•╮\n🆔 Name: ${mentionName}\n💰 Balance: ${balance}$\n╰•┄┅═══❁💵❁═══┅┄•╯`,
        mentions: [{ tag: mentionName, id: mentionID }]
      },
      threadID,
      messageID
    );
  }

  return api.sendMessage(
    "❌ Invalid command!\nUsage:\n• coin — Check your balance\n• coin @Tag — Check someone’s balance\n• coin add <amount> @Tag — Add coins (Admin only)\n• coin remove <amount> @Tag — Remove coins (Admin only)",
    threadID,
    messageID
  );
};
