const fs = require("fs-extra");
const axios = require("axios");
const request = require("request");

module.exports.config = {
  name: "\n", // command name (still blank)
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Mehedi Hasan", //Don't My Remove Credits
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

  const images = [
"https://i.imgur.com/0gd6tQ9.png"
  ];

  const message = messages[Math.floor(Math.random() * messages.length)];
  const imageURL = images[Math.floor(Math.random() * images.length)];

  const filePath = __dirname + "/cyber.jpg";
  request(encodeURI(imageURL))
    .pipe(fs.createWriteStream(filePath))
    .on("close", () => {
      api.sendMessage(
        {
          body: ` ${message} \n\n✨ 𝗖𝗿𝗲𝗮𝘁𝗼𝗿: 𝗠𝗲𝗵𝗲𝗱𝗶 𝗛𝗮𝘀𝗮𝗻 ✨`,
          attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        () => fs.unlinkSync(filePath)
      );
    });
};
