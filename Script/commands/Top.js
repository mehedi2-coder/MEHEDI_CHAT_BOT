const fs = require("fs");
const path = __dirname + "/coinxbalance.json";

// coinxbalance.json না থাকলে বানানো
if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}, null, 2));

// ব্যালেন্স ও level পড়া
function loadData() {
  return JSON.parse(fs.readFileSync(path));
}

// ডাটা সেভ করা
function saveData(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

// level calculate (exp থেকে)
function expToLevel(exp) {
  if (!exp || exp < 0) return 0;
  return Math.floor((Math.sqrt(1 + (4 * exp) / 3) + 1) / 2);
}

module.exports.config = {
  name: "top",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Mehedi Hasan",
  description: "Top Users / Threads / Money / Level",
  commandCategory: "economy",
  usages: "[thread/user/money/level]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args, Users }) => {
  const { threadID, messageID } = event;
  const data = loadData();
  const option = args[1] && !isNaN(args[1]) && parseInt(args[1]) > 0 ? parseInt(args[1]) : 10;

  // ===================== TOP USERS BY LEVEL =====================
  if (args[0] === "user" || args[0] === "level") {
    let allUsers = Object.entries(data).map(([id, info]) => ({
      userID: id,
      exp: info.exp || 0
    }));

    allUsers.sort((a, b) => b.exp - a.exp);
    let msg = '🏆 Top Users by Level:\n';
    for (let i = 0; i < Math.min(option, allUsers.length); i++) {
      const user = allUsers[i];
      const name = (await Users.getNameUser(user.userID)) || "Unknown";
      msg += `${i + 1}. ${name} - Level ${expToLevel(user.exp)}\n`;
    }
    return api.sendMessage(msg, threadID, messageID);
  }

  // ===================== TOP USERS BY MONEY =====================
  if (args[0] === "money") {
    let allUsers = Object.entries(data).map(([id, info]) => ({
      userID: id,
      money: info.balance || 0
    }));

    allUsers.sort((a, b) => b.money - a.money);
    let msg = '💰 Top Users by Money:\n';
    for (let i = 0; i < Math.min(option, allUsers.length); i++) {
      const user = allUsers[i];
      const name = (await Users.getNameUser(user.userID)) || "Unknown";
      msg += `${i + 1}. ${name} - ${user.money}💵\n`;
    }
    return api.sendMessage(msg, threadID, messageID);
  }

  // ===================== TOP THREADS BY MESSAGES =====================
  if (args[0] === "thread") {
    let threadList = [];
    try {
      const threads = await api.getThreadList(option + 10, null, ["INBOX"]);
      for (const t of threads) {
        if (t.isGroup) {
          threadList.push({
            name: t.name || "No name",
            id: t.threadID,
            messages: t.messageCount
          });
        }
      }
    } catch (e) {
      console.log(e);
      return api.sendMessage("❌ Error fetching threads.", threadID, messageID);
    }

    threadList.sort((a, b) => b.messages - a.messages);
    let msg = `📊 Top ${Math.min(option, threadList.length)} Groups by Messages:\n`;
    threadList.slice(0, option).forEach((t, i) => {
      msg += `${i + 1}. ${t.name}\nTID: [${t.id}]\nMessages: ${t.messages}\n\n`;
    });
    return api.sendMessage(msg, threadID, messageID);
  }

  return api.sendMessage("❌ Invalid option! Use: user / thread / money / level", threadID, messageID);
};
