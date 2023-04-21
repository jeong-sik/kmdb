const cheerio = require("cheerio");
const axios = require("axios");
const puppeteer = require("puppeteer");
const timeOut = 100 * 1000;

function parseMetaData($) {
  const titleKr = $(".na1").first().text().trim();
  const [titleEn, fullYear] = $(".na2")
    .first()
    .text()
    .trim()
    .split("ㆍ")
    .map((item) => item.trim());
  const directorName = $(".desc > dl")
    .first()
    .children()
    .filter((index, item) => item.firstChild.data === "감독")
    .first()
    .next()
    .text()
    .trim();

  const hasImageSection = $("#db-tab-menu4_2")
    .first()
    .children("a")
    .filter((_, item) => {
      return item.firstChild.data.includes("포스터");
    })
    .first()
    .first();

  // $(".jsBtnImage").first()

  const bigImageUrls = $(".mVImage1 > div > div").length;
  console.log("big" + bigImageUrls);

  // http://file.koreafilm.or.kr/poster/99/17/54/DPK018402_01.jpg&imgId=67901&imgType=P'
  const year = fullYear.split("\n")[0];

  console.log(titleKr);
  console.log(titleEn);
  console.log(year);
  console.log(directorName);
  console.log(hasImageSection);
  return {
    titleKr,
    titleEn,
    year,
    directorName,
    hasPosterImageSection: Boolean(hasImageSection)
  }
}

puppeteer
  .launch({
    headless: true,
    slowMo: 30,
    args: [
      "--window-size=800x600",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
    ],
  })
  .then(async (browser) => {
    const page = await browser.newPage();
    await page.setRequestInterception(false);
    const response = await page.goto(
      "https://www.kmdb.or.kr/db/kor/detail/movie/K/22692/own/image",
      { waitUntil: "networkidle2", timeout: 25000 }
    );
    const text = await response.text();
    // const json = await response.json()
    // console.log(text);
    const $ = cheerio.load(text);
    parseMetaData($);
    // const titleKr = response.$(".na1").first().text().trim()
    // console.log("pptr", titleKr)
    await page.close();
    await browser.close();
  });

// async function getUrl() {
//   const data = await axios.get(
//     "https://www.kmdb.or.kr/db/kor/detail/movie/K/22692/own/image"
//   );
//   const $ = cheerio.load(data.data);
//   const titleKr = $(".na1").first().text().trim();
//   const [titleEn, fullYear] = $(".na2")
//     .first()
//     .text()
//     .trim()
//     .split("ㆍ")
//     .map((item) => item.trim());
//   const directorName = $(".desc > dl")
//     .first()
//     .children()
//     .filter((index, item) => item.firstChild.data === "감독")
//     .first()
//     .next()
//     .text()
//     .trim();

//   const hasImageSection = $("#db-tab-menu4_2")
//     .first()
//     .children("a")
//     .filter((_, item) => {
//       return item.firstChild.data.includes("포스터");
//     })
//     .first()
//     .first();

//   // $(".jsBtnImage").first()

//   const bigImageUrls = $(".mVImage1 > div > div").length;
//   console.log("big" + bigImageUrls);

//   // http://file.koreafilm.or.kr/poster/99/17/54/DPK018402_01.jpg&imgId=67901&imgType=P'
//   const year = fullYear.split("\n")[0];
//   // console.log(titleKr);
//   // console.log(titleEn);
//   // console.log(year);
//   // console.log(directorName);
//   // console.log(hasImageSection);
// }

// getUrl();
//  async getDetail(url) {
//     return await axios
//       .get(`https://pilly.kr/product/${url}`)
//       .then(async (data) => {
//         const $ = cheerio.load(data.data);
//         let contentImg = [];
//         let description = "";
//         $(".container").each((index, elem) => {
//           contentImg = $(elem).find(".info > article > div > img").attr("src");

//           description = $(elem).find("aside .description").text();
//         });

//         console.log(contentImg);
//         return {
//           contentImg,
//           description,
//         };
//       });
//   }
