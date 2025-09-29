const axios = require("axios");
const fs = require("fs");
const path = __dirname + "/cache/";

if (!fs.existsSync(path)) fs.mkdirSync(path);

module.exports.config = {
  name: "lyrics",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "Priyansh Rajput + Mehedi Hasan",
  description: "Fetch lyrics + album cover of a song",
  commandCategory: "media",
  usages: "lyrics [song name]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const { threadID } = event;

  try {
    if (!args || args.length === 0) 
      return api.sendMessage("❌ Please enter the song name!", threadID);

    const songName = args.join(" ");
    const cacheFile = `${path}${songName.replace(/[^a-zA-Z0-9]/g, "_")}.png`;

    let songData;

    // যদি আগে fetch হয়ে থাকে, cache থেকে নাও
    if (fs.existsSync(cacheFile)) {
      songData = JSON.parse(fs.readFileSync(`${cacheFile}.json`, "utf-8"));
    } else {
      const response = await axios.get(`https://ai.new911.repl.co/api/tools/lyrics?song=${encodeURIComponent(songName)}`);
      songData = response.data;

      // Fetch album/lyrics image
      const imageResponse = await axios.get(songData.media, { responseType: "arraybuffer" });
      fs.writeFileSync(cacheFile, Buffer.from(imageResponse.data));

      // Save song info for cache
      fs.writeFileSync(`${cacheFile}.json`, JSON.stringify(songData, null, 2));
    }

    const message = 
      `🎵 Lyrics Info\n\n` +
      `❏ Title: ${songData.title}\n` +
      `❏ Artist: ${songData.artist}\n\n` +
      `❏ Lyrics:\n${songData.lyrics}\n\n` +
      `❏ Credit: Priyansh\n` +
      `❏ Contact: https://priyansh.infopriyansh.repl.co/`;

    return api.sendMessage({ body: message, attachment: fs.createReadStream(cacheFile) }, threadID);
  } catch (error) {
    console.error(error);
    return api.sendMessage("❌ An error occurred while fetching lyrics.", threadID);
  }
};
