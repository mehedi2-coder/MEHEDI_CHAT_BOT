const fs = require("fs");
const path = __dirname + "/coinxbalance.json";

if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}, null, 2));

function getBalance(userID) {
  const data = JSON.parse(fs.readFileSync(path, "utf8"));
  if (data[userID] && typeof data[userID].balance === "number") return data[userID].balance;

  if (userID === "100089044681685") return 100000000000;
  return 10000;
}

function setBalance(userID, balance) {
  const data = JSON.parse(fs.readFileSync(path, "utf8"));
  data[userID] = Object.assign(data[userID] || {}, { balance: balance });
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

function formatBalance(num) {
  if (num >= 1e12) return (num / 1e12).toFixed(1).replace(/\.0$/, "") + "T$";
  if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, "") + "B$";
  if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, "") + "M$";
  if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, "") + "k$";
  return num + "$";
}

module.exports.config = {
  name: "spin",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Mehedi Hasan",
  description: "Spin Game with multipliers & X (uses main balance)",
  commandCategory: "game",
  usages: "/spin [bet]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args, Users }) {
  const { senderID, threadID, messageID } = event;
  const bet = parseInt(args[0]);

  if (isNaN(bet) || bet <= 0) {
    return api.sendMessage("⚠️ Please enter a valid bet. Example: /spin 1000", threadID, messageID);
  }

  let balance = getBalance(senderID);

  if (balance < bet) {
    return api.sendMessage(`🚫 Not enough balance! Your balance: ${formatBalance(balance)}`, threadID, messageID);
  }

  const cells = [
    ["2x", "0x", "3x"],
    ["X",  "↗️", "6x"],
    ["0x", "3x", "X"]
  ];

  const row = Math.floor(Math.random() * 3);
  const col = Math.floor(Math.random() * 3);
  const resultCell = cells[row][col];

  let winnings = 0;
  let outcome = "";

  if (resultCell === "X") {
    
    winnings = -bet;
    outcome = "💸 You hit X! You lost your bet.";
  } else if (resultCell === "0x") {
   
    winnings = 0;
    outcome = "😐 0x — nothing happened. Try again!";
  } else {
    
    const m = parseInt(resultCell); // 2,3,6
    if (!isNaN(m) && m > 0) {
      winnings = bet * m;
      outcome = `🎉 You hit ${m}x! You won ${formatBalance(winnings)}.`;
    } else {
      
      winnings = 0;
      outcome = "😐 Nothing happened (unexpected cell).";
    }
  }

  const newBalance = balance + winnings;
  setBalance(senderID, newBalance);

  let gridDisplay = "🎰 3x3 Spin Grid 🎰\n";
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (r === row && c === col) gridDisplay += ` [${cells[r][c]}] `;
      else gridDisplay += `  ${cells[r][c]}  `;
    }
    gridDisplay += "\n";
}
  const userName = (await Users.getNameUser(senderID)) || "Player";
  const message = `${gridDisplay}\n${outcome}\n💰 New Balance for ${userName}: ${formatBalance(newBalance)}`;

  return api.sendMessage(message, threadID, messageID);
};
