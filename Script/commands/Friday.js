const cron = require("node-cron");

module.exports.config = {
  name: "jummaday",
  version: "1.0.1",
  credits: "Mehedi Hasan",
  description: "প্রতি শুক্রবার সকল গ্রুপে Jumma Mubarak শুভেচ্ছা পাঠাবে বড় ক্যাপশনসহ"
};

// বড় Jumma Mubarak ক্যাপশন
const messages = [
  `🌙✨🌸 Assalamu Alaikum Wa Rahmatullahi Wa Barakatuh 🌸✨🌙

🤲💖 আজকের এই পবিত্র দিনে আল্লাহ তাআলার রহমত, বরকত ও মাগফিরাত বর্ষিত হোক আমাদের সবার জীবনে।
🕋🕌 জুম্মার দিনের প্রতিটি দোয়া কবুল হোক,
🌹🕊️ হৃদয়ে শান্তি আসুক,
💫🌟 জীবন ভরে উঠুক সুখ ও বরকতে।

🌺🤍 সবাইকে জুম্মা মোবারক 🤍🌺

✨🪄 আজকের এই দিনে আমরা সবাই বেশি বেশি দরুদ শরীফ পাঠ করি!
🕌✨ আল্লাহ আমাদের ঈমানকে দৃঢ় করুক, গুনাহ মাফ করুক এবং জান্নাতুল ফেরদৌস দান করুন। আমীন 🤲🌙`
];

module.exports.onLoad = function ({ api }) {
  // প্রতি শুক্রবার সকাল ৮টায় মেসেজ পাঠাবে
  cron.schedule("0 8 * * 5", () => {
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];

    // সকল গ্রুপে পাঠানো
    for (const threadID of global.data.allThreadID) {
      api.sendMessage(randomMsg, threadID);
    }
  }, { timezone: "Asia/Dhaka" });
};
