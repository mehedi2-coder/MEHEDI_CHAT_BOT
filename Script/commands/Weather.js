const axios = require("axios");
const moment = require("moment-timezone");

module.exports.config = {
	name: "weather",
	version: "2.0.0",
	hasPermssion: 0,
	credits: "Mehedi Hasan x Xenobot", //© Don't Remove Credits
	description: "Check live weather info for any city",
	commandCategory: "Utility",
	usages: "[city name]",
	cooldowns: 5,
	envConfig: {
		OPEN_WEATHER: "b7f1db5959a1f5b2a079912b03f0cd96"
	}
};

module.exports.run = async ({ api, event, args }) => {
	const city = args.join(" ");
	if (!city) return api.sendMessage("📍 অনুগ্রহ করে শহরের নাম লিখুন!\n\nউদাহরণ: weather Dhaka", event.threadID);

	const apiKey = module.exports.config.envConfig.OPEN_WEATHER;
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=en`;

	try {
		const res = await axios.get(url);
		const data = res.data;

		const sunrise = moment.unix(data.sys.sunrise).tz("Asia/Dhaka").format("hh:mm A");
		const sunset = moment.unix(data.sys.sunset).tz("Asia/Dhaka").format("hh:mm A");
		const temp = data.main.temp.toFixed(1);
		const feelsLike = data.main.feels_like.toFixed(1);
		const humidity = data.main.humidity;
		const wind = data.wind.speed;
		const description = data.weather[0].description;
		const lat = data.coord.lat;
		const lon = data.coord.lon;

		const message = 
`╭•┄┅═══❁🌍❁═══┅┄•╮

╔═══❖🌤️❖═══╗
   Weather Report
╚═══❖🌦️❖═══╝

📍 শহর: ${data.name}, ${data.sys.country}

🌡️ তাপমাত্রা: ${temp}°C
🥶 অনুভূত তাপমাত্রা: ${feelsLike}°C
☁️ আকাশ: ${description}
💧 আর্দ্রতা: ${humidity}%
💨 বাতাসের গতি: ${wind} km/h
🌅 সূর্যোদয়: ${sunrise}
🌇 সূর্যাস্ত: ${sunset}

📌 অবস্থান: [${lat}, ${lon}]

╰•┄┅═══❁🌎❁═══┅┄•╯`;

		api.sendMessage({ body: message }, event.threadID);

	} catch (error) {
		if (error.response && error.response.status === 404) {
			return api.sendMessage(`❌ শহর "${city}" পাওয়া যায়নি। অনুগ্রহ করে সঠিক নাম দিন।`, event.threadID);
		} else {
			console.error(error);
			return api.sendMessage("⚠️ আবহাওয়ার তথ্য আনতে সমস্যা হয়েছে। পরে চেষ্টা করুন।", event.threadID);
		}
	}
};
