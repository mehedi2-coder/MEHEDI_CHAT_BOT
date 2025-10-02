const fs = require('fs');
const path = require('path');
const request = require('request');
const moment = require('moment-timezone');

module.exports.config = {
  name: "prayertime",
  version: "1.0.0",
  credits: "𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧", // Don't remove credits
  description: "Send Azan messages automatically at prayer times (12h format) using request+fs",
  commandCategory: "Islamic",
  cooldowns: 5
};

const images = [
  "https://i.imgur.com/o6OwL71.jpeg",
  "https://i.imgur.com/j8KWJPc.jpeg",
  "https://i.imgur.com/1tzl381.jpeg",
  "https://i.imgur.com/pT2UUe1.jpeg",
  "https://i.imgur.com/aWWU13H.jpeg",
  "https://i.imgur.com/bi0UsSd.jpeg",
  "https://i.imgur.com/shHv3vC.jpeg",
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
  "https://i.imgur.com/CPxLab9.jpeg"
];

function getRandomImage() {
  return images[Math.floor(Math.random() * images.length)];
}

function getAzanMessage(prayerName) {
  let customMsg = "";

  if (prayerName === "ফজর") {
    customMsg = `🕌 ফজরের আজান হয়েছে, সবাই ঘুম থেকে উঠুন৷ ওযু করে পাক-পবিত্র হয়ে, দিনের প্রথম সালাত আদায় করে নিন! 💝🤍`;
  } else if (prayerName === "যোহর") {
    customMsg = `🕌 যোহরের আজান হয়েছে, কাজ বা পড়াশোনার ব্যস্ততার মাঝেও, একটু সময় বের করে সালাত আদায় করুন। 🤍✨`;
  } else if (prayerName === "আসর") {
    customMsg = `🕌 আসরের আজান হয়েছে, বিকেলের বরকতময় সময়ে, নামাজ আদায় করে দোয়া করুন। ✨🤲`;
  } else if (prayerName === "মাগরিব") {
    customMsg = `🕌 মাগরিবের আজান হয়েছে, সূর্য অস্ত গেছে, সবাই নামাজের জন্য প্রস্তুত হোন। 🌄💁‍♂️`;
  } else if (prayerName === "এশা") {
    customMsg = `🕌 এশার আজান হয়েছে, রাতের শেষ নামাজ মিস করবেন না, নামাজ শেষে কোরআন তিলাওয়াত করুন। 📖✨`;
  }

  return `╭•┄┅═══❁🕌❁═══┅┄•╮

${customMsg}

╰•┄┅═══❁🕌❁═══┅┄•╯

•—»✨ 𝐌𝐞𝐡𝐞𝐝𝐢 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭 ✨«—•`;
}

const prayerTimes = {
  ফজর: "05:00 AM",
  যোহর: "01:00 PM",
  আসর: "04:15 PM",
  মাগরিব: "05:55 PM",
  এশা: "07:15 PM"
};

const cacheDir = path.join(__dirname, "cache");
if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

module.exports.onLoad = function({ api }) {
  
  setInterval(() => {
    try {
      const now = moment().tz("Asia/Dhaka");
      const currentTime = now.format("hh:mm A"); 

      for (const [prayer, time] of Object.entries(prayerTimes)) {
        if (currentTime === time) {
          const msg = getAzanMessage(prayer);
          const imgUrl = getRandomImage();

          const filename = path.join(cacheDir, `azan_${Date.now()}_${Math.floor(Math.random() * 10000)}.jpg`);

          request(encodeURI(imgUrl))
            .on('error', err => {
              console.error("Image download error:", err);
            })
            .pipe(fs.createWriteStream(filename))
            .on('close', async () => {
              try {
                if (!global.data?.allThreadID || !Array.isArray(global.data.allThreadID) || global.data.allThreadID.length === 0) {
                  
                  if (fs.existsSync(filename)) fs.unlinkSync(filename);
                  return;
                }
                
                for (const threadID of global.data.allThreadID) {
                  try {
                    await api.sendMessage({ body: msg, attachment: fs.createReadStream(filename) }, threadID);
                  } catch (errSend) {
                    console.error(`Failed to send Azan to ${threadID}:`, errSend);
                  }
                }
              } catch (e) {
                console.error("Error in Azan send loop:", e);
              } finally {
        
                try {
                  if (fs.existsSync(filename)) fs.unlinkSync(filename);
                } catch (e) { /* ignore */ }
              }

              console.log(`🕒 [${currentTime}] Sent ${prayer} azan message to ${global.data?.allThreadID?.length || 0} threads`);
            });
        }
      }
    } catch (e) {
      console.error("Prayer-time check error:", e);
    }
  }, 60 * 1000); 
};

module.exports.run = async function({ api, event }) {
  return api.sendMessage("✅ আজানের অটো সিস্টেম চালু আছে (12h format).", event.threadID);
};
