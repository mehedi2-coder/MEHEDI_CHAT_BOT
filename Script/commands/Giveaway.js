const fs = require("fs");

module.exports.config = {
  name: "giveaway",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Mehedi Hasan",
  description: "Create and manage giveaways",
  commandCategory: "other",
  usages: "[create/details/join/roll/end] [IDGiveAway]",
  cooldowns: 5
};

module.exports.handleReaction = async ({ api, event, Users, handleReaction }) => {
  if (!global.data.GiveAway) return;
  let data = global.data.GiveAway.get(handleReaction.ID);
  if (!data || data.status == "close" || data.status == "ended") return;

  let index = data.joined.indexOf(event.userID);
  if (event.reaction === undefined) {
    if (index != -1) data.joined.splice(index, 1);
    global.data.GiveAway.set(handleReaction.ID, data);

    let threadInfo = await api.getThreadInfo(event.threadID);
    let name = threadInfo.nicknames[event.userID] || (await Users.getInfo(event.userID)).name;
    return api.sendMessage(`${name} đã rời giveaway có ID: #${handleReaction.ID}`, event.userID);
  }

  // join
  if (index === -1) data.joined.push(event.userID);
  global.data.GiveAway.set(handleReaction.ID, data);

  let threadInfo = await api.getThreadInfo(event.threadID);
  let name = threadInfo.nicknames[event.userID] || (await Users.getInfo(event.userID)).name;
  return api.sendMessage(`${name} đã tham gia thành công giveaway có ID: #${handleReaction.ID}`, event.userID);
};

module.exports.run = async ({ api, event, args, Users }) => {
  if (!global.data.GiveAway) global.data.GiveAway = new Map();
  const { senderID, threadID, messageID } = event;

  if (!args[0]) return api.sendMessage("Vui lòng nhập lệnh: create/details/join/roll/end", threadID, messageID);

  const command = args[0].toLowerCase();

  if (command === "create") {
    let reward = args.slice(1).join(" ");
    if (!reward) return api.sendMessage("Vui lòng nhập phần thưởng!", threadID, messageID);

    let randomNumber = (Math.floor(Math.random() * 100000) + 100000).toString().substring(1);
    let threadInfo = await api.getThreadInfo(threadID);
    let authorName = threadInfo.nicknames[senderID] || (await Users.getInfo(senderID)).name;

    api.sendMessage(
      `====== Give Away ======\nCreated by: ${authorName}\nReward: ${reward}\nID GiveAway: #${randomNumber}\nREACTION TO THIS MESSAGE TO JOIN GIVE AWAY`,
      threadID,
      (err, info) => {
        let dataGA = {
          ID: randomNumber,
          author: authorName,
          authorID: senderID,
          messageID: info.messageID,
          reward: reward,
          joined: [],
          status: "open"
        };
        global.data.GiveAway.set(randomNumber, dataGA);

        if (!global.client.handleReaction) global.client.handleReaction = [];
        global.client.handleReaction.push({
          name: "giveaway",
          messageID: info.messageID,
          author: senderID,
          ID: randomNumber
        });
      }
    );
  }

  else if (command === "details") {
    let ID = args[1]?.replace("#", "");
    if (!ID) return api.sendMessage("Bạn phải nhập ID GiveAway!", threadID, messageID);
    let data = global.data.GiveAway.get(ID);
    if (!data) return api.sendMessage("ID GiveAway không tồn tại!", threadID, messageID);

    api.sendMessage(
      `====== Give Away ======\nCreated by: ${data.author} (${data.authorID})\nReward: ${data.reward}\nID GiveAway: #${data.ID}\nSố người tham gia: ${data.joined.length}\nTrạng thái: ${data.status}`,
      threadID,
      messageID
    );
  }

  else if (command === "join") {
    let ID = args[1]?.replace("#", "");
    if (!ID) return api.sendMessage("Bạn phải nhập ID GiveAway!", threadID, messageID);
    let data = global.data.GiveAway.get(ID);
    if (!data) return api.sendMessage("ID GiveAway không tồn tại!", threadID, messageID);

    if (data.joined.includes(senderID)) return api.sendMessage("Bạn đã tham gia giveaway này", threadID);
    data.joined.push(senderID);
    global.data.GiveAway.set(ID, data);

    let threadInfo = await api.getThreadInfo(threadID);
    let name = threadInfo.nicknames[senderID] || (await Users.getInfo(senderID)).name;
    api.sendMessage(`${name} đã tham gia thành công giveaway có ID: #${ID}`, threadID);
  }

  else if (command === "roll") {
    let ID = args[1]?.replace("#", "");
    if (!ID) return api.sendMessage("Bạn phải nhập ID GiveAway!", threadID, messageID);
    let data = global.data.GiveAway.get(ID);
    if (!data) return api.sendMessage("ID GiveAway không tồn tại!", threadID, messageID);
    if (data.authorID !== senderID) return api.sendMessage("Bạn không phải người chủ trì giveaway này!", threadID);

    if (data.joined.length === 0) return api.sendMessage("Không có người tham gia giveaway!", threadID);

    let winnerID = data.joined[Math.floor(Math.random() * data.joined.length)];
    let userInfo = await Users.getInfo(winnerID);
    api.sendMessage({
      body: `Chúc mừng ${userInfo.name}, bạn đã thắng giveaway có ID: #${data.ID}\nLiên hệ: ${data.author} (https://fb.me/${data.authorID})`,
      mentions: [{ tag: userInfo.name, id: winnerID }]
    }, threadID);
  }

  else if (command === "end") {
    let ID = args[1]?.replace("#", "");
    if (!ID) return api.sendMessage("Bạn phải nhập ID GiveAway!", threadID, messageID);
    let data = global.data.GiveAway.get(ID);
    if (!data) return api.sendMessage("ID GiveAway không tồn tại!", threadID, messageID);
    if (data.authorID !== senderID) return api.sendMessage("Bạn không phải người chủ trì giveaway này!", threadID);

    data.status = "ended";
    global.data.GiveAway.set(ID, data);

    if (data.messageID) api.unsendMessage(data.messageID);
    api.sendMessage(`GiveAway có ID: #${data.ID} đã kết thúc bởi ${data.author}`, threadID);
  }

  else return api.sendMessage("Lệnh không hợp lệ! Vui lòng dùng: create/details/join/roll/end", threadID, messageID);
};
