module.exports.config = {
  name: "security",
  version: "1.1.0",
  hasPermssion: 2,
  credits: "Mehedi Hasan",
  description: "Remove users who use bad words instantly, warn spammers once then remove if repeated",
  commandCategory: "group",
  usages: "security",
  cooldowns: 5
};

const BAD_WORDS = [
  "fuck","shit","bitch","asshole","motherfucker","fucker","dick","pussy","cock","bastard",
  "slut","whore","prostitute","porn","xvideos","xnxx","pornhub","nude","sex",
  "চোদা","চুদ","চুদা","চুদবি","চোদন","গুদ","মাগী","হারামি","বেশ্যা","খানকি","ভোদা","পুটকি",
  "মাদারচোদ","বাপচোদ","হারামজাদা","চোদাচুদি","গান্ডু","হিজড়া","পোঁদ"
];

const SPAM_THRESHOLD = 15;
const SPAM_TIME_WINDOW = 2 * 60 * 1000; // 2 minutes

let userMessages = {}; 
let spamWarnings = {}; // warning state

function isSenderAdmin(api, threadID, senderID) {
  return new Promise((resolve) => {
    try {
      if (typeof api.getThreadInfo !== "function") return resolve(false);
      api.getThreadInfo(threadID, (err, info) => {
        if (err || !info) return resolve(false);
        const adminIDs = [];
        if (Array.isArray(info.adminIDs)) {
          for (const a of info.adminIDs) {
            if (typeof a === "object" && a.id) adminIDs.push(String(a.id));
            else adminIDs.push(String(a));
          }
        }
        resolve(adminIDs.includes(String(senderID)));
      });
    } catch (e) {
      return resolve(false);
    }
  });
}

function buildBadWordRegex() {
  const escaped = BAD_WORDS.map(w => w.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'));
  return new RegExp('(' + escaped.join('|') + ')', 'iu');
}
const badWordRegex = buildBadWordRegex();

module.exports.handleEvent = async function ({ api, event }) {
  try {
    const { threadID, senderID, body, attachments } = event;
    if (!threadID || !senderID) return;

    let content = "";
    if (body && typeof body === "string") content = body.trim();
    else if (attachments && attachments.length > 0) {
      const att = attachments[0];
      const type = att.type || "media";
      content = "__MEDIA__:" + type;
    } else {
      return;
    }

    // --------------------------
    // 1️⃣ Bad word check → direct remove
    // --------------------------
    if (content && body) {
      if (badWordRegex.test(content.toLowerCase())) {
        const isAdmin = await isSenderAdmin(api, threadID, senderID);
        if (isAdmin) {
          return api.sendMessage("⚠️ User used offensive language but is admin — cannot remove.", threadID);
        }
        return api.removeUserFromGroup(senderID, threadID, (err) => {
          if (err) {
            return api.sendMessage("❌ Failed to remove user. Make sure bot is admin.", threadID);
          }
          api.sendMessage("🚫 User has been removed for using offensive language.", threadID);
        });
      }
    }

    // --------------------------
    // 2️⃣ Spam check → warn then remove
    // --------------------------
    if (!userMessages[threadID]) userMessages[threadID] = {};
    if (!userMessages[threadID][senderID]) userMessages[threadID][senderID] = [];

    const now = Date.now();
    userMessages[threadID][senderID].push({ text: content, time: now });

    // শুধুমাত্র শেষ 2 মিনিটের মেসেজ রাখবে
    userMessages[threadID][senderID] = userMessages[threadID][senderID].filter(m => (now - m.time) <= SPAM_TIME_WINDOW);

    const msgs = userMessages[threadID][senderID];
    if (msgs.length >= SPAM_THRESHOLD) {
      const isAdmin = await isSenderAdmin(api, threadID, senderID);
      if (isAdmin) {
        userMessages[threadID][senderID] = [];
        return api.sendMessage("⚠️ Spamming detected but user is admin — skipped.", threadID);
      }

      if (!spamWarnings[threadID]) spamWarnings[threadID] = {};
      if (!spamWarnings[threadID][senderID]) {
        spamWarnings[threadID][senderID] = true;
        api.sendMessage(`⚠️ Warning: Stop spamming, or you will be removed!`, threadID);
        userMessages[threadID][senderID] = []; 
      } else {
        return api.removeUserFromGroup(senderID, threadID, (err) => {
          if (err) {
            return api.sendMessage("❌ Failed to remove spammer. Ensure bot is admin.", threadID);
          }
          api.sendMessage("🚫 User removed for repeated spamming.", threadID);
          userMessages[threadID][senderID] = [];
          spamWarnings[threadID][senderID] = false;
        });
      }
    }

  } catch (e) {
    console.error(e);
  }
};

module.exports.run = async function ({ api, event }) {
  const { threadID } = event;
  if (!threadID) return;
  return api.sendMessage(
    `✅ Security module active.\n- Bad words: ${BAD_WORDS.length}\n- Spam threshold: ${SPAM_THRESHOLD}\n- Action: Warn once, then remove`,
    threadID
  );
};
