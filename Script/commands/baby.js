const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "babyDB.json");

// যদি ডাটাবেস ফাইল না থাকে তাহলে নতুন বানিয়ে ফেলবে
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({}));
}

function loadDB() {
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

function saveDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports.config = {
  name: "baby",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Mehedi Hasan",
  description: "Cute AI Baby Chatbot | Talk, Teach, Edit & Remove",
  commandCategory: "simsim",
  usages: "[teach/edit/remove/list/chat]",
  cooldowns: 0,
  prefix: false
};

if (!global.client.handleReply) global.client.handleReply = [];

module.exports.run = async function ({ api, event, args, Users }) {
  try {
    const uid = event.senderID;
    const senderName = await Users.getNameUser(uid);
    const query = args.join(" ").trim().toLowerCase();
    let db = loadDB();

    // যদি কিছু না লেখে
    if (!query) {
      const ran = ["Bolo baby 😘", "হুম জানু, ডাকছো কেনো?"];
      const r = ran[Math.floor(Math.random() * ran.length)];
      return api.sendMessage(r, event.threadID, (err, info) => {
        if (!err) {
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: "simsimi"
          });
        }
      });
    }

    // Remove Command
    if (args[0] === "remove") {
      const parts = query.replace("remove ", "").split(" - ");
      if (parts.length < 2)
        return api.sendMessage("❌ | Use: remove [Question] - [Reply]", event.threadID, event.messageID);

      const [ask, ans] = parts;
      if (db[ask]) {
        db[ask] = db[ask].filter(r => r !== ans);
        if (db[ask].length === 0) delete db[ask];
        saveDB(db);
        return api.sendMessage(`✅ Removed reply "${ans}" from "${ask}"`, event.threadID, event.messageID);
      }
      return api.sendMessage("❌ | No such question found.", event.threadID, event.messageID);
    }

    // List Command
    if (args[0] === "list") {
      let totalQuestions = Object.keys(db).length;
      let totalReplies = Object.values(db).reduce((a, b) => a + b.length, 0);
      return api.sendMessage(
        `🤖 Total Questions Learned: ${totalQuestions}\n💬 Total Replies Stored: ${totalReplies}\n👤 Taught by Users`,
        event.threadID,
        event.messageID
      );
    }

    // Edit Command
    if (args[0] === "edit") {
      const parts = query.replace("edit ", "").split(" - ");
      if (parts.length < 3)
        return api.sendMessage("❌ | Use: edit [Question] - [OldReply] - [NewReply]", event.threadID, event.messageID);

      const [ask, oldReply, newReply] = parts;
      if (db[ask] && db[ask].includes(oldReply)) {
        db[ask] = db[ask].map(r => (r === oldReply ? newReply : r));
        saveDB(db);
        return api.sendMessage(`✅ Edited reply of "${ask}"`, event.threadID, event.messageID);
      }
      return api.sendMessage("❌ | Old reply not found.", event.threadID, event.messageID);
    }

    // Teach Command
    if (args[0] === "teach") {
      const parts = query.replace("teach ", "").split(" - ");
      if (parts.length < 2)
        return api.sendMessage("❌ | Use: teach [Question] - [Reply]", event.threadID, event.messageID);

      const [ask, ans] = parts;
      if (!db[ask]) db[ask] = [];
      db[ask].push(ans);
      saveDB(db);
      return api.sendMessage(`✅ Learned: "${ask}" → "${ans}"`, event.threadID, event.messageID);
    }

    // Chat Mode
    if (db[query]) {
      const replies = db[query];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      return api.sendMessage(randomReply, event.threadID, (err, info) => {
        if (!err) {
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: "simsimi"
          });
        }
      }, event.messageID);
    } else {
      return api.sendMessage("😅 আমাকে এটা এখনো শেখানো হয়নি, please teach me 🥺!", event.threadID, event.messageID);
    }
  } catch (err) {
    console.error(err);
    return api.sendMessage(`❌ | Error in baby command: ${err.message}`, event.threadID, event.messageID);
  }
};

module.exports.handleReply = async function ({ api, event }) {
  try {
    const replyText = event.body ? event.body.toLowerCase() : "";
    if (!replyText) return;

    let db = loadDB();
    if (db[replyText]) {
      const replies = db[replyText];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      api.sendMessage(randomReply, event.threadID, (err, info) => {
        if (!err) {
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: "simsimi"
          });
        }
      }, event.messageID);
    } else {
      api.sendMessage("😅 আমি এটা এখনো শেখানো হয়নি, Please teach me 🥺!", event.threadID, event.messageID);
    }
  } catch (err) {
    console.error(err);
    return api.sendMessage(`❌ | Error in handleReply: ${err.message}`, event.threadID, event.messageID);
  }
};

