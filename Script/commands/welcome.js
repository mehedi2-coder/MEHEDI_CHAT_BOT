const moment = require("moment-timezone");

module.exports.config = {
  name: "welcome",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Mehedi Hasan",
  description: "Group welcome message",
  commandCategory: "group",
  usages: "welcome",
  cooldowns: 5
};

const welcomeMessage = `
🌸✨🌸✨🌸✨🌸✨🌸✨🌸✨🌸✨🌸✨🌸
  
💖 স্বাগতম আমাদের গ্রুপে! 💖  

আমাদের পরিবারে আপনাকে পেয়ে আমরা ভীষণ খুশি 🥰  
এখানে সবাই একে অপরকে সম্মান করবে 🙏  
ভালোবাসা, বন্ধুত্ব আর ইতিবাচকতা ছড়িয়ে দিই 💫  

💡 নিয়ম:
✅ ভদ্রভাবে কথা বলুন  
✅ কোনো স্প্যাম নয়  
✅ সকলে একে অপরকে সাহায্য করুন  

আশা করি এখানে আপনার সময় আনন্দময় হবে! 🎉  

🌸✨🌸✨🌸✨🌸✨🌸✨🌸✨🌸✨🌸✨🌸
`;

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body } = event;
  if (!body) return;
  const text = body.trim().toLowerCase();

  if (text === "welcome") {
    return api.sendMessage({ body: welcomeMessage }, threadID, messageID);
  }
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID } = event;
  return api.sendMessage({ body: welcomeMessage }, threadID, messageID);
};
