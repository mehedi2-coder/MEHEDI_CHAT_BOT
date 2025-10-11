const schedule = require('node-schedule');
const moment = require('moment-timezone');
const chalk = require('chalk');

module.exports.config = {
  name: 'calendar',
  version: '1.0.0',
  hasPermssion: 0,
  credits: '𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧', //© Don't Remove Credits
  description: 'Daily calendar message (BD Time)',
  commandCategory: 'group messenger',
  usages: '[]',
  cooldowns: 3
};

const banglaDays = {
  Sunday: "রবিবার",
  Monday: "সোমবার",
  Tuesday: "মঙ্গলবার",
  Wednesday: "বুধবার",
  Thursday: "বৃহস্পতিবার",
  Friday: "শুক্রবার",
  Saturday: "শনিবার"
};

const banglaMonths = [
  "বৈশাখ","জ্যৈষ্ঠ","আষাঢ়","শ্রাবণ",
  "ভাদ্র","আশ্বিন","কার্তিক","অগ্রহায়ণ",
  "পৌষ","মাঘ","ফাল্গুন","চৈত্র"
];

const quotes = [
  "🌸 আজকের দিনটা হোক হাসিতে ভরপুর।",
  "💪 পরিশ্রমই সাফল্যের একমাত্র পথ।",
  "🌞 সকালে শুরু করো হাসি দিয়ে, দিনটা হবে সুন্দর।",
  "💭 যা আছে তাতেই সুখী হও, এটাই জীবন।",
  "💖 নিজের ওপর বিশ্বাস রাখো, সব সম্ভব!",
  "🌷 প্রতিদিন নতুন কিছু শেখো, নতুন কিছু করো।",
  "🌈 সময়ের আগে কিছুই আসে না, ধৈর্য ধরো।",
  "🔥 নিজের স্বপ্নের পেছনে ছুটো, হাল ছেড়ো না।",
  "🌿 তোমার আজকের প্রচেষ্টা তোমার আগামীর সাফল্য।",
  "✨ ছোট ছোট ভালো কাজই বড় পরিবর্তন আনে।"
];

const doa = [
  "🤲 আল্লাহ আমাদের দিনটি বরকতময় করুন।",
  "🕌 নামাজ আদায় করতে ভুলো না।",
  "💖 আল্লাহ তোমার জীবনে সুখ ও শান্তি দান করুন।",
  "🌸 আজকের দিনটা হোক সফলতায় ভরা।",
  "🌿 মন ভালো রাখো, মানুষকে ভালোবাসো।",
  "✨ জীবনের প্রতিটি মুহূর্তে আল্লাহর প্রতি কৃতজ্ঞ থাকো।",
  "🌙 আল্লাহর রহমত তোমার উপর বর্ষিত হোক।",
  "🌼 প্রতিদিনের শুরু হোক দোয়া ও হাসি দিয়ে।",
  "💫 আল্লাহর পরিকল্পনা সবসময় সেরা।",
  "🕊️ শান্তি ও মঙ্গল তোমার জীবনে আসুক।"
];

function getBanglaDate(now) {
  const bdYearOffset = 593;
  let banglaYear = now.year() - bdYearOffset;

  let dayOfYear = now.dayOfYear() - 104;
  if (dayOfYear <= 0) {
    dayOfYear += now.isLeapYear() ? 366 : 365;
    banglaYear -= 1;
  }

  const banglaMonthDays = [31,31,31,31,30,30,30,30,30,30,29,30];
  let remainingDays = dayOfYear;
  let banglaMonthIndex, banglaDate;

  for (let i = 0; i < banglaMonths.length; i++) {
    if (remainingDays <= banglaMonthDays[i]) {
      banglaMonthIndex = i;
      banglaDate = remainingDays;
      break;
    } else {
      remainingDays -= banglaMonthDays[i];
    }
  }

  return {
    date: banglaDate,
    month: banglaMonths[banglaMonthIndex],
    year: banglaYear
  };
}

module.exports.onLoad = ({ api }) => {
  console.log(chalk.bold.hex("#00ff99")("📅 Daily Calendar System Started (BD Time)"));

  const rule = new schedule.RecurrenceRule();
  rule.tz = 'Asia/Dhaka';
  rule.hour = 8;
  rule.minute = 0;

  schedule.scheduleJob(rule, () => {
    const now = moment().tz('Asia/Dhaka');
    const engDay = now.format('dddd');
    const engDate = now.format('DD');
    const engMonth = now.format('MMMM');
    const engYear = now.format('YYYY');
    const bangla = getBanglaDate(now);

    const banglaDay = banglaDays[engDay];
    const todayQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const todayDoa = doa[Math.floor(Math.random() * doa.length)];

    const msg = 
`╭•┄┅═══❁📅❁═══┅┄•╮

🌤️ শুভ সকাল বন্ধুরা!
🕗 সময়: সকাল ৮ টা (BDT)

📅 ইংরেজি তারিখ:
👉 ${engDay}, ${engDate} ${engMonth}, ${engYear}

📅 বাংলা তারিখ:
👉 ${banglaDay}, ${bangla.date} ${bangla.month}, ${bangla.year} বঙ্গাব্দ

🌸 আজকের অনুপ্রেরণা:
${todayQuote}

🤲 আজকের শুভ বার্তা:
${todayDoa}

╰•┄┅═══❁📅❁═══┅┄•╯

✨ Created by: 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨`;

    if (!global.data?.allThreadID) return;
    global.data.allThreadID.forEach(threadID => {
      api.sendMessage(msg, threadID, err => {
        if (err) console.error(err);
      });
    });

    console.log(chalk.hex("#00FFFF")("✅ Daily Calendar Message Sent Successfully!"));
  });
};

module.exports.run = () => {};
