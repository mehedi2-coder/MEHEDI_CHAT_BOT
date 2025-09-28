const fs = require("fs");
const path = __dirname + "/coinxbalance.json";

// coinxbalance.json না থাকলে বানানো
if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}, null, 2));

function loadData() {
  return JSON.parse(fs.readFileSync(path));
}

function saveData(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

module.exports.config = {
  name: "spin",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Mehedi Hasan",
  description: "Spin Game with multipliers & X",
  commandCategory: "game",
  usages: "/spin [bet]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args, Users }) {
  const { senderID, threadID, messageID } = event;
  let bet = parseInt(args[0]);

  if (isNaN(bet) || bet <= 0) {
    return api.sendMessage("⚠️ Please enter a valid bet. Example: /spin 1000", threadID, messageID);
  }

  const data = loadData();
  if (!data[senderID]) data[senderID] = { balance: 10000 }; // default balance

  if (data[senderID].balance < bet) {
    return api.sendMessage(`🚫 Not enough balance! Your balance: ${data[senderID].balance}`, threadID, messageID);
  }

  // 3x3 grid setup
  const cells = [
    ["2x", "0x", "3x"],
    ["X", "↗️", "6x"],
    ["0x", "3x", "X"]
  ];

  // Randomly pick a cell
  const row = Math.floor(Math.random() * 3);
  const col = Math.floor(Math.random() * 3);
  const resultCell = cells[row][col];

  let winnings = 0;
  let outcome = "";

  if (resultCell === "X") {
    winnings = -bet;
    outcome = "💸 You hit X! Lost your bet.";
  } else if (resultCell === "0x") {
    winnings = 0;
    outcome = "😐 Nothing happened, try again!";
  } else {
    // multiplier logic (2x, 3x, 6x)
    let multiplier = parseInt(resultCell);
    winnings = bet * multiplier;
    outcome = `🎉 You won ${multiplier}x your bet!`;
  }

  // Update balance
  data[senderID].balance += winnings;
  saveData(data);

  // Show the grid
  let gridDisplay = "🎰 3x3 Spin Grid 🎰\n";
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (r === row && c === col) gridDisplay += `[${cells[r][c]}] `;
      else gridDisplay += ` ${cells[r][c]}  `;
    }
    gridDisplay += "\n";
  }

  const userName = await Users.getNameUser(senderID);

  const message = `${gridDisplay}\n${outcome}\n💰 Your new balance: ${data[senderID].balance}`;
  return api.sendMessage(message, threadID, messageID);
};
