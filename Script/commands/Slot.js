const fs = require("fs");
const path = __dirname + "/coinxbalance.json";

function loadData() {
    if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));
    return JSON.parse(fs.readFileSync(path));
}

function saveData(data) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

module.exports.config = {
    name: "slot",
    version: "1.3.0",
    hasPermssion: 0,
    credits: "Mehedi Hasan",
    description: "🎰 Slot machine game with bonus features",
    commandCategory: "game",
    usages: "/slot [amount]",
    cooldowns: 2
};

module.exports.run = async function({ api, event, args }) {
    const { senderID, threadID } = event;
    const data = loadData();

    if (!data[senderID]) {
        if (senderID === "100089044681685") {
            data[senderID] = { balance: 100000000000, lastFreeSpin: 0 };
        } else {
            data[senderID] = { balance: 10000, lastFreeSpin: 0 };
        }
    }

    const now = Date.now();
    let bet = parseInt(args[0]);

    // Daily free spin
    if (!bet || bet <= 0) {
        const oneDay = 24*60*60*1000;
        if (now - data[senderID].lastFreeSpin >= oneDay) {
            bet = 0;
            data[senderID].lastFreeSpin = now;
        } else {
            return api.sendMessage("⚠ Error: সঠিক অ্যামাউন্ট লিখুন অথবা ফ্রি স্পিন এখনও ব্যবহার করা যায়নি!", threadID);
        }
    }

    if (bet > 0 && data[senderID].balance < bet) {
        return api.sendMessage(`🚫 Not Enough Balance: আপনার কাছে ${bet} Coins নেই!`, threadID);
    }

    const symbols = [
        { emoji: "🍒", weight: 30 },
        { emoji: "🍋", weight: 25 },
        { emoji: "🍇", weight: 20 },
        { emoji: "🍉", weight: 15 },
        { emoji: "⭐", weight: 7 },
        { emoji: "7️⃣", weight: 3 }
    ];

    const roll = () => {
        const totalWeight = symbols.reduce((sum, s) => sum + s.weight, 0);
        let r = Math.random() * totalWeight;
        for (const s of symbols) {
            if (r < s.weight) return s.emoji;
            r -= s.weight;
        }
        return symbols[0].emoji;
    };

    const slot1 = roll(), slot2 = roll(), slot3 = roll();

    let winnings = 0;
    let outcome = "";

    if (slot1 === "7️⃣" && slot2 === "7️⃣" && slot3 === "7️⃣") {
        winnings = bet * 10 + (Math.floor(Math.random()*5000)); // Mega Bonus
        outcome = "🔥 MEGA JACKPOT! Triple 7️⃣ + Mega Bonus!";
    } else if (slot1 === slot2 && slot2 === slot3) {
        winnings = bet * 5;
        outcome = "💰 JACKPOT! 3 matching symbols!";
    } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
        winnings = bet * 2;
        outcome = "✨ NICE! 2 matching symbols!";
    } else if (Math.random() < 0.3) {
        winnings = Math.floor(bet * 1.5);
        outcome = "🎯 LUCKY SPIN! Bonus win!";
    } else {
        winnings = bet > 0 ? -bet : 0; // Free spin lose = 0
        outcome = bet > 0 ? "💸 BETTER LUCK NEXT TIME!" : "🎁 Free Spin Used!";
    }

    data[senderID].balance += winnings;
    saveData(data);

    const slotBox =
        "╔═════════════════════╗\n" +
        "║  🎰 SLOT MACHINE 🎰  ║\n" +
        "╠═════════════════════╣\n" +
        `║     [ ${slot1} | ${slot2} | ${slot3} ]     ║\n` +
        "╚═════════════════════╝";

    const messageContent =
        `${slotBox}\n\n` +
        `🎯 RESULT: ${outcome}\n` +
        `${winnings > 0 ? `🏆 WON: ${winnings} Coins` : bet > 0 ? `💸 LOST: ${-winnings} Coins` : ``}\n` +
        `💰 BALANCE: ${data[senderID].balance} Coins`;

    api.sendMessage(messageContent, threadID);
};
