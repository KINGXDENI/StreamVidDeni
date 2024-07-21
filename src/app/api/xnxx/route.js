import fs from 'fs';
import axios from 'axios';
import cheerio from 'cheerio';


export async function GET(request) {
    const baseurl = 'https://www.xnxx.com/todays-selection';

    try {
        const {
            data
        } = await axios.get(baseurl);
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
