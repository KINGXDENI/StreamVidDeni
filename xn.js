const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
// const {
//     HttpsProxyAgent
// } = require('https-proxy-agent');

// // Fungsi untuk memilih proxy secara acak dari daftar
// function getRandomProxy() {
//     const proxies = fs.readFileSync('proxies.txt', 'utf8').split('\n').map(proxy => proxy.trim());
//     const randomIndex = Math.floor(Math.random() * proxies.length);
//     const [host, port, username, password] = proxies[randomIndex].split(':');
//     return `http://${username}:${password}@${host}:${port}`;
// }

function xnxx() {
    return new Promise(async (resolve, reject) => {
        const baseurl = 'https://www.xnxx.com/todays-selection';

        // // Pilih proxy secara acak
        // const proxyUrl = getRandomProxy();
        // const agent = new HttpsProxyAgent(proxyUrl);

        // const axiosConfig = {
        //     httpsAgent: agent,
        //     headers: {
        //         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        //     },
        //     timeout: 10000 // Atur batas waktu (10 detik)
        // };

        try {
            const {
                data
            } = await axios.get(`${baseurl}`);
            let $ = cheerio.load(data, {
                xmlMode: false
            });
            let title = [];
            let url = [];
            let views = [];
            let thumb = [];
            let rate = [];
            let duration = [];
            let results = [];

            $('div.mozaique').each((a, b) => {
                $(b).find('div.thumb').each((c, d) => {
                    url.push(baseurl + $(d).find('a').attr('href').replace("/THUMBNUM/", "/"));
                    thumb.push($(d).find("img").attr("data-src"));
                });
            });

            $('div.mozaique').each((a, b) => {
                $(b).find('div.thumb-under').each((c, d) => {
                    views.push($(d).find('p.metadata > span.right').text().replace(/\n/, "").split(" ")[0]);
                    rate.push($(d).find("p.metadata > span.video-hd").text().replace(/ /gi, "").split("-")[1]);
                    const metadataText = $(d).find("p.metadata").text();
                    const durationMatch = metadataText.match(/(\d+min)/);
                    duration.push(durationMatch ? durationMatch[1] : "Unknown");
                    $(d).find('a').each((e, f) => {
                        title.push($(f).attr('title'));
                    });
                });
            });

            for (let i = 0; i < title.length; i++) {
                results.push({
                    title: title[i],
                    views: views[i],
                    quality: rate[i],
                    duration: duration[i],
                    thumb: thumb[i],
                    link: url[i]
                });
            }
            resolve(results);
        } catch (err) {
            reject(err);
        }
    });
}
function xnxxsearch(query) {
    return new Promise(async (resolve, reject) => {
        const baseurl = 'https://www.xnxx.com';

        // Pilih proxy secara acak
        const proxyUrl = getRandomProxy();
        const agent = new HttpsProxyAgent(proxyUrl);

        const axiosConfig = {
            httpsAgent: agent,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 10000 // Atur batas waktu (10 detik)
        };

        try {
            const {
                data
            } = await axios.get(`${baseurl}/search/${query}/${Math.floor(Math.random() * 9) + 1}`, axiosConfig);
            let $ = cheerio.load(data, {
                xmlMode: false
            });
            let title = [];
            let url = [];
            let views = [];
            let thumb = [];
            let rate = [];
            let duration = [];
            let results = [];

            $('div.mozaique').each((a, b) => {
                $(b).find('div.thumb').each((c, d) => {
                    url.push(baseurl + $(d).find('a').attr('href').replace("/THUMBNUM/", "/"));
                    thumb.push($(d).find("img").attr("data-src"));
                });
            });

            $('div.mozaique').each((a, b) => {
                $(b).find('div.thumb-under').each((c, d) => {
                    views.push($(d).find('p.metadata > span.right').text().replace(/\n/, "").split(" ")[0]);
                    rate.push($(d).find("p.metadata > span.video-hd").text().replace(/ /gi, "").split("-")[1]);
                    duration.push($(d).find("p.metadata").text().replace(/(\n| )/gi, "").split("%")[1].split("-")[0]);
                    $(d).find('a').each((e, f) => {
                        title.push($(f).attr('title'));
                    });
                });
            });

            for (let i = 0; i < title.length; i++) {
                results.push({
                    title: title[i],
                    views: views[i],
                    quality: rate[i],
                    duration: duration[i],
                    thumb: thumb[i],
                    link: url[i]
                });
            }
            resolve(results);
        } catch (err) {
            reject(err);
        }
    });
}

function xnxxdown(url) {
    return new Promise(async (resolve, reject) => {
        const proxyUrl = getRandomProxy();
        const agent = new HttpsProxyAgent(proxyUrl);

        try {
            const result = await axios.request(url, {
                method: "get",
                httpsAgent: agent,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                },
                timeout: 10000 // Atur batas waktu (10 detik)
            });

            const $ = cheerio.load(result.data, {
                xmlMode: false
            });



            const title = $("#video-content-metadata > div.clear-infobar > div.video-title-container > div > strong").text().replace(/&commat;/gi, "@");
            const thumb = $("meta[property='og:image']").attr("content");
            const keyword = $("meta[name='keywords']").attr("content");
            const duration = $("span.metadata").text().replace(/\n/gi, "").split("\t\t\t\t\t")[1].split(/-/)[0];
            const quality = $("span.metadata").text().trim().split("- ")[1].replace(/\t\t\t\t\t/, "");
            const viewers = $("span.metadata").text().trim().split("p")[1].split("- ")[1];
            // const videoUrl = $("#video-content-metadata > div.metadata-row.tabs > #tabDownload > p > a").attr("href");
            // console.log(`Extracted video URL: ${videoUrl}`);
            // Ambil nilai atribut `value` dari elemen input
            const embedValue = $('#copy-video-embed').attr('value');


            // Ekstrak URL `src` dari nilai `value` menggunakan regex
            const iframeSrcMatch = embedValue.match(/src="([^"]+)"/);
            const iframeSrc = iframeSrcMatch ? iframeSrcMatch[1] : 'SRC not found';
            let videoUrlLow, videoUrlHigh, videoHLS;
            $('script').each((i, elem) => {
                const scriptContent = $(elem).html();
                const matchLow = scriptContent.match(/html5player\.setVideoUrlLow\('([^']+)'\)/);
                const matchHigh = scriptContent.match(/html5player\.setVideoUrlHigh\('([^']+)'\)/);
                const matchHLS = scriptContent.match(/html5player\.setVideoHLS\('([^']+)'\)/);
                if (matchLow) videoUrlLow = matchLow[1];
                if (matchHigh) videoUrlHigh = matchHigh[1];
                if (matchHLS) videoHLS = matchHLS[1];
            });

            const resultData = {
                title: title,
                keyword: keyword,
                duration: duration,
                quality: quality,
                views: viewers + " views",
                thumb: thumb,
                iframeSrc: iframeSrc,
                urlLow: videoUrlLow || 'URL Low not found',
                urlHigh: videoUrlHigh || 'URL High not found',
                urlHLS: videoHLS || 'URL HLS not found'
            };

            resolve(resultData);
        } catch (err) {
            reject(err);
        }
    });
}

/*
 *@ XVIDEOS
 */
function xvideossearch(query) {
    return new Promise(async (resolve, reject) => {
        await axios.request(`https://www.xvideos.com/?k=${query}&p=${Math.floor(Math.random() * 9) + 1}`, {
            method: "GET"
        }).then(async result => {
            if (isAxiosError()) throw ('axios error');
            const $ = cheerio.load(result.data, {
                xmlMode: false
            });
            let title = new Array();
            let duration = new Array();
            let quality = new Array();
            let url = new Array();
            let thumb = new Array();
            let hasil = new Array();

            $("div.mozaique > div > div.thumb-under > p.title").each(function (a, b) {
                title.push($(this).find("a").attr("title"));
                duration.push($(this).find("span.duration").text());
                url.push("https://www.xvideos.com" + $(this).find("a").attr("href"));
            });
            $("div.mozaique > div > div.thumb-under").each(function (a, b) {
                quality.push($(this).find("span.video-hd-mark").text());
            });
            $("div.mozaique > div > div > div.thumb > a").each(function (a, b) {
                thumb.push($(this).find("img").attr("data-src"));
            });
            for (let i = 0; i < title.length; i++) {
                hasil.push({
                    title: title[i],
                    duration: duration[i],
                    quality: quality[i],
                    thumb: thumb[i],
                    url: url[i]
                });
            }
            resolve(hasil);
        }).catch(reject);
    });
}

function xvideosdown(url) {
    return new Promise(async (resolve, reject) => {
        await axios.request(url, {
            method: "GET"
        }).then(async result => {
            if (isAxiosError()) throw ('axios error');
            const $ = cheerio.load(result.data, {
                xmlMode: false
            });
            const hasil = {
                title: $("meta[property='og:title']").attr("content"),
                keyword: $("meta[name='keywords']").attr("content"),
                views: $("div#video-tabs > div > div > div > div > strong.mobile-hide").text() + " views",
                vote: $("div.rate-infos > span.rating-total-txt").text(),
                like_count: $("span.rating-good-nbr").text(),
                dislike_count: $("span.rating-bad-nbr").text(),
                thumb: $("meta[property='og:image']").attr("content"),
                url: $("#html5video > #html5video_base > div > a").attr("href")
            };
            resolve(hasil);
        }).catch(reject);
    });
}

function pornhubsearch(query) {
    return new Promise(async (resolve, reject) => {
        let baseURL = "https://www.pornhub.com";
        await axios.request({
            method: "GET",
            url: baseURL + "/video/search?search=" + query
        }).then(async ({
            data
        }) => {
            if (isAxiosError()) throw ('axios error');
            const $ = cheerio.load(data, {
                xmlMode: false
            });
            let result = new Array();
            let viewers = new Array();
            $("a.linkVideoThumb").get().map(map => {
                if ($(map).attr("href") !== "javascript:void(0)") {
                    result.push({
                        title: $(map).find("img").attr("alt"),
                        duration: $(map).find("var").text(),
                        thumbnail: $(map).find("img").attr("data-src"),
                        url: baseURL + $(map).attr("href")
                    });
                }
            });
            $("div.videoDetailsBlock").get().map(m => {
                viewers.push({
                    viewers: $(m).find("span.views").text(),
                    rating: $(m).find("div.value").text(),
                    published: $(m).find("var.added").text()
                });
            });
            for (let i = 0; i < result.length; i++) {
                result[i].viewers = viewers[i].viewers;
                result[i].rating = viewers[i].rating;
                result[i].published = viewers[i].published;
            }
            resolve(result);
        }).catch(reject);
    });
}

function bokepbub(query) {
    return new Promise(async (resolve, reject) => {
        await axios.get("https://bokephub.cc/?s=" + query).then(respon => {
            if (isAxiosError()) throw ('axios error');
            const $ = cheerio.load(respon.data);
            let hasil = new Array();
            $("div > article").each(function (a, b) {
                hasil.push({
                    title: $(this).find("a").attr("title"),
                    thumb: $(this).find("img").attr("data-src"),
                    url: $(this).find("a").attr("href")
                });
            });
            resolve(hasil);
        }).catch(reject);
    });
}

// xnxxsearch('japanese')
//     .then(result => console.log(result))
//     .catch(error => console.error(error));

// xnxxdown('https://www.xnxx.com/video-d84crf0/humping_the_cock_and_she_has_more_to_go')
//     .then(result => console.log(result))
//     .catch(error => console.error(error));
xnxx()
    .then(result => console.log(result))
    .catch(error => console.error(error));
    