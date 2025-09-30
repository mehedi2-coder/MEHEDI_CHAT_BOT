const axios = require("axios");

function getRandomImage() {
  const images = [
    "https://i.imgur.com/o6OwL71.jpeg",
    "https://i.imgur.com/j8KWJPc.jpeg",
    "https://i.imgur.com/1tzl381.jpeg",
    "https://i.imgur.com/pT2UUe1.jpeg",
    "https://i.imgur.com/aWWU13H.jpeg"
  ];
  return images[Math.floor(Math.random() * images.length)];
}

function getAzanMessage(prayerName) {
  let customMsg = "";

  if (prayerName === "ফজর") {
    customMsg = `ফজরের আজান হয়েছে, 
 সবাই ঘুম থেকে উঠুন৷
 ওযু করে পাক-পবিত্র হয়ে, 
 দিনের প্রথম সালাত আদায় করে নিন!`;
  } 
  else if (prayerName === "যোহর") {
    customMsg = `যোহরের আজান হয়েছে, 
 কাজ বা পড়াশোনার ব্যস্ততার মাঝেও, 
 একটু সময় বের করে নামাজ আদায় করুন।`;
  } 
  else if (prayerName === "আসর") {
    customMsg = `আসরের আজান হয়েছে, 
 বিকেলের বরকতময় সময়ে, 
 নামাজ আদায় করে দোয়া করুন।`;
  } 
  else if (prayerName === "মাগরিব") {
    customMsg = `মাগরিবের আজান হয়েছে, 
 সূর্য অস্ত গেছে, 
 সবাই নামাজের জন্য প্রস্তুত হোন।`;
  } 
  else if (prayerName === "এশা") {
    customMsg = `এশার আজান হয়েছে, 
 রাতের শেষ নামাজ মিস করবেন না, 
 নামাজ শেষে কোরআন তিলাওয়াত করুন।`;
  }

  return `╭•┄┅═══❁🕌❁═══┅┄•╮

${customMsg}

╰•┄┅═══❁🕌❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭 ✨«—•`;
}

module.exports = {
  config: {
    name: "prayertime",
    version: "1.0.0",
    credits: "𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧", //Don't remove credits
    description: "Send Azan messages automatically at prayer times",
    commandCategory: "Islamic",
    cooldowns: 5
  },

  onLoad: async function ({ api }) {
  
    const prayerTimes = {
      ফজর: "05:00",
      যোহর: "13:10",
      আসর: "16:20",
      মাগরিব: "18:00",
      এশা: "19:20"
    };

    setInterval(async () => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);

      for (let [prayer, time] of Object.entries(prayerTimes)) {
        if (currentTime === time) {
          const msg = getAzanMessage(prayer);
          const imgUrl = getRandomImage();
          const imgData = (await axios.get(imgUrl, { responseType: "stream" })).data;

          for (const threadID of global.data.allThreadID) {
            api.sendMessage(
              { body: msg, attachment: imgData },
              threadID
            );
          }
        }
      }
    }, 60 * 1000);
  },

  run: async function ({ api, event }) {
    return api.sendMessage("✅ আজানের অটো সিস্টেম চালু আছে।", event.threadID);
  }
};
