const schedule = require('node-schedule');
const chalk = require('chalk');
const moment = require('moment-timezone');

module.exports.config = {
    name: 'autosent',
    version: '1.2.1',
    hasPermssion: 0,
    credits: '𝗠𝗲𝗵𝗲𝗱𝗶 𝗛𝗮𝘀𝗮𝗻', // Don't Remove Credits
    description: 'Automatically sends styled hourly messages in all groups (BD Time, 12h format)',
    commandCategory: 'group messenger',
    usages: '[]',
    cooldowns: 3
};

const captions = {
    0: "🌌 আরো একটি দিন শেষ।\n😴 নতুন দিনের শুরু, শুভরাত্রি সবাইকে! 💤💌",
    1: "🏃 অনেক দেরি হয়ে গেছে, ঘুমিয়ে পড়ো তাড়াতাড়ি! 😴",
    2: "😒 যারা জেগে আছো তোমাদের একটু ঘুমানো দরকার! 🥱",
    3: "🌌 অনেক রাত হলো, সকালের আগে বিশ্রাম নাও! 🛌",
    4: "🥱 উঠো, ফজরের সময় কাছাকাছি! 🙆‍♂️",
    5: "🕌 আজান হয়ে যাবে, সবাই নামাজের প্রস্তুতি নাও! 💁‍♂️",
    6: "☀️ শুভ সকাল! দিন শুরু হোক বরকতময়৷ 🤲🌤",
    7: "⚡ পড়াশোনা/কাজ শুরু করার সেরা সময়! 📝",
    8: "💼 কাজে মনোযোগ দেওয়ার সেরা সময়! 📤",
    9: "☕ এক কাপ চা/কফি হলে ভালো হয়? 😀⚡",
    10: "💪 সবাই উদ্যমী থাকো! ⚡🎯",
    11: "✨ নিজের জন্য সময় বের করো! 🕠",
    12: "🌤️ শুভ দুপুর, গোসলের প্রস্তুতি নাও 🛀!",
    13: "🕌 গোসল করে যোহরের সালাত আদায় করে নাও 🛀🚿।",
    14: "🥘 খাবার খেয়ে একটু বিশ্রাম নিতে পারো! 🛋",
    15: "🥱 একটু পাওয়ার ন্যাপ নিয়ে নিলে কেমন হয়? 😀",
    16: "🕌 আসরের সালাত আদায় করে নাও! 🧭",
    17: "🚶 একটু হেঁটে শরীর হালকা করে নাও! ⛹️‍♂️🤸‍♀️",
    18: "🕌 মাগরিবের সালাত আদায় করে নাও! 🕋",
    19: "👨‍👦‍👦 ফোন না টিপে, এখন একটু পরিবারের সাথে সময় কাটাও! 👀💙",
    20: "📚 পড়াশোনা বা কাজ গুছিয়ে নাও এবং নিজের লক্ষ্য সেট করো 🎯!",
    21: "🕌 ওযু করে পাক-পবিত্র হয়ে ইশারের সালাত আদায় করে নাও! 🧭",
    22: "🍲 ফোন রেখে, রাতের খাবার খেয়ে নাও! 🧆",
    23: "😴 ঘুমিয়ে পড়ার ভালো সময়, তাড়াতাড়ি ঘুমাও তাড়াতাড়ি উঠো 🥱!"
};

module.exports.onLoad = ({ api }) => {
    console.log(chalk.bold.hex("#00c300")("============ AUTOSENT COMMAND LOADED (BD TIME, 12h FORMAT) ============"));

    for (let h = 0; h < 24; h++) {
        const rule = new schedule.RecurrenceRule();
        rule.tz = 'Asia/Dhaka';
        rule.hour = h;
        rule.minute = 0;

        schedule.scheduleJob(rule, () => {
            if (!global.data?.allThreadID) return;

            const nowMoment = moment().tz('Asia/Dhaka');
            const formattedTime = nowMoment.format('hh:mm A'); 

            const message = captions[h] || "⏰ সময়কে কাজে লাগাও, প্রতিটা মুহূর্তই মূল্যবান!";

            const finalMessage =
`╭•┄┅═══❁🌼❁═══┅┄•╮

🕒 এখন সময়: ${formattedTime} 
${message}

🔰 সময়কে কাজে লাগাও,
🔯 প্রতিটা মুহূর্তই মূল্যবান!

╰•┄┅═══❁⏰❁═══┅┄•╯`;

            global.data.allThreadID.forEach(threadID => {
                api.sendMessage(finalMessage, threadID, (error) => {
                    if (error) console.error(`Failed to send message to ${threadID}:`, error);
                });
            });

            console.log(chalk.hex("#00FFFF")(`Scheduled (BDT): ${formattedTime} => ${message}`));
        });
    }
};

module.exports.run = () => {
    // Main logic is in onLoad
};
