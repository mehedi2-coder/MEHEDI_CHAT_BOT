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
  // Random welcome messages
  const messages = [
    "🌸Assalamu Alaikum 🌸",
    "🌺 Thanks you so much for using Mehedi Hasan's Bot ❤️‍🩹",
    "😻 Hope you all enjoy your group ❤️‍🩹",
    "☢️To view any command 📌\n/Help\n/Bot\n/Info"
  ];

  // Random images (hosted on imgur)
  const images = [
    "https://i.imgur.com/X1OPkox.jpg",
    "https://i.imgur.com/yT294WF.jpg",
    "https://i.imgur.com/gUQTUkN.jpg",
    "https://i.imgur.com/d9TRavK.jpg",
    "https://i.imgur.com/3uW3OrW.jpg",
    "https://i.imgur.com/4OVeflr.jpg",
    "https://i.imgur.com/vr59gnp.jpg",
    "https://i.imgur.com/nI6W6sM.jpg",
    "https://i.imgur.com/niBV0ZV.jpg",
    "https://i.imgur.com/fQZhwWg.jpg",
    "https://i.imgur.com/2ProK0c.jpg",
    "https://i.imgur.com/ObLm7Df.jpg",
    "https://i.imgur.com/Cz6FnUs.jpg",
    "https://i.imgur.com/CQTzXUN.jpg",
    "https://i.imgur.com/KxkUNYJ.jpg",
    "https://i.imgur.com/QIYO8lo.jpg",
    "https://i.imgur.com/ETDkFyf.jpg",
    "https://i.imgur.com/Rzj2lZw.jpg",
    "https://i.imgur.com/inxiATH.jpg",
    "https://i.imgur.com/UqfUP.jpg",
    "https://i.imgur.com/SEIbs.jpg",
    "https://i.imgur.com/aiZuT.jpg",
    "https://i.imgur.com/KyRiU.jpg",
    "https://i.imgur.com/rsngc.jpg",
    "https://i.imgur.com/KyfHP.jpg",
    "https://i.imgur.com/bSiNH.jpg",
    "https://i.imgur.com/IVjkf.jpg",
    "https://i.imgur.com/xXQIZ7U.jpg"
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
