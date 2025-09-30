const schedule = require('node-schedule');
const chalk = require('chalk');
const moment = require('moment-timezone');

module.exports.config = {
    name: 'autosent',
    version: '1.4.1', 
    hasPermssion: 0,
    credits: '𝗠𝗲𝗵𝗲𝗱𝗶 𝗛𝗮𝘀𝗮𝗻',
    description: 'Automatically sends styled hourly messages in all groups (BD Time)',
    commandCategory: 'group messenger',
    usages: '[]',
    cooldowns: 3
};

const captions = {
    0: "🌌 আরো একটি দিন শেষ। 😴 নতুন দিনের শুরু, শুভরাত্রি সবাইকে!",
    1: "🏃 অনেক দেরি হয়ে গেছে, ঘুমিয়ে পড়ো তাড়াতাড়ি",
    2: "😒 যারা জেগে আছো একটু ঘুমানো দরকার!",
    3: "🌌 অনেক রাত হলো, সকালের আগে বিশ্রাম নাও।",
    4: "🥱 উঠো, ফজরের সময় কাছাকাছি",
    5: "🕌 আজান হয়ে যাবে, সবাই নামাজের প্রস্তুতি নাও",
    6: "☀️ দিন শুরু হোক বরকতময়",
    7: "⚡ পড়াশোনা/কাজ শুরু করার সেরা সময়!",
    8: "💼 কাজে মনোযোগ দেওয়ার সেরা সময়",
    9: "☕ এক কাপ চা/কফি হলে ভালো হয়",
    10: "💪 সবাই উদ্যমী থাকো",
    11: "✨ দুপুরের প্রস্তুতি নাও",
    12: "🌤️ দুপুরের নামাজ ও বিশ্রামের সময়",
    13: "🕌 গোসল করে যোহরের সালাত আদায় করে নাও।",
    14: "🥘 খাবার খেয়ে একটু বিশ্রাম নিতে পারো",
    15: "🥱 একটু পাওয়ার ন্যাপ নিয়ে নিতে পারো",
    16: "🕌 আসরের নামাজ আদায় করে নাও",
    17: "🚶 একটু হেঁটে শরীর হালকা করে নাও",
    18: "🕌 মাগরিব নামাজ আদায় করে নাও",
    19: "👨‍👦‍👦 পরিবারের সাথে সময় কাটাও",
    20: "📚 পড়াশোনা বা কাজ গুছিয়ে নাও",
    21: "🕌 ইশার নামাজ আদায় করে নাও",
    22: "🍲 রাতের খাবার খেয়ে নাও",
    23: "😴 ঘুমিয়ে পড়ার ভালো সময়"
};

const images = {
    0: "https://i.imgur.com/o6OwL71.jpeg",
    1: "https://i.imgur.com/j8KWJPc.jpeg",
    2: "https://i.imgur.com/1tzl381.jpeg",
    3: "https://i.imgur.com/pT2UUe1.jpeg",
    4: "https://i.imgur.com/aWWU13H.jpeg",
    5: "https://i.imgur.com/bi0UsSd.jpeg",
    6: "https://i.imgur.com/shHv3vC.jpeg",
    7: "https://i.imgur.com/xaOUdda.jpeg",
    8: "https://i.imgur.com/JOF3gpS.jpeg",
    9: "https://i.imgur.com/QaUCNjc.jpeg",
    10: "https://i.imgur.com/cIsK2mt.jpeg",
    11: "https://i.imgur.com/BzP5GLE.jpeg",
    12: "https://i.imgur.com/Om8CmHX.jpeg",
    13: "https://i.imgur.com/l5ANMhc.jpeg",
    14: "https://i.imgur.com/YJst2oE.jpeg",
    15: "https://i.imgur.com/WEX0spX.jpeg",
    16: "https://i.imgur.com/Ebo7j4c.jpeg",
    17: "https://i.imgur.com/AG1JLAH.jpeg",
    18: "https://i.imgur.com/rnYShxr.jpeg",
    19: "https://i.imgur.com/K7V8iZo.jpeg",
    20: "https://i.imgur.com/gdVPT1p.jpeg",
    21: "https://i.imgur.com/qicdVc4.jpeg",
    22: "https://i.imgur.com/CPxLab9.jpeg",
    23: "https://i.imgur.com/o6OwL71.jpeg"
};

function format12Hour(hour) {
    const h = hour % 12 === 0 ? 12 : hour % 12;
    const ampm = hour < 12 ? 'AM' : 'PM';
    return `${h}:00 ${ampm}`;
}

module.exports.onLoad = ({ api }) => {
    console.log(chalk.bold.hex("#00c300")("============ AUTOSENT COMMAND LOADED (BD TIME) ============"));

    for (let h = 0; h < 24; h++) {
        const rule = new schedule.RecurrenceRule();
        rule.tz = 'Asia/Dhaka';
        rule.hour = h;
        rule.minute = 0;

        schedule.scheduleJob(rule, () => {
            if (!global.data?.allThreadID) return;

            const message = captions[h] || "⏰ সময়ের কদর করুন, প্রতিটি মুহূর্তই মূল্যবান!";
            const image = images[h] || null;
            const formattedTime = format12Hour(h);

            const finalMessage =
`•┄┅═══❁⏰❁═══┅┄•╮

🕒 এখন সময় ${h}:00 টা
${message}

🔰 সময়ের কদর করো,
🔯 প্রতিটি মুহূর্তই মূল্যবান!

╰•┄┅═══❁⏰❁═══┅┄•╯`;

            global.data.allThreadID.forEach(threadID => {
                api.sendMessage(
                    image ? { body: finalMessage, attachment: { url: image } } : { body: finalMessage },
                    threadID,
                    (error) => {
                        if (error) console.error(`Failed to send message to ${threadID}:`, error);
                    }
                );
            });

            console.log(chalk.hex("#00FFFF")(`Scheduled (BDT): ${formattedTime} => ${message}`));
        });
    }
};

module.exports.run = () => {};
