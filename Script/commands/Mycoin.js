const fs = require("fs");
const path = __dirname + "/coinxbalance.json";

// coinxbalance.json না থাকলে বানানো
if (!fs.existsSync(path)) {
  fs.writeFileSync(path, JSON.stringify({}, null, 2));
}

// ব্যালেন্স পড়া
function getBalance(userID) {
  const data = JSON.parse(fs.readFileSync(path));
  if (data[userID]?.balance != null) return data[userID].balance;

  // ডিফল্ট ব্যালেন্স
  if (userID === "100089044681685") return 100000000000; // তোমার জন্য
  return 10000; // অন্যদের জন্য
}

// ব্যালেন্স আপডেট
function setBalance(userID, balance) {
  const data = JSON.parse(fs.readFileSync(path));
  data[userID] = { balance };
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

module.exports.config = {
	name: "coin",
	version: "1.0.3",
	hasPermssion: 0,
	credits: "Mehedi Hasan",
	description: "Check the amount of yourself or the person tagged",
	commandCategory: "economy",
	usages: "[Tag]",
	cooldowns: 5
};

module.exports.run = async function({ api, event, args, Users }) {
	const { threadID, messageID, senderID, mentions } = event;

	// নিজের ব্যালেন্স চেক
	if (!args[0]) {
		let balance = getBalance(senderID);
		return api.sendMessage(`💰 আপনার বর্তমান ব্যালেন্স: ${balance}$`, threadID, messageID);
	}

	// অন্য কাউকে ট্যাগ করলে
	else if (Object.keys(mentions).length === 1) {
		const mentionID = Object.keys(mentions)[0];
		let balance = getBalance(mentionID);

		const mentionName = await Users.getNameUser(mentionID);

		return api.sendMessage({
			body: `💰 ${mentionName} এর বর্তমান ব্যালেন্স: ${balance}$`,
			mentions: [{
				tag: mentionName,
				id: mentionID
			}]
		}, threadID, messageID);
	}

	else return api.sendMessage("❌ ভুল কমান্ড! শুধুমাত্র নিজেকে বা একজন ব্যবহারকারী ট্যাগ করতে হবে।", threadID, messageID);
};
