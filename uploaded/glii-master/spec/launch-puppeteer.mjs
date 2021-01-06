import puppeteer from "puppeteer";
import { resolve, join, dirname } from "path";

import handler from "serve-handler";
import http from "http";

const port = 7000;

const server = http.createServer((request, response) => {
	// You pass two more arguments for config and middleware
	// More details here: https://github.com/vercel/serve-handler#options
	return handler(request, response);
});

server.listen(port, () => {
	console.log("temp webserver running at http://localhost:7000");
});

(async () => {
	const browser = await puppeteer.launch({
		args: [
			"--no-sandbox",
			"--disable-setuid-sandbox",
			// 		'--disable-web-security'
		],
		// 	headless: false,
		// 	devtools: true,
	});

	const page = await browser.newPage();

	const timeout = setTimeout(() => {
		console.error("Timing out");
		process.exit(-2);
	}, 30000);

	page.on("console", (message) => {
		const type = message
			.type()
			.substr(0, 3)
			.toUpperCase();
		const fns = {
			LOG: console.log,
			ERR: console.error,
			WAR: console.warn,
			INF: console.info,
		};
		fns[type](message.text());

		if (message.text() === "Finished suite: failed") {
			clearTimeout(timeout);
			process.exit(-1);
		}
		if (message.text() === "Finished suite: passed") {
			clearTimeout(timeout);
			process.exit(0);
		}
	});

	//   await page.goto('https://127.0.0.1:5000', {waitUntil: 'networkidle2'});
	await page.goto(`http://127.0.0.1:${port}/spec/SpecRunner.html`, {
		waitUntil: "networkidle2",
	});
	//   await page.goto(runner, {waitUntil: 'networkidle2'});

	//   await browser.close();
})();
