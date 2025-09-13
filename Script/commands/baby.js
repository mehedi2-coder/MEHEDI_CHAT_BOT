const axios = require("axios");
const simsim = "https://simsimi.cyberbot.top";

module.exports.config = {
 name: "baby",
 version: "1.0.3",
 hasPermssion: 0,
 credits: "ULLASH",
 description: "Cute AI Baby Chatbot | Talk, Teach & Chat with Emotion ☢️",
 commandCategory: "simsim",
 usages: "[message/query]",
 cooldowns: 0,
 prefix: false
};

module.exports.run = async function ({ api, event, args, Users }) {
 try {
 const uid = event.senderID;
 const senderName = await Users.getNameUser(uid);
 const query = args.join(" ").toLowerCase();

 if (!query) {
 const ran = ["Bolo baby", "Hmm bolo", "Hmm ki bolba bolo", "Ami achi jan bolo", "Hea Baby" ];
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

 if (["remove", "rm"].includes(args[0])) {
 const parts = query.replace(/^(remove|rm)\s*/, "").split(" - ");
 if (parts.length < 2)
 return api.sendMessage(" | Use: remove [Question] - [Reply]", event.threadID, event.messageID);

 const [ask, ans] = parts;
 const res = await axios.get(`${simsim}/delete?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}`);
 return api.sendMessage(res.data.message, event.threadID, event.messageID);
 }

 if (args[0] === "list") {
 const res = await axios.get(`${simsim}/list`);
 if (res.data.code === 200) {
 return api.sendMessage(
 `♾ Total Questions Learned: ${res.data.totalQuestions}\n★ Total Replies Stored: ${res.data.totalReplies}\n☠︎︎ Developer: ${res.data.author}`,
 event.threadID,
 event.messageID
 );
 } else {
 return api.sendMessage(`Error: ${res.data.message || "Failed to fetch list"}`, event.threadID, event.messageID);
 }
 }

 if (args[0] === "edit") {
 const parts = query.replace("edit ", "").split(" - ");
 if (parts.length < 3)
 return api.sendMessage(" | Use: edit [Question] - [OldReply] - [NewReply]", event.threadID, event.messageID);

 const [ask, oldReply, newReply] = parts;
 const res = await axios.get(`${simsim}/edit?ask=${encodeURIComponent(ask)}&old=${encodeURIComponent(oldReply)}&new=${encodeURIComponent(newReply)}`);
 return api.sendMessage(res.data.message, event.threadID, event.messageID);
 }

 if (args[0] === "teach") {
 const parts = query.replace("teach ", "").split(" - ");
 if (parts.length < 2)
 return api.sendMessage(" | Use: teach [Question] - [Reply]", event.threadID, event.messageID);

 const [ask, ans] = parts;
 const res = await axios.get(`${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderID=${uid}&senderName=${encodeURIComponent(senderName)}`);
 return api.sendMessage(`${res.data.message || "Reply added successfully!"}`, event.threadID, event.messageID);
 }

 const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`);
 const responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response];

 for (const reply of responses) {
 await new Promise((resolve) => {
 api.sendMessage(reply, event.threadID, (err, info) => {
 if (!err) {
 global.client.handleReply.push({
 name: module.exports.config.name,
 messageID: info.messageID,
 author: event.senderID,
 type: "simsimi"
 });
 }
 resolve();
 }, event.messageID);
 });
 }
 } catch (err) {
 console.error(err);
 return api.sendMessage(`| Error in baby command: ${err.message}`, event.threadID, event.messageID);
 }
};

module.exports.handleReply = async function ({ api, event, Users, handleReply }) {
 try {
 const senderName = await Users.getNameUser(event.senderID);
 const replyText = event.body ? event.body.toLowerCase() : "";
 if (!replyText) return;

 const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(replyText)}&senderName=${encodeURIComponent(senderName)}`);
 const responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response];

 for (const reply of responses) {
 await new Promise((resolve) => {
 api.sendMessage(reply, event.threadID, (err, info) => {
 if (!err) {
 global.client.handleReply.push({
 name: module.exports.config.name,
 messageID: info.messageID,
 author: event.senderID,
 type: "simsimi"
 });
 }
 resolve();
 }, event.messageID);
 }
 );
 }
 } catch (err) {
 console.error(err);
 return api.sendMessage(` | Error in handleReply: ${err.message}`, event.threadID, event.messageID);
 }
};

module.exports.handleEvent = async function ({ api, event, Users }) {
 try {
 const raw = event.body ? event.body.toLowerCase().trim() : "";
 if (!raw) return;
 const senderName = await Users.getNameUser(event.senderID);
 const senderID = event.senderID;

 if (
 raw === "baby" || raw === "bot" || raw === "bby" ||
 raw === "jan" || raw === "xan" || raw === "জান" || raw === "বট" || raw === "বেবি"
 ) {
 const greetings = [
`╭•┄┅═══❁🌺❁═══┅┄•╮

✦❝ اَلْـحَمْـدُ لله ❞✦  
🌙 সব প্রশংসা কেবল আল্লাহর জন্য 🕋✨  

╰•┄┅═══❁🌺❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁🌸❁═══┅┄•╮

☪️❝ صبر করো ❞  
🌸 আল্লাহ ধৈর্যশীলদের সাথে আছেন 💫🕊️  

╰•┄┅═══❁🌸❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁🕌❁═══┅┄•╮

🕌 আল্লাহর উপর ভরসা রাখো 🕌  
✦ কারণ তিনিই সর্বশ্রেষ্ঠ পরিকল্পনাকারী 🔮🌙  

╰•┄┅═══❁🕌❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁💖❁═══┅┄•╮

💖❝ দুনিয়া সাময়িক ❞💖  
🌙 কিন্তু আখিরাত চিরস্থায়ী 🕋✨  

╰•┄┅═══❁💖❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁🕋❁═══┅┄•╮

🕋❝ নামাজ জান্নাতের চাবি ❞ 🔑  
💫 তাই সালাতকে কখনো অবহেলা করো না 🌸  

╰•┄┅═══❁🕋❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁🌸❁═══┅┄•╮

🌸❝ যিকিরে আছে অন্তরের শান্তি ❞ 🌸  
🕊️ “𝐀𝐥𝐚𝐚 𝐛𝐢𝐳𝐢𝐤𝐫𝐢𝐥𝐥𝐚𝐡𝐢 𝐭𝐚𝐭𝐦𝐚’𝐢𝐧𝐧𝐮𝐥 𝐪𝐮𝐥𝐨𝐨𝐛” 🖤✨  

╰•┄┅═══❁🌸❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁🤍❁═══┅┄•╮

🤍❝ যারা আল্লাহকে ভালোবাসে ❞🤍  
🌙 আল্লাহও তাদের ভালোবাসেন 💫🕋  

╰•┄┅═══❁🤍❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁✨❁═══┅┄•╮

✨❝ দুনিয়া হলো পরীক্ষা ❞✨  
🕌 আখিরাত হলো পুরস্কার 🌸🌙  

╰•┄┅═══❁✨❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁🌙❁═══┅┄•╮

🌙❝ যারা সালাত ধরে রাখে ❞ 🌙  
💖 আল্লাহ তাদের জীবন সুন্দর করেন 🕊️💫  

╰•┄┅═══❁🌙❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁💫❁═══┅┄•╮

💫❝ 𝐓𝐚𝐪𝐰𝐚 𝐢𝐬 𝐭𝐡𝐞 𝐛𝐞𝐬𝐭 𝐠𝐢𝐟𝐭 ❞💫  
🕋 তোমার হৃদয়ের জন্য সর্বোত্তম উপহার 🌸✨  

╰•┄┅═══❁💫❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁🕋❁═══┅┄•╮

🕋❝ লা ইলাহা ইল্লাল্লাহ ❞ 🌙  
✨ এটাই হলো মুক্তির চাবি 🔑  

╰•┄┅═══❁🕋❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁🌸❁═══┅┄•╮

🌸❝ দোয়া মুমিনের অস্ত্র ❞ 🌸  
💫 তাই বেশি বেশি দোয়া করো 🤲  

╰•┄┅═══❁🌸❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁☪️❁═══┅┄•╮

☪️❝ আল্লাহর কাছে ক্ষমা চাও ❞  
🌙 তিনি গাফুরুর রাহিম 🕊️  

╰•┄┅═══❁☪️❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁📖❁═══┅┄•╮

🕌❝ কুরআন হলো জীবন আলো ❞ 📖  
💖 প্রতিদিন কুরআন পড়ো ✨  

╰•┄┅═══❁📖❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁🌙❁═══┅┄•╮

🌙❝ যারা রমজান পূর্ণ করে ❞ 🌙  
🕋 আল্লাহ তাদের জন্য জান্নাত রেখেছেন 💫  

╰•┄┅═══❁🌙❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁👑❁═══┅┄•╮

💖❝ 𝐇𝐢𝐣𝐚𝐛 𝐢𝐬 𝐦𝐲 𝐜𝐫𝐨𝐰𝐧 ❞ 👑  
🌸 আর হায়া আমার সৌন্দর্য 🌙  

╰•┄┅═══❁👑❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁🕊️❁═══┅┄•╮

🕊️❝ যারা হারাম থেকে বেঁচে যায় ❞  
🌸 আল্লাহ তাদের জন্য হালাল সহজ করেন ✨  

╰•┄┅═══❁🕊️❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁🤱❁═══┅┄•╮

🌙❝ জান্নাত মায়ের পায়ের নিচে ❞ 🤍  
🕋 তাই মায়ের খেদমত করো 🌸  

╰•┄┅═══❁🤱❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁🌎❁═══┅┄•╮

💫❝ الدنيا سجن المؤمن ❞ 🌙  
🕊️ দুনিয়া মুমিনের জন্য কারাগার ✨  

╰•┄┅═══❁🌎❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁⚰️❁═══┅┄•╮

🕌❝ মৃত্যুই চূড়ান্ত সত্য ❞ 💫  
🌸 তাই আখিরাতের জন্য প্রস্তুত হও 🤍  

╰•┄┅═══❁⚰️❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁💚❁═══┅┄•╮

🌙❝ যারা আল্লাহকে ভয় করে ❞ 🌙  
🕋 তাদের জন্য জান্নাত নির্দিষ্ট 💫  

╰•┄┅═══❁💚❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁🌟❁═══┅┄•╮

💖❝ 𝐒𝐮𝐧𝐧𝐚𝐡 হলো আলো ❞ 🌸  
✨ যে অনুসরণ করে 
সে কখনো অন্ধকারে হারাবে না 🕊️  

╰•┄┅═══❁🌟❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁🤲❁═══┅┄•╮

🕌❝ আল্লাহর রহমত অসীম ❞ ✨  
🌸 হতাশ হয়ো না, তিনি ক্ষমাশীল 💫  

╰•┄┅═══❁🤲❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁🌹❁═══┅┄•╮

🌹❝ আল্লাহর রহমত সবকিছুর উপরে ❞  
🕊️ তার দয়া কখনো সীমিত নয় ✨  

╰•┄┅═══❁🌹❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁🕯️❁═══┅┄•╮

🕯️❝ প্রতিটি দিন হলো নতুন সুযোগ ❞  
🌙 আল্লাহর পথে চলার জন্য 💫  

╰•┄┅═══❁🕯️❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁🌼❁═══┅┄•╮

🌼❝ যে আল্লাহকে স্মরণ করে ❞  
🕋 তার হৃদয় শান্তি পায় 💖  

╰•┄┅═══❁🌼❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁🌟❁═══┅┄•╮

🌟❝ জান্নাত প্রস্তুতির শুরু ❞  
🌸 হলো নামাজ, দোয়া ও ভালো কাজ 💫  

╰•┄┅═══❁🌟❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁🦋❁═══┅┄•╮

🦋❝ আল্লাহর পথে ছোট পদক্ষেপ ❞  
🌙 একদিন বড় ফল দেবে ✨  

╰•┄┅═══❁🦋❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁💐❁═══┅┄•╮

💐❝ দোয়া হলো মুমিনের শক্তি ❞  
🕊️ প্রতিদিন দোয়া করতে ভুলবেন না 🌸  

╰•┄┅═══❁💐❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁🌷❁═══┅┄•╮

🌷❝ আল্লাহর প্রেমে জীবন সুন্দর ❞  
💖 তার প্রতি বিশ্বাস রাখো 🌙  

╰•┄┅═══❁🌷❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁🌸❁═══┅┄•╮

🌸❝ যারা ধৈর্য রাখে ❞  
🕋 আল্লাহ তাদের পুরস্কৃত করেন 💫  

╰•┄┅═══❁🌸❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁💫❁═══┅┄•╮

💫❝ জান্নাত ধৈর্যশীলদের জন্য ❞  
🕊️ তাই সব সময় ধৈর্য ধরে চলো 🌙  

╰•┄┅═══❁💫❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁🌼❁═══┅┄•╮

🌼❝ কুরআন হলো জীবনকথা ❞  
📖 প্রতিদিন কিছু পড়া জরুরি ✨  

╰•┄┅═══❁🌼❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁🌹❁═══┅┄•╮

🌹❝ আল্লাহর স্মরণে আছে শান্তি ❞  
🕊️ হৃদয় জুড়ে নীরব আনন্দ 💫  

╰•┄┅═══❁🌹❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`,

`╭•┄┅═══❁🕯️❁═══┅┄•╮

🕯️❝ যে আল্লাহর পথ চায় ❞  
🌙 আল্লাহ তাকে সঠিক পথ দেখান 💖  

╰•┄┅═══❁🕯️❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨«—•`
];

// Random images (hosted on imgur)
  const images = [ 
"https://i.imgur.com/o6OwL71.jpeg",
"https://i.imgur.com/j8KWJPc.jpeg",
"https://i.imgur.com/1tzl381.jpeg",
"https://i.imgur.com/pT2UUe1.jpeg",
"https://i.imgur.com/aWWU13H.jpeg",
"https://i.imgur.com/bi0UsSd.jpeg",
"https://i.imgur.com/shHv3vC.jpeg,
"https://i.imgur.com/xaOUdda.jpeg",
"https://i.imgur.com/JOF3gpS.jpeg",
"https://i.imgur.com/QaUCNjc.jpeg",
"https://i.imgur.com/cIsK2mt.jpeg",
"https://i.imgur.com/BzP5GLE.jpeg",
"https://i.imgur.com/Om8CmHX.jpeg",
"https://i.imgur.com/l5ANMhc.jpeg",
"https://i.imgur.com/YJst2oE.jpeg",
"https://i.imgur.com/WEX0spX.jpeg",
"https://i.imgur.com/Ebo7j4c.jpeg",
"https://i.imgur.com/AG1JLAH.jpeg",
"https://i.imgur.com/rnYShxr.jpeg",
"https://i.imgur.com/K7V8iZo.jpeg",
"https://i.imgur.com/gdVPT1p.jpeg",
"https://i.imgur.com/qicdVc4.jpeg",
"https://i.imgur.com/CPxLab9.jpeg",
"https://i.imgur.com/1Y6MiXz.jpeg",
"https://i.imgur.com/NmLzcBc.jpeg"
];
  
 const randomReply = greetings[Math.floor(Math.random() * greetings.length)];

 const mention = {
 body: `${randomReply} @${senderName}`,
 mentions: [{
 tag: `@${senderName}`,
 id: senderID
 }]
 };

 return api.sendMessage(mention, event.threadID, (err, info) => {
 if (!err) {
 global.client.handleReply.push({
 name: module.exports.config.name,
 messageID: info.messageID,
 author: event.senderID,
 type: "simsimi"
 });
 }
 }, event.messageID);
 }

 if (
 raw.startsWith("baby ") || raw.startsWith("bot ") || raw.startsWith("bby ") ||
 raw.startsWith("jan ") || raw.startsWith("xan ") ||
 raw.startsWith("জান ") || raw.startsWith("বট ") || raw.startsWith("বেবি ")
 ) {
 const query = raw
 .replace(/^baby\s+|^bot\s+|^bby\s+|^jan\s+|^xan\s+|^জান\s+|^বট\s+|^বেবি\s+/i, "")
 .trim();
 if (!query) return;

 const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`);
 const responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response];

 for (const reply of responses) {
 await new Promise((resolve) => {
 api.sendMessage(reply, event.threadID, (err, info) => {
 if (!err) {
 global.client.handleReply.push({
 name: module.exports.config.name,
 messageID: info.messageID,
 author: event.senderID,
 type: "simsimi"
 });
 }
 resolve();
 }, event.messageID);
 });
 }
 }
 } catch (err) {
 console.error(err);
 return api.sendMessage(`| Error in handleEvent: ${err.message}`, event.threadID, event.messageID);
 }
};
