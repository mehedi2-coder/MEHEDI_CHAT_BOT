const fs = require("fs");
const path = __dirname + "/coinxbalance.json";

if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}, null, 2));

function getBalance(userID) {
  const data = JSON.parse(fs.readFileSync(path, "utf8"));
  if (data[userID] && typeof data[userID].balance === "number") return data[userID].balance;

  if (userID === "100089044681685") return 100000000000;
  return 100000;
}

function setBalance(userID, balance) {
  const data = JSON.parse(fs.readFileSync(path, "utf8"));
  data[userID] = Object.assign(data[userID] || {}, { balance });
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
  version: "1.2.0",
  hasPermssion: 0,
  credits: "Mehedi Hasan", // © Don't Remove Credits
  description: "Spin game with random multipliers (uses main balance)",
  commandCategory: "game",
  usages: "/spin [bet]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args, Users }) {
  const { senderID, threadID, messageID } = event;
  const bet = parseInt(args[0]);
  const userName = (await Users.getNameUser(senderID)) || "Player";

  // 🧮 Validate bet
  if (isNaN(bet) || bet <= 0) {
    return api.sendMessage("⚠️ Please enter a valid bet. Example: /spin 1000", threadID, messageID);
  }

  let balance = getBalance(senderID);
  if (balance < bet) {
    return api.sendMessage(`🚫 Not enough balance! Your balance: ${formatBalance(balance)}`, threadID, messageID);
  }

  // 🎰 3x3 Spin Grid
  const cells = [
    ["6x", "3x", "6x"],
    ["X", "20x", "0x"],
    ["8x", "3x", "8x"]
  ];

  // Random spin
  const row = Math.floor(Math.random() * 3);
  const col = Math.floor(Math.random() * 3);
  const resultCell = cells[row][col];

  let winnings = 0;
  let outcome = "";

  // 💥 Determine result
  if (resultCell === "X") {
    winnings = -bet;
    outcome = "💸 You hit ❌ X! You lost your bet.";
  } else if (resultCell === "0x") {
    winnings = 0;
    outcome = "😐 You hit 0x — nothing happened. Try again!";
  } else {
    const multiplier = parseInt(resultCell);
    if (!isNaN(multiplier) && multiplier > 0) {
      winnings = bet * multiplier - bet; // net profit (win minus bet)
      outcome = `🎉 You hit ${multiplier}x! You won ${formatBalance(winnings)}!`;
    } else {
      outcome = "😕 Unexpected spin result!";
    }
  }

  const newBalance = balance + winnings;
  setBalance(senderID, newBalance);

  // 🧩 Create grid display
  let gridDisplay = "╔════════════════╗\n║🎰  3x3 Spin Grid  🎰║\n╠════════════════╣\n";
  for (let r = 0; r < 3; r++) {
    let rowDisplay = "";
    for (let c = 0; c < 3; c++) {
      if (r === row && c === col) rowDisplay += ` [${cells[r][c]}] `;
      else rowDisplay += `  ${cells[r][c]}  `;
    }
    gridDisplay += `║${rowDisplay}║\n`;
  }
  gridDisplay += "╚════════════════╝";

  const message = `${gridDisplay}\n\n👤 Player: ${userName}\n${outcome}\n💰 New Balance: ${formatBalance(newBalance)}`;

  return api.sendMessage(message, threadID, messageID);
};
