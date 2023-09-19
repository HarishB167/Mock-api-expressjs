require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const SocketServer = require("./socketServer");
const persistentClient = require("./services/persistentClient");
// const analyticsService = require("./services/googleAnalyticsService");

const socketServer = new SocketServer(server);

const page_url = "https://www.nseindia.com/get-quotes/equity?symbol=LT";

let headers = {
  Host: "www.nseindia.com",
  Referer: "https://www.nseindia.com/get-quotes/equity?symbol=SBIN",
  "X-Requested-With": "XMLHttpRequest",
  pragma: "no-cache",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
  Accept: "*/*",
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
};

app.use(cors());

app.get("/quote/:name", async (req, res) => {
  const url =
    "https://www.nseindia.com/api/quote-equity?symbol=" +
    req.params.name.toUpperCase();
  const client = persistentClient();
  await client.get(page_url);
  try {
    const { data } = await client.get(url, headers);
    res.send(data);
  } catch (e) {
    res.send("Error " + JSON.stringify(e, null, 4) + e.toString());
  }
});

app.get("/search/:name", async (req, res) => {
  const url =
    "https://www.nseindia.com/api/search/autocomplete?q=" + req.params.name;
  const client = persistentClient();
  await client.get(page_url);
  try {
    const { data } = await client.get(url, headers);
    res.send(data);
  } catch (e) {
    res.send("Error " + JSON.stringify(e, null, 4) + e.toString());
  }
});

const news_api_url =
  "https://api.hindustantimes.com/api/app/homenew/sectionfeed/v2/latest?size=15";

app.get("/news", async (req, res) => {
  const client = persistentClient();
  try {
    const { data } = await client.get(news_api_url);
    res.send(data);
  } catch (e) {
    res.send("Error " + JSON.stringify(e, null, 4) + e.toString());
  }
});

app.use(express.static("public"));

server.listen(3000, () => console.log("Server started..."));

// analyticsService.runRealtimeReport();
