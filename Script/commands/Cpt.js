const fs = require("fs-extra");
const axios = require("axios");
const request = require("request");

module.exports.config = {
  name: "\n", // command name (still blank)
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Mehedi Hasan",
  description: "🌸Assalamu Alaikum 🌸\n\n🌺 Thanks you so much for using Mehedi Hasan's Bot ❤️‍🩹\n\n😻 Hope you all enjoy our group ❤️‍🩹\n\n☢️To view any command 📌\n/Help\n/Bot\n/Info",
  commandCategory: "Info",
  usages: "/",
  cooldowns: 11,
  dependencies: {
    request: "",
    "fs-extra": "",
    axios: ""
  }
};

module.exports.run = async function({ api, event }) {

  const messages = [
   `🌸 Assalamu Alaikum 🌸  
    🌺 Thank you so much for using 𝐌𝐞𝐡𝐞𝐝𝐢 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭 ❤️‍🩹 
    😻 Hope everyone enjoys using this bot 🤖
    ☢️ To view any command 📌\n/Help\n/Bot\n/Info`
  ];

  // Random images (hosted on imgur)
  const images = [
"https://i.imgur.com/VYWYoaL.jpeg",
"https://i.imgur.com/zVhhm2e.jpeg",
"https://i.imgur.com/bJrDdmL.jpeg",
"https://i.imgur.com/HjkckPR.jpeg",
"https://i.imgur.com/oh3r048.jpeg",
"https://i.imgur.com/UZJjZpN.jpeg",
"https://i.imgur.com/GX77Jue.jpeg",
"https://i.imgur.com/4HjcKF0.jpeg",
"https://i.imgur.com/Wkdt8Wz.jpeg",
"https://i.imgur.com/hQRjiA8.jpeg",
"https://i.imgur.com/aknPTUi.jpeg",
"https://i.imgur.com/Nq2XkAr.jpeg",
"https://i.imgur.com/7LWMOZO.jpeg",
"https://i.imgur.com/dJ4hwrs.jpeg",
"https://i.imgur.com/Hi3EVrq.jpeg",
"https://i.imgur.com/UFGHcmR.jpeg",
"https://i.imgur.com/qUGxWMA.jpeg",
"https://i.imgur.com/3jvSQ1w.jpeg",
"https://i.imgur.com/hxaEZHm.jpeg"
  ];

  // Pick random message and image
  const message = messages[Math.floor(Math.random() * messages.length)];
  const imageURL = images[Math.floor(Math.random() * images.length)];

  // Save image temporarily
  const filePath = __dirname + "/cyber.jpg";
  request(encodeURI(imageURL))
    .pipe(fs.createWriteStream(filePath))
    .on("close", () => {
      api.sendMessage(
        {
          body: ` ${message} \n\n✨ From: Mehedi Hasan ✨`,
          attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        () => fs.unlinkSync(filePath)
      );
    });
};
