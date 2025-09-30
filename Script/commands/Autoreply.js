const fs = global.nodemodule["fs-extra"];
const path = global.nodemodule["path"];

module.exports.config = {
  name: "autoreplybot",
  version: "6.0.2",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐡𝐚𝐝𝐚𝐭 𝐈𝐬𝐥𝐚𝐦",
  description: "Auto-response bot with specified triggers",
  commandCategory: "No Prefix",
  usages: "[any trigger]",
  cooldowns: 3,
};

module.exports.handleEvent = async function ({ api, event, Users }) {
  const { threadID, messageID, senderID, body } = event;
  if (!body) return; 
  const name = await Users.getNameUser(senderID);
  const msg = body.toLowerCase().trim();

  const responses = {
    "miss you": "অরেক বেডারে Miss না করে xan মেয়ে হলে বস মেহেদীর জিএফ হয়ে যাও😶👻😘",
    "kiss de": "কিস দিবো না তোর মুখে দূর গন্ধ কয়দিন ধরে দাঁত ব্রাশ করিস নাই🤬",
    "👍": "সর এখান থেকে লাইকার আবাল..!🐸🤣👍⛏️",
    "help": "Prefix de sala",
    "hi": "Assalamu Alaikum 💝✨",
    "😘": "কিস আমার মেহেদী বসকে দাও😘🥰",
    "help me": "বলো তোমাকে কীভাবে সহযোগিতা করতে পারি?",
    "bc": "SAME TO YOU😊",
    "pro": "Khud k0o KYa LeGend SmJhTi Hai 😂",
    "good morning": "GOOD MORNING দাত ব্রাশ করে খেয়ে নেও😚",
    "tor bal": "~ এখনো বাল উঠে নাই নাকি তোমার?? 🤖",
    "mehedi": "উনি এখন কাজে বিজি আছে কি বলবেন আমাকে বলতে পারেন..!😘",
    "owner": "‎[𝐎𝐖𝐍𝐄𝐑:☞ Mehedi Hasan☜\nFacebook: https://www.facebook.com/profile.php?id=100089044681685\nWhatsApp: +8801957837541",
    "admin": "He is 𝐌𝐞𝐡𝐞𝐝𝐢 তাকে সবাই Cyber King Mehedi নামেই চিনে😘☺️",
    "apa": "এ তো হাছিনা হে মেরে দিলকি দারকান হে মেরি জান হে😍.",
    "chup": "তুই চুপ কর পাগল ছাগল",
    "assalamualaikum": "وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ 💖",
    "Assalamu alaikum": "Walaikumussalam",
    "Tumar boss ke": "Mehedi amr boss 😘🥰",
    "kiss me": "তুমি পঁচা তোমাকে কিস দিবো না 🤭",
    "thanks": "এতো ধন্যবাদ না দিয়ে আমার বস মেহেদী কে তোর গার্লফ্রেন্ড টা দিয়ে দে..!🐸🥵",
    "i love you": "মেয়ে হলে আমার বস মেহেদীর ইনবক্সে এখুনি গুঁতা দিন🫢😻",
    "bye": "কিরে তুই কই যাস কোন মেয়ের সাথে চিপায় যাবি..!🌚🌶️",
    "ami mehedi": "হ্যা বস কেমন আছেন..?☺️",
    "bot er baccha": "আমার বাচ্চা তো তোমার গার্লফ্রেন্ডের পেটে..!!🌚⛏️",
    "tor nam ki": "MY NAME IS ─꯭─⃝‌‌𝐌𝐢𝐦 𝐈𝐬𝐥𝐚𝐦💖",
    "pic de": "এন থেকে সর দুরে গিয়া মর😒",
    "cudi": "এত চোদা চুদি করস কেনো..!🥱🌝🌚",
    "bal": "রাগ করে না সোনা পাখি 🥰",
    "heda": "এতো রাগ শরীরের জন্য ভালো না 🥰",
    "boda": "ভাই তুই এত হাসিস না..!🌚🤣",
    "🤣": "ভাই তুই এত হাসিস না হাসলে তোরে চোরের মতো লাগে 🤣🌚",
    "😡": "টমেটোর মতো লাল হয়ে আছোস কেন বউ মারছে?🤣🥵",
    "হাই": "আসসালামু আলাইকুম 🥰✨",
    "আসসালামু আলাইকুম": "ওয়ালাইকুমুস সালাম ✨💌",
    "Good Night": "Good Night bby 😘🌃",
    "love you": "ভালোবাসা নামক আবলামী করতে চাইলে Boss মেহেদীর ইনবক্সে গুতা দিন 😘",
    "kire ki koros": "তোমার কথা ভাবতেছি জানু",
    "kire bot": "হ্যাঁ জান কেমন আছেন আপনার ওই খানে উম্মাহহ 😘😽🙈"
  };

  if (responses[msg]) {
    return api.sendMessage(responses[msg], threadID, messageID);
  }
};

module.exports.run = async function ({ api, event, args, Users }) {
  return this.handleEvent({ api, event, Users });
};
