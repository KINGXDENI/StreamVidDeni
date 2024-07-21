import fs from 'fs';
import axios from 'axios';
import cheerio from 'cheerio';
import HttpsProxyAgent from 'http-proxy-agent'; // Use http-proxy-agent as alternative

const getRandomProxy = () => {
    const proxies = fs.readFileSync('proxies.txt', 'utf8').split('\n').map(proxy => proxy.trim());
    const randomIndex = Math.floor(Math.random() * proxies.length);
    const [host, port, username, password] = proxies[randomIndex].split(':');
    return `http://${username}:${password}@${host}:${port}`;
};

export async function GET(request) {
    const baseurl = 'https://www.xnxx.com/todays-selection';
    const proxyUrl = getRandomProxy();
    const agent = new HttpsProxyAgent(proxyUrl); // Ensure correct usage

    const axiosConfig = {
        httpsAgent: agent,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
    };

    try {
        const {
            data
        } = await axios.get(baseurl, axiosConfig);
        const $ = cheerio.load(data);
        let title = [],
            url = [],
            views = [],
            thumb = [],
            rate = [],
            duration = [],
            results = [];

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
                id: (i + 1).toString(),
                title: title[i],
                channel: {
                    name: "Unknown Channel",
                    url: "https://www.xnxx.com",
                    logo: "",
                },
                views: views[i],
                postedAt: "Unknown",
                duration: duration[i],
                thumbnailURL: thumb[i],
                videoURL: url[i],
            });
        }
        return new Response(JSON.stringify(results), {
            status: 200
        });
    } catch (err) {
        return new Response(JSON.stringify({
            error: err.message
        }), {
            status: 500
        });
    }
}
