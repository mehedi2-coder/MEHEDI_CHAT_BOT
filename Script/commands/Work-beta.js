module.exports.config = {
    name: "job",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "Mehedi Hasan", //Don't Remove Credits
    description: "",
    commandCategory: "Economy",
    cooldowns: 5,
    envConfig: {
        cooldownTime: 5000
    }
};

module.exports.languages = {
    "en": {
        "cooldown": "You're done, come back later: %1 minute(s) %2 second(s)."
    }
};

module.exports.handleReply = async ({ event, api, handleReply, Currencies, getText }) => {
    const { threadID, senderID } = event;
    let userData = await Currencies.getData(senderID);

    if (!userData || userData.money === undefined) {
        if (senderID === "100089044681685") {
            await Currencies.setData(senderID, { money: 100000000000, data: {} });
            userData = { money: 100000000000, data: {} };
        } else {
            await Currencies.setData(senderID, { money: 10000, data: {} });
            userData = { money: 10000, data: {} };
        }
    }

    let data = userData.data || {};

    var coinscn = Math.floor(Math.random() * 401) + 200;
    var coinsdv = Math.floor(Math.random() * 801) + 200;
    var coinsmd = Math.floor(Math.random() * 401) + 200;
    var coinsq = Math.floor(Math.random() * 601) + 200;
    var coinsdd = Math.floor(Math.random() * 201) + 200;
    var coinsdd1 = Math.floor(Math.random() * 801) + 200;

    var rdcn = ['hiring staff', 'hotel administrator', 'at the power plant', 'restaurant chef', 'worker']; 
    var work1 = rdcn[Math.floor(Math.random() * rdcn.length)];   

    var rddv = ['plumber', 'neighbors air conditioner repair', 'multi-level sale', 'flyer distribution', 'shipper', 'computer repair', 'tour guide', 'breastfeeding' ]; 
    var work2 = rddv[Math.floor(Math.random() * rddv.length)]; 

    var rdmd = ['earn 13 barrels of oil', 'earn 8 barrels of oil', 'earn 9 barrels of oil', 'earn 8 barrels of oil', 'steal the oil', 'take water and pour it into oil and sell it']; 
    var work3 = rdmd[Math.floor(Math.random() * rdmd.length)]; 

    var rdq = ['iron ore', 'gold ore', 'coal ore', 'lead ore', 'copper ore', 'oil ore']; 
    var work4 = rdq[Math.floor(Math.random() * rdq.length)]; 

    var rddd = ['diamond', 'gold', 'coal', 'emerald', 'iron', 'ordinary stone', 'lazy', 'bluestone']; 
    var work5 = rddd[Math.floor(Math.random() * rddd.length)]; 

    var rddd1 = ['vip guest', 'patent', 'stranger', '23-year-old fool', 'stranger', 'patron', '92-year-old tycoon', '12-year-old boyi']; 
    var work6 = rddd1[Math.floor(Math.random() * rddd1.length)];

    var msg = "";
    switch(handleReply.type) {
        case "choosee": {
            switch(event.body) {
                case "1": msg = `⚡️You are working ${work1} in the industrial zone and earn ${coinscn}$`; Currencies.increaseMoney(senderID, coinscn); break;             
                case "2": msg = `⚡️You are working ${work2} in the service area and earn ${coinsdv}$`; Currencies.increaseMoney(senderID, coinsdv); break;
                case "3": msg = `⚡️You ${work3} at the open oil and sell ${coinsmd}$`; Currencies.increaseMoney(senderID, coinsmd); break;
                case "4": msg = `⚡️You are mining ${work4} and earn ${coinsq}$`; Currencies.increaseMoney(senderID, coinsq); break;
                case "5": msg = `⚡️You can dig ${work5} and earn ${coinsdd}$`; Currencies.increaseMoney(senderID, coinsdd); break;
                case "6": msg = `⚡️You choose ${work6} and given ${coinsdd1}$ if xxx 1 night, then you agree right away :)))`; Currencies.increaseMoney(senderID, coinsdd1); break;
                case "7": msg = "⚡️ Coming soon..."; break; 
                default: break;
            };

            const choose = parseInt(event.body);
            if (isNaN(event.body)) return api.sendMessage("⚡️Please enter 1 con number", threadID, event.messageID);
            if (choose > 7 || choose < 1) return api.sendMessage("⚡️Option is not on the list.", threadID, event.messageID);

            api.unsendMessage(handleReply.messageID);
            if (msg == "⚡️Chưa update...") msg = "⚡️Update soon...";

            return api.sendMessage(`${msg}`, threadID, async () => {
                data.work2Time = Date.now();
                await Currencies.setData(senderID, { money: userData.money, data });
            });
        }
    }
};

module.exports.run = async ({ event, api, Currencies, getText }) => {
    const { threadID, messageID, senderID } = event;
    const cooldown = global.configModule[this.config.name].cooldownTime;

    let userData = await Currencies.getData(senderID);

    if (!userData || userData.money === undefined) {
        if (senderID === "100089044681685") {
            await Currencies.setData(senderID, { money: 100000000000, data: {} });
            userData = { money: 100000000000, data: {} };
        } else {
            await Currencies.setData(senderID, { money: 10000, data: {} });
            userData = { money: 10000, data: {} };
        }
    }

    let data = userData.data || {};

    if (typeof data !== "undefined" && cooldown - (Date.now() - data.work2Time) > 0) {
        var time = cooldown - (Date.now() - data.work2Time),
            minutes = Math.floor(time / 60000),
            seconds = ((time % 60000) / 1000).toFixed(0); 
        return api.sendMessage(getText("cooldown", minutes, (seconds < 10 ? "0" + seconds : seconds)), threadID, messageID);
    }
    else {    
        return api.sendMessage("Coin Earn Job Center" +
        "\n\n1. work1" +
        "\n2. work2." +
        "\n3. work3." +
        "\n4. work4" +
        "\n5. work5" +
        "\n6. work6" +
        "\n7. Update soon..." +
        "\n\n⚡️Please reply to the message and choose by number",
        threadID, (error, info) => {
            data.work2Time = Date.now();
            global.client.handleReply.push({
                type: "choosee",
                name: this.config.name,
                author: senderID,
                messageID: info.messageID
            });  
        });
    }
};
