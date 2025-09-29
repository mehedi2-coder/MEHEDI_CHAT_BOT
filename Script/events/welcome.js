module.exports.config = {
  name: "welcome",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Mehedi Hasan",
  description: "Send a welcome message to new member with mention and rules",
  commandCategory: "group",
  usages: "",
  cooldowns: 0
};

module.exports.run = async function({ api, event }) {
  return;
};

module.exports.handleEvent = async function({ api, event, Users }) {
  const { type, logMessageData, threadID } = event;

  if (type !== "log:subscribe") return;

  const addedParticipants = logMessageData.addedParticipants;
  if (!addedParticipants || addedParticipants.length === 0) return;

  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const totalMembers = threadInfo.participantIDs.length;

    for (const member of addedParticipants) {
      const userID = member.userFbId || member.id;
      const userName = member.fullName || "নতুন সদস্য";

      const mention = [{
        id: userID,
        tag: userName
      }];

      const welcomeMessage = `
🌟✨ Welcome ✨🌟

👋 হ্যালো ${userName}!
🎉 আপনাকে স্বাগতম *${threadInfo.name}* গ্রুপে।
🌈 আপনি আমাদের *#${totalMembers}তম সদস্য*!  

💌 𝗚𝗥𝗢𝗨𝗣 𝗥𝗨𝗟𝗘𝗦:
🟢 ভদ্র আচরণ বজায় রাখুন।
🔵 গ্রুপে স্প্যাম করবেন না।
🟡 নতুন বন্ধুদের সাথে পরিচিত হয়ে নিব।
🟠 ব্যক্তিগত তথ্য শেয়ার করবেন না।
🔴 মজা ও আনন্দ করুন, অপ্রয়োজনীয় তর্ক থেকে বিরত থাকুন! 😄

🎁 আশা করি এখানে থাকবেন মজা এবং শেখার জন্য!
`;

      await api.sendMessage({ body: welcomeMessage, mentions: mention }, threadID);
    }

    console.log("✅ নতুন মেম্বারের জন্য সাজানো স্বাগতম বার্তা পাঠানো হয়েছে!");
  } catch (err) {
    console.error("❌ স্বাগতম বার্তা পাঠাতে সমস্যা হয়েছে:", err);
  }
};
