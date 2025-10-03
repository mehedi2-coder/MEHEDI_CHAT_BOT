const fs = require("fs");
const path = __dirname + "/coinxbalance.json";

if (!fs.existsSync(path)) {
  fs.writeFileSync(path, JSON.stringify({}, null, 2));
}

function getBalance(userID) {
  const data = JSON.parse(fs.readFileSync(path));
  if (data[userID]?.balance != null) return data[userID].balance;

  if (userID === "100089044681685") return 10000000000;
  return 10000;
}

function setBalance(userID, balance) {
  const data = JSON.parse(fs.readFileSync(path));
  data[userID] = { balance };
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

function formatBalance(num) {
  if (num >= 1e12) return (num / 1e12).toFixed(2).replace(/\.00$/, '') + "T$";
  if (num >= 1e9) return (num / 1e9).toFixed(2).replace(/\.00$/, '') + "B$";
  if (num >= 1e6) return (num / 1e6).toFixed(2).replace(/\.00$/, '') + "M$";
  if (num >= 1e3) return (num / 1e3).toFixed(2).replace(/\.00$/, '') + "k$";
  return num + "$";
}

module.exports.config = {
  name: "bet",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Mehedi + Xenobot", //© Don't Remove Credits
  description: "Place a bet: win 2x,5x,10x,20x,40x,60x,100x coins!",
  commandCategory: "Economy",
  usages: "bet <amount>",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const { senderID, threadID, messageID } = event;
  let balance = getBalance(senderID);

  if (!args[0] || isNaN(args[0])) return api.sendMessage("⭕ Please enter a valid bet amount.", threadID, messageID);

  let betAmount = parseInt(args[0]);
  if (betAmount <= 0) return api.sendMessage("💲 Bet amount must be greater than 0.", threadID, messageID);
  if (betAmount > balance) return api.sendMessage("🙂 Sorry, You don't have enough Coins to bet that amount.", threadID, messageID);

  const multipliers = [2, 5, 10, 20, 40, 60, 100];
  const chosenMultiplier = multipliers[Math.floor(Math.random() * multipliers.length)];

  const win = Math.random() < 0.5; 

  if (win) {
    const winAmount = betAmount * chosenMultiplier;
    balance += winAmount;
    setBalance(senderID, balance);
    return api.sendMessage(
      `🎉 Congratulations! You won the bet!\n🤑 Bet: ${formatBalance(betAmount)}\n🚀 Multiplier: ${chosenMultiplier}x\n📥 Your New Balance: ${formatBalance(balance)}`,
      threadID,
      messageID
    );
  } else {
    balance -= betAmount;
    if (balance < 0) balance = 0;
    setBalance(senderID, balance);
    return api.sendMessage(
      `😔 Bad luck! You lost the bet!\n💲 Bet: ${formatBalance(betAmount)}\n📤 Your New Balance: ${formatBalance(balance)}`,
      threadID,
      messageID
    );
  }
};
