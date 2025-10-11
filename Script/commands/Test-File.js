const moment = require("moment-timezone");
const chalk = require("chalk");

const banglaDays = {
  Sunday: "রবিবার",
  Monday: "সোমবার",
  Tuesday: "মঙ্গলবার",
  Wednesday: "বুধবার",
  Thursday: "বৃহস্পতিবার",
  Friday: "শুক্রবার",
  Saturday: "শনিবার"
};

function getBanglaDate(now) {
  const banglaMonths = [
    "বৈশাখ","জ্যৈষ্ঠ","আষাঢ়","শ্রাবণ",
    "ভাদ্র","আশ্বিন","কার্তিক","অগ্রহায়ণ",
    "পৌষ","মাঘ","ফাল্গুন","চৈত্র"
  ];

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

module.exports.config = {
  name: "autosenttest",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Mehedi Hasan x Xenobot", //© Don't Remove Credits
  description: "Test AutoSent Message Manually",
  commandCategory: "utility",
  usages: "[test]",
  cooldowns: 3
};

module.exports.run = async ({ api, event }) => {
  const now = moment().tz("Asia/Dhaka");
  const engDay = now.format("dddd");
  const engMonth = now.format("MMMM");
  const engDate = now.format("DD");
  const engYear = now.format("YYYY");
  const time = now.format("hh:mm A");
  const bangla = getBanglaDate(now);
  const banglaDay = banglaDays[engDay] || "";

  const msg = `
╭•┄┅═══❁📅❁═══┅┄•╮

🌤️ আসসালামু আলাইকুম়!
🕗 সময়: ${time} (BDT)

📅 ইংরেজি তারিখ:
👉 ${engDay}, ${engDate} ${engMonth}, ${engYear}

📅 বাংলা তারিখ:
👉 ${banglaDay}, ${bangla.date} ${bangla.month}, ${bangla.year} বঙ্গাব্দ

🌸 আজকের অনুপ্রেরণা:
💪 পরিশ্রমই সাফল্যের একমাত্র পথ।

🤲 আজকের অনুভূতি:
🖤 তুমি থাকলে হয়তো সময়টা আরও সুন্দর হতো।

╰•┄┅═══❁📅❁═══┅┄•╯

✨ Created by: 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧 ✨
`;

  api.sendMessage(msg, event.threadID, () => {
    console.log(chalk.hex("#00FFFF")("✅ Test message sent successfully!"));
  });
};
