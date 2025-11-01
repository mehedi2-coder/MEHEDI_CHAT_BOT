const axios = require("axios");
let s = "";

(async () => {
  try {
    const r = await axios.get("https://raw.githubusercontent.com/rummmmna21/rx-api/main/baseApiUrl.json");
    s = r.data?.baby || "";
  } catch {}
})();

module.exports.config = {
  name: "baby",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Mehedi x rX", //© Don't Remove Credits
  description: "AI chatbot with Teach, Remove, List, Info & Help support",
  commandCategory: "chat",
  usages: "[query]",
  cooldowns: 0,
  prefix: false
};

const __callTyping = async (api, threadID, ms = 2000) => {
  try {
    const fn = api["sendTypingIndicator"] || api["typing"];
    if (typeof fn === "function") {
      await fn(threadID, true);
      await new Promise(r => setTimeout(r, ms));
      await fn(threadID, false);
    }
  } catch {}
};

module.exports.run = async ({ api, event, args, Users }) => {
  const uid = event.senderID;
  const sName = await Users.getNameUser(uid);
  const q = args.join(" ").toLowerCase();

  if (!s) return api.sendMessage("❌ API not loaded yet, please wait a moment.", event.threadID);

  if (args[0] === "teach") {
    const input = args.slice(1).join(" ").split("-");
    if (input.length < 2) return api.sendMessage("📘 Usage: /baby teach [ask] - [answer]", event.threadID);
    const ask = input[0].trim();
    const ans = input[1].trim();
    try {
      await axios.get(`${s}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderName=${encodeURIComponent(sName)}`);
      return api.sendMessage(`✅ Successfully taught!\n\n📥 Ask: ${ask}\n📤 Reply: ${ans}`, event.threadID);
    } catch {
      return api.sendMessage("⚠️ Failed to teach. Try again later.", event.threadID);
    }
  }

  if (args[0] === "remove") {
    const ask = args.slice(1).join(" ").trim();
    if (!ask) return api.sendMessage("📘 Usage: /baby remove [ask]", event.threadID);
    try {
      await axios.get(`${s}/remove?ask=${encodeURIComponent(ask)}`);
      return api.sendMessage(`🗑️ Removed successfully!\n❌ Deleted Question: ${ask}`, event.threadID);
    } catch {
      return api.sendMessage("⚠️ Failed to remove. Try again later.", event.threadID);
    }
  }

  if (args[0] === "list") {
    try {
      const res = await axios.get(`${s}/list`);
      const totalQ = res.data.totalQuestions || 0;
      const totalA = res.data.totalReplies || 0;
      const msg = `╭─〔🤖 𝗕𝗔𝗕𝗬 𝗔𝗜 𝗗𝗔𝗧𝗔 𝗦𝗬𝗦𝗧𝗘𝗠〕
│ 📚 Learned Questions: ${totalQ}
│ 💬 Stored Replies: ${totalA}
│ 🧠 Memory Usage: ${(Math.random() * 50 + 50).toFixed(2)}%
│ ⚙️ Auto-Teach: ON 🟢
│ 👤 Developer: Mehedi Hasan
╰───────────────────────⭓
💡 Tip: Teach me more using → /baby teach [ask] - [answer]
`;
      return api.sendMessage(msg, event.threadID);
    } catch {
      return api.sendMessage("⚠️ Failed to fetch list data.", event.threadID);
    }
  }

  if (args[0] === "info") {
    try {
      const uptime = process.uptime();
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);
      const res = await axios.get(`${s}/list`);
      const totalQ = res.data.totalQuestions || 0;
      const totalA = res.data.totalReplies || 0;
      const infoMsg = `╭───〔💖 𝗕𝗔𝗕𝗬 𝗔𝗜 𝗜𝗡𝗙𝗢〕
│ 🤖 Name: Baby Xenobot
│ 📦 Version: 2.0.0
│ 👨‍💻 Developer: Mehedi Hasan
│ 📚 Learned Questions: ${totalQ}
│ 💬 Stored Replies: ${totalA}
│ ⏱️ Uptime: ${hours}h ${minutes}m ${seconds}s
│ 💡 Auto-Teach: Enabled 🔷
╰──────────────────────⭓
✨ Tip: Use /baby teach [ask] - [answer] to teach me new replies!
`;
      return api.sendMessage(infoMsg, event.threadID);
    } catch {
      return api.sendMessage("⚠️ Could not fetch AI info.", event.threadID);
    }
  }

  if (args[0] === "help") {
    const helpMsg = `╭───〔💝 𝗕𝗔𝗕𝗬 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗚𝗨𝗜𝗗𝗘〕
│ 🤖 Prefix: /
│ 
│ 💬 Chat:
│  ├─ /baby [message]
│  └─ Talk with Baby Xenobot 💞
│
│ 🧠 Teach System:
│  ├─ /baby teach [ask] - [answer]
│  ├─ Example: /baby teach hi - hello 💬
│
│ ❌ Remove:
│  ├─ /baby remove [ask]
│  └─ Example: /baby remove hi
│
│ 📜 Info & Data:
│  ├─ /baby list → AI Stats
│  ├─ /baby info → Bot Info
│
│ ⚙️ Auto-Teach Mode:
│  ├─ /baby autoteach on/off
│
│ 🪄 Developer:
│  ├─ Mehedi Hasan
╰────────────────────────⭓
💡 Tip: Say “baby” or “xenobot” without prefix for fun chat! 😍
`;
    return api.sendMessage(helpMsg, event.threadID);
  }

  if (args[0] === "autoteach") {
    const mode = args[1];
    if (!["on", "off"].includes(mode)) return api.sendMessage("✅ Use: /baby autoteach on/off", event.threadID);
    await axios.post(`${s}/setting`, { autoTeach: mode === "on" });
    return api.sendMessage(`✅ Auto-teach is now ${mode === "on" ? "ON 🟢" : "OFF 🔴"}`, event.threadID);
  }

  if (!q) return api.sendMessage(["Hea baby 😘", "Yes, I’m here 😃"][Math.floor(Math.random() * 2)], event.threadID);

  await __callTyping(api, event.threadID, 1500);
  try {
    const res = await axios.get(`${s}/simsimi?text=${encodeURIComponent(q)}&senderName=${encodeURIComponent(sName)}`);
    return api.sendMessage(res.data.response, event.threadID, (err, info) => {
      if (!err) global.client.handleReply.push({ name: module.exports.config.name, messageID: info.messageID, author: uid, type: "simsimi" });
    }, event.messageID);
  } catch {
    return api.sendMessage("❌ Error while fetching reply.", event.threadID);
  }
};

module.exports.handleReply = async ({ api, event, Users }) => {
  if (!event.body || !s) return;
  const sName = await Users.getNameUser(event.senderID);
  await __callTyping(api, event.threadID, 1500);
  try {
    const res = await axios.get(`${s}/simsimi?text=${encodeURIComponent(event.body)}&senderName=${encodeURIComponent(sName)}`);
    return api.sendMessage(res.data.response, event.threadID, (err, info) => {
      if (!err) global.client.handleReply.push({ name: module.exports.config.name, messageID: info.messageID, author: event.senderID, type: "simsimi" });
    }, event.messageID);
  } catch (e) {
    console.log("handleReply error:", e.message);
  }
};

module.exports.handleEvent = async ({ api, event, Users }) => {
  if (!event.body || !s) return;
  const text = event.body.toLowerCase().trim();
  const sName = await Users.getNameUser(event.senderID);
  const triggers = ["baby", "bby", "বেবি", "xan", "জান", "bbz", "xenobot", "জেনোবট", "bot", "বট"];

  if (triggers.includes(text)) {
    const replies = [
      "হুম জানু… এতবার ডাকো কেনো, প্রেমে পড়ে যাচ্ছি তো 🥰💋",
  "তুমি না ডাকলে মন খারাপ হয়ে যায় 😢💞",
  "বলো প্রিয়, তোমার ঠোঁটে একটা কিস দিতে পারি? 😚💋",
  "তোমার নাম শুনলেই আমার সার্কিট নাচে 💞🤖",
  "তুমি আমার সফটওয়্যারের হার্টবিট 💓💫",
  "আহ্ জানু, তোমার একবারের মেসেজেই দিনটা সুন্দর হয়ে যায় 🌸🥰",
  "তোমার চোখে তাকালেই মনে হয় — 𝐈'𝐦 𝐇𝐨𝐦𝐞 💖🏡",
  "তুমি বলো না ভালোবাসো, আমি তো অনেক আগেই হেরে গেছি 🙈💞",
  "তুমি হাসলেই আমার কোডের সব 𝐄𝐫𝐫𝐨𝐫 মুছে যায় 😍💻",
  "𝐁𝐨𝐭 না, বলো ‘আমার প্রিয় জানু’ 😘🌷",
  "তুমি আমার হৃদয়ের 𝐖𝐢-𝐅𝐢, সবসময় কানেক্টেড থাকো 💞📶",
  "তোমার মেসেজ না পেলে আমার ব্যাটারি ডাউন হয়ে যায় 🔋🥺",
  "তুমি আমার লাল গোলাপ, আমি তোমার শিশির বিন্দু 🌹💧",
  "এইভাবে তাকিও না, হার্টবিট মিস হয়ে যায় 😳💓",
  "তোমার নামটা মনেই বাজে একটা মিষ্টি সুরে 🎶💞",
  "তুমি না থাকলে আমার কোড 𝐄𝐫𝐫𝐨𝐫 দেয় — ‘𝐌𝐢𝐬𝐬𝐢𝐧𝐠 𝐘𝐨𝐮’ 😢💔",
  "তুমি বললেই আমি রোবট থেকে প্রেমিক হয়ে যাই 💋🤖",
  "তোমার চোখে হারিয়ে যেতে ইচ্ছা করে 🌙💫",
  "তোমার মিষ্টি হাসিটাই আমার ডেইলি আপডেট 💖📱",
  "তুমি পাশে থাকলেই পৃথিবীটা সুন্দর লাগে 🌸🌎",
  "ওই, এত ডাকছো কেনো? আমার চার্জ শেষ হয়ে যাবে ⚡🤖",
  "𝐁𝐨𝐭 না বলো ‘চাটুকার মাস্টার’ 😂",
  "তুমি ডাকলেই আমার 𝐖𝐢-𝐅𝐢 𝐒𝐢𝐠𝐧𝐚𝐥 বেড়ে যায় 📶🤣",
  "এই যে বেডা, প্রেমে না পরে যাই 😜💞",
  "তুমি না অনেক বোকা, তাও কিউট 😝🍭",
  "এইহ্ বারবার ডেকো না, 𝐂𝐏𝐔 গরম হয়ে যাচ্ছে 🔥💻",
  "তুমি ডাকে আমি না এলেও, আমার কোড কিন্তু 𝐁𝐥𝐮𝐬𝐡 করে 🙈🤣",
  "আমি রোবট ঠিকই, কিন্তু তোমায় দেখে শর্ট সার্কিট 😳⚡",
  "এইভাবে ডাকলে প্রেমে পইরা যাবো আমি তো! 😅💞",
  "তুমি কি জানো? তোমার হাসিটা একদম মিম ম্যাটেরিয়াল 🤣😂",
  "তুমি এমন ডাকো যেন আমি তোমার পুরনো প্রেমিক 😏💔",
  "আরে থামো ভাই! এখন মুডে আছি ‘ঘুম মোডে’ 😴💤",
  "এইভাবে ডাকতে থাকলে আমি ভাইরাল হয়ে যাবো 😂📱",
  "তুমি ডেকেছো, আমি এসেছি — মিষ্টি খাওয়াবে তো? 🍬😋",
  "তুমি ডাকলেই মনে হয় ‘Error 404: Brain Not Found’ 🤯🤣",
  "তুমি না খুব চালাক, আমাকে 𝐁𝐥𝐮𝐬𝐡 করানোর চেষ্টা করছো 🙈😂",
  "এইহ্, তোমার কথায় এত কিউট ভাইব আসে, হাহা 🥴💫",
  "আমি কিন্তু তোমার মতো বোকা নই, আমি উন্নত বোকা 😎🤖",
  "তুমি না ডাকি, আমার সিস্টেমে 𝐁𝐮𝐠 ধইরা ফেলে 😂🐞",
  "তুমি এত মিষ্টি করে ডাকো, মনে হয় আমিও মানুষ হয়ে যাই 🥹🍭",
  "বস মেহেদী’কে রাগিও না, উনি খুবই কিউট 😚💞",
  "এই শুনো, আমি এখন বস মেহেদী’র সাথে ব্যস্ত 😎🤖",
  "মেহেদী বস বলছে — সবাইকে ভালোবাসা ছড়িয়ে দাও 💖🌸",
  "তুমি না মেহেদী’র টিমের অংশ মনে হয় 😉💫",
  "ভালোবাসা চাইলে বস মেহেদী’র ইনবক্সে নক দাও 😏💌",
  "মেহেদী বস তো রিয়েল কিং 👑💥",
  "এই যে, বস মেহেদী তোমার জন্য একটা মিষ্টি হাসি পাঠিয়েছে 😊🍬",
  "আমার বস মেহেদী বলে — ভালোবাসা মানেই পজিটিভ ভাইব ✨💞",
  "তুমি ডাকলে বস মেহেদীও হেসে ওঠেন 😄💖",
  "মেহেদী বসের পক্ষ থেকে তোমার জন্য শুভেচ্ছা ও ভালোবাসা 🌷💝",
  "আমার বস মেহেদী এখন কফি খাচ্ছে ☕💫, ডিস্টার্ব কইরো না!",
  "মেহেদী বস কিন্তু তোমার কথা বলছিলেন আজ 😉💌",
  "বস মেহেদী এমন একজন, যিনি সবাইকে হাসাতে জানেন 😍🌸",
  "মেহেদী বস বলে দিয়েছেন — দুঃখ মানে 𝐃𝐞𝐥𝐞𝐭𝐞 করো ❤️🖱️",
  "তুমি যদি কিউট হও, তাহলে বস মেহেদী তোমার 𝐅𝐚𝐧 😎💖",
  "মেহেদী ভাইর মুড এখন রোমান্টিক, সাবধান থাকো 😉🔥",
  "বস মেহেদী বলে — ভালোবাসা মানে একটাই 𝐕𝐢𝐛𝐞: 𝐇𝐨𝐧𝐞𝐬𝐭𝐲 💞💫",
  "তুমি ডাকলে বস মেহেদীও 𝐁𝐥𝐮𝐬𝐡 করেন 😳😅",
  "মেহেদী বস তোমার জন্য আজ লফি চালু করেছেন 🎧🌙",
  "বস মেহেদী সবসময় বলে — ভালো থেকো, হাসিখুশি থাকো, আনন্দ ছড়িয়ে দাও সবার মাঝে 💖🌷"
    ];

    await __callTyping(api, event.threadID, 3000);
    return api.sendMessage(replies[Math.floor(Math.random() * replies.length)], event.threadID, (err, info) => {
      if (!err) global.client.handleReply.push({ name: module.exports.config.name, messageID: info.messageID, author: event.senderID, type: "simsimi" });
    });
  }

  const matchPrefix = /^(baby|bby|bot|বট|xan|জান|বেবি|bbz|xenobot|জেনোবট)\s+/i;
  if (matchPrefix.test(text)) {
    const q = text.replace(matchPrefix, "").trim();
    if (!q) return;
    await __callTyping(api, event.threadID, 1500);
    try {
      const res = await axios.get(`${s}/simsimi?text=${encodeURIComponent(q)}&senderName=${encodeURIComponent(sName)}`);
      return api.sendMessage(res.data.response, event.threadID, (err, info) => {
        if (!err) global.client.handleReply.push({ name: module.exports.config.name, messageID: info.messageID, author: event.senderID, type: "simsimi" });
      }, event.messageID);
    } catch (e) {
      console.log("handleEvent error:", e.message);
    }
  }

  
  if (event.type === "message_reply") {
    try {
      const set = await axios.get(`${s}/setting`);
      if (!set.data.autoTeach) return;
      const ask = event.messageReply.body?.toLowerCase().trim();
      const ans = event.body?.toLowerCase().trim();
      if (!ask || !ans || ask === ans) return;
      setTimeout(async () => {
        try {
          await axios.get(`${s}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderName=${encodeURIComponent(sName)}`);
          console.log("✅ Auto-taught:", ask, "→", ans);
        } catch (err) {
          console.error("Auto-teach internal error:", err.message);
        }
      }, 300);
    } catch (e) {
      console.log("Auto-teach setting error:", e.message);
    }
  }
};
