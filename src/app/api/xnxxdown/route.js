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
        url
    } = req.query;
    const proxyUrl = getRandomProxy();
    const agent = new HttpsProxyAgent(proxyUrl);

    try {
        const result = await axios.get(url, {
            method: 'get',
            httpsAgent: agent,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 10000
        });

        const $ = cheerio.load(result.data);
        const title = $("#video-content-metadata > div.clear-infobar > div.video-title-container > div > strong").text().replace(/&commat;/gi, "@");
        const thumb = $("meta[property='og:image']").attr("content");
        const keyword = $("meta[name='keywords']").attr("content");
        const duration = $("span.metadata").text().replace(/\n/gi, "").split("\t\t\t\t\t")[1].split(/-/)[0];
        const quality = $("span.metadata").text().trim().split("- ")[1].replace(/\t\t\t\t\t/, "");
        const viewers = $("span.metadata").text().trim().split("p")[1].split("- ")[1];
        const embedValue = $('#copy-video-embed').attr('value');
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

        res.status(200).json(resultData);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
}
