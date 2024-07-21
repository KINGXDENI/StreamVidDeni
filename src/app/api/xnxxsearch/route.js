import axios from 'axios';
import cheerio from 'cheerio';
import HttpsProxyAgent from 'https-proxy-agent';
import fs from 'fs';

const getRandomProxy = () => {
    const proxies = fs.readFileSync('proxies.txt', 'utf8').split('\n').map(proxy => proxy.trim());
    const randomIndex = Math.floor(Math.random() * proxies.length);
    const [host, port, username, password] = proxies[randomIndex].split(':');
    return `http://${username}:${password}@${host}:${port}`;
};

export default async function handler(req, res) {
    const {
        query
    } = req.query;
    const baseurl = 'https://www.xnxx.com';
    const proxyUrl = getRandomProxy();
    const agent = new HttpsProxyAgent(proxyUrl);

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
        } = await axios.get(`${baseurl}/search/${query}/${Math.floor(Math.random() * 9) + 1}`, axiosConfig);
        const $ = cheerio.load(data);
       

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

        const results = title.map((title, i) => ({
            title: title,
            views: views[i],
            quality: rate[i],
            duration: duration[i],
            thumb: thumb[i],
            link: url[i]
        }));

        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
}
