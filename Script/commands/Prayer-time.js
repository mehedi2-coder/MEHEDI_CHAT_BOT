const axios = require("axios");

module.exports.config = {
  name: "AutoTime",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "CYBER ☢️_𖣘 BOT ⚠️ TEAM",
  description: "স্বয়ংক্রিয়ভাবে নির্দিষ্ট সময়ে নামাজের আজানের মেসেজ পাঠাবে!",
  commandCategory: "Islamick Call to Prayer",
  countDown: 3
};

module.exports.run = async ({ api }) => {
  // নির্দিষ্ট সময় ও মেসেজ-অডিওর লিস্ট
  const times = {
    "05:35 AM": {
      message: "»✨ফজরের আজান দেওয়া হয়েছে, সবাই ঘুম থেকে উঠে ওযু করে পাক-পবিত্র হয়ে দিনের প্রথম সালাত আদায় করে নিন!🖤💫",
      url: "https://drive.google.com/uc?id=1m5jiP4q9SpTIQSpw0qG2aywuMpb1MMj7&export=download"
    },
    "01:00 PM": {
      message: "»✨জোহরের আজান দেওয়া হয়েছে, সবাই গোসল করে পাক-পবিত্র হয়ে দিনের জোহরের সালাত আদায় করে নিন!🖤💫",
      url: "https://drive.google.com/uc?id=1mB8EpEEbIpA1wH-eSrVKZo6iI7GJNTbse57h2S&export=download"
    },
    "04:30 PM": {
      message: "»✨আসরের আজান দেওয়া হয়েছে, সবাই ওযু করে পাক-পবিত্র হয়ে দিনের আসরের সালাত আদায় করে নিন!🖤💫",
      url: "https://drive.google.com/uc?id=1mkNnhFFvwuMpb1MMj7GRc2P9joj2&export=download"
    },
    "07:05 PM": {
      message: "»✨মাগরিবের আজান দেওয়া হয়েছে, সময় খুবই অল্প সবাই ওযু করে পাক-পবিত্র হয়ে মাগরিবের সালাত আদায় করে নিন!🖤💫",
      url: "https://drive.google.com/uc?id=1mNVwfsTEqAlkvtqaxHFPqDbIX4Bo&export=download"
    },
    "08:15 PM": {
      message: "»✨ইশারের আজান দেওয়া হয়েছে, সবাই ওযু করে পাক-পবিত্র হয়ে দিনের শেষ সালাত আদায় করে নিন!🖤💫",
      url: "https://drive.google.com/uc?id=1mP2HJlKRG2aywuMpb1MMj7&export=download"
    }
  };

  // টাইম চেকার ফাংশন
  const checkTime = async () => {
    const now = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }).trim();

    if (times[now]) {
      console.log("Sending:", times[now].message);

      try {
        let audio = (await axios.get(times[now].url, { responseType: "stream" })).data;
        let msg = { body: times[now].message, attachment: audio };

        global.data.allThreadID.forEach(threadID => {
          api.sendMessage(msg, threadID);
        });
      } catch (err) {
        console.error("Failed to send message for time " + now, err);
      }
    }

    setTimeout(checkTime, 60000); // প্রতি ১ মিনিটে টাইম চেক করবে
  };

  checkTime();
};

module.exports.onLoad = ({}) => {};
