const cron = require("node-cron");

module.exports.config = {
  name: "jummaday",
  version: "1.0.2",
  credits: "Mehedi Hasan", // © Don't Remove Credits
  description: "প্রতি শুক্রবার সকল গ্রুপে Jumma Mubarak বার্তা পাঠাবে",
  hasPermission: 0,
  usePrefix: true,
  commandCategory: "religious",
  cooldowns: 5
};

const messages = [
  `🌺🥀 Assalamu Alaikum Wa Rahmatullahi Wa Barakatuh 🌺🥀

🗓 আজকের এই পবিত্র দিনে আল্লাহ তাআলার রহমত, বরকত ও মাগফিরাত বর্ষিত হোক আমাদের সবার জীবনে। 🤲💌

🕌 জুম্মার দিনের প্রতিটি দোয়া কবুল হোক! 💟💌

💌 হৃদয়ে শান্তি আসুক, জীবন ভরে উঠুক সুখ ও বরকতে। 🌺🌼

🌺🤍 সবাইকে জুম্মা মোবারক 🤍🌺

🕜 আজকের এই দিনে আমরা সবাই বেশি বেশি দরুদ শরীফ পাঠ করি! 📖📕

🤲 আল্লাহ আমাদের ঈমানকে দৃঢ় করুক, গুনাহ মাফ করুক এবং জান্নাতুল ফেরদৌস দান করুন। আমীন 🤲🌙`
];

module.exports.onLoad = function ({ api }) {
  cron.schedule(
    "0 10 * * 5",
    () => {
      sendJummaMessage(api);
    },
    { timezone: "Asia/Dhaka" }
  );
};

function sendJummaMessage(api, threadID = null) {
  const randomMsg = messages[Math.floor(Math.random() * messages.length)];

  if (threadID) {
    api.sendMessage(randomMsg, threadID);
  } else if (global.data && global.data.allThreadID) {
    
    for (const tid of global.data.allThreadID) {
      api.sendMessage(randomMsg, tid);
    }
  } else {
    console.error("⚠️ global.data.allThreadID খুঁজে পাওয়া যায়নি!");
  }
}

module.exports.run = async function ({ api, event }) {
  sendJummaMessage(api, event.threadID);
};
