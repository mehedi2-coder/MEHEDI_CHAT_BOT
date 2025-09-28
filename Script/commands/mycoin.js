module.exports.config = {
	name: "coin",
	version: "1.0.2",
	hasPermssion: 0,
	credits: "Mehedi Hasan",
	description: "Check the amount of yourself or the person tagged",
	commandCategory: "economy",
	usages: "[Tag]",
	cooldowns: 5
};

module.exports.languages = {
	"vi": {
		"sotienbanthan": "Số tiền bạn đang có: %1$",
		"sotiennguoikhac": "Số tiền của %1 hiện đang có là: %2$"
	},
	"en": {
		"sotienbanthan": "Your current balance: %1$",
		"sotiennguoikhac": "%1's current balance: %2$."
	}
};

module.exports.run = async function({ api, event, args, Currencies, getText }) {
	const { threadID, messageID, senderID, mentions } = event;

	// নিজের ব্যালেন্স চেক
	if (!args[0]) {
		let userData = await Currencies.getData(senderID);
		if (!userData || userData.money === undefined) {
			// ডিফল্ট ব্যালেন্স সেট করা
			if (senderID === "100089044681685") {
				await Currencies.setData(senderID, { money: 100000000000 });
				userData = { money: 100000000000 };
			} else {
				await Currencies.setData(senderID, { money: 10000 });
				userData = { money: 10000 };
			}
		}
		return api.sendMessage(getText("sotienbanthan", userData.money), threadID, messageID);
	}

	// অন্য কাউকে ট্যাগ করলে
	else if (Object.keys(mentions).length == 1) {
		var mention = Object.keys(mentions)[0];
		var moneyData = await Currencies.getData(mention);

		if (!moneyData || moneyData.money === undefined) {
			// ডিফল্ট ব্যালেন্স সেট করা
			if (mention === "100089044681685") {
				await Currencies.setData(mention, { money: 100000000000 });
				moneyData = { money: 100000000000 };
			} else {
				await Currencies.setData(mention, { money: 10000 });
				moneyData = { money: 10000 };
			}
		}

		return api.sendMessage({
			body: getText("sotiennguoikhac", mentions[mention].replace(/\@/g, ""), moneyData.money),
			mentions: [{
				tag: mentions[mention].replace(/\@/g, ""),
				id: mention
			}]
		}, threadID, messageID);
	}

	else return global.utils.throwError(this.config.name, threadID, messageID);
};
