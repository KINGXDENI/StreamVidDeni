const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');
async function DoujindesuLatest() {
    try {
        // Fetch HTML content using Axios
        const response = await axios.get('https://doujindesu.tv');
        const bodyContent = response.data;

        // Use Cheerio to manipulate the HTML
        const $ = cheerio.load(bodyContent);

        // Extract titles, URLs, and thumbnails based on provided selectors
        const items = [];
        for (let i = 1; i <= 12; i++) {
            const urlSelector = `#archives > div > article:nth-child(${i}) > div > a`;
            const thumbSelector = `#archives > div > article:nth-child(${i}) > a > figure > img`;
            const titleSelector = `#archives > div > article:nth-child(${i}) > div > a > h3`;

            const url = `https://doujindesu.tv${$(urlSelector).attr('href')}`;
            const thumbnailURL = $(thumbSelector).attr('src');
            const title = $(titleSelector).text().trim();

            items.push({
                title,
                url,
                thumbnailURL
            });
        }

        // Return the extracted data or do further processing
        return items;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function DoujindesuLatestPuppet() {
    try {
        const browser = await puppeteer.launch({
            headless: 'new', // Set to true for headless mode
        });

        const page = await browser.newPage();

        // Set the user agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        await page.goto('https://doujindesu.tv/', {
            waitUntil: 'domcontentloaded',
        });

        // Wait for some time to ensure JavaScript is executed
        await page.waitForTimeout(8000);

        // Get the HTML content after navigating to the URL
        const bodyContent = await page.content();

        // Use Cheerio to manipulate the HTML
        const $ = cheerio.load(bodyContent);

        // Extract titles, URLs, and thumbnails based on provided selectors
        const items = [];
        for (let i = 1; i <= 12; i++) { // Change the loop limit based on the number of articles you want to 
            const urlSelector = `#archives > div > article:nth-child(${i}) > div > a`;
            const thumbSelector = `#archives > div > article:nth-child(${i}) > a > figure > img`;
            const titleSelector = `#archives > div > article:nth-child(${i}) > div > a > h3`;

            const url = `https://doujindesu.tv${$(urlSelector).attr('href')}`;
            const thumbnailURL = $(thumbSelector).attr('src');
            const title = $(titleSelector).text().trim();

            items.push({
                title,
                url,
                thumbnailURL
            });
        }

        // Close the browser
        await browser.close();

        // Return the extracted data or do further processing
        return items;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function DoujindesuDetailsAndChapters(url) {
    try {
        // Fetch HTML content using Axios
        const response = await axios.get(url);
        const bodyContent = response.data;

        // Use Cheerio to manipulate the HTML
        const $ = cheerio.load(bodyContent);

        // Extract details from metadata
        const details = {};
        $('.metadata table tbody tr').each((index, element) => {
            const key = $(element).find('td').eq(0).text().trim();
            const value = $(element).find('td').eq(1).text().trim();
            details[key] = value;
        });

        // Extract chapters
        const chapters = [];
        $('#chapter_list li').each((index, element) => {
            const chapterNumber = $(element).find('div.epsright span.eps a chapter').text().trim();
            const chapterTitle = $(element).find('div.epsleft span.lchx a').text().trim();
            const chapterDate = $(element).find('div.epsleft span.date').text().trim();
            const chapterDownloadLink = $(element).find('div.chright span.linkdl a').attr('href');
            const chapterUrl = `https://doujindesu.tv${$(element).find('div.epsleft span.lchx a').attr('href')}`;

            chapters.push({
                chapterNumber,
                chapterTitle,
                chapterDate,
                chapterUrl,
                chapterDownloadLink,
            });
        });

        // Extract title, alter title, and thumbnail
        const title = $('#archive > div > section > h1').text().trim();
        const alterTitle = $('#archive > div > section > h1 > span > i').text().trim();
        const thumbnail = $('#archive > div > aside > figure > a > img').attr('src');

        return {
            title,
            alterTitle,
            thumbnail,
            details,
            chapters,
        };
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function DoujindesuDetailsAndChaptersPuppet(url) {
    try {
        const browser = await puppeteer.launch({
            headless: 'new',
        });

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        await page.goto(url, {
            waitUntil: 'domcontentloaded',
        });

        // Wait for some time to ensure the result is loaded
        await page.waitForTimeout(8000);

        // Get the HTML content after navigating to the URL
        const bodyContent = await page.content();

        // Use Cheerio to manipulate the HTML
        const $ = cheerio.load(bodyContent);

        // Extract details from metadata
        const details = {};
        $('.metadata table tbody tr').each((index, element) => {
            const key = $(element).find('td').eq(0).text().trim();
            const value = $(element).find('td').eq(1).text().trim();
            details[key] = value;
        });

        // Extract chapters
        const chapters = [];
        $('#chapter_list li').each((index, element) => {
            const chapterNumber = $(element).find('div.epsright span.eps a chapter').text().trim();
            const chapterTitle = $(element).find('div.epsleft span.lchx a').text().trim();
            const chapterDate = $(element).find('div.epsleft span.date').text().trim();
            const chapterDownloadLink = $(element).find('div.chright span.linkdl a').attr('href');
            const chapterUrl = `https://doujindesu.tv${$(element).find('div.epsleft span.lchx a').attr('href')}`;

            chapters.push({
                chapterNumber,
                chapterTitle,
                chapterDate,
                chapterUrl,
                chapterDownloadLink,
            });
        });

        // Extract title, alter title, and thumbnail
        const title = $('#archive > div > section > h1').text().trim();
        const alterTitle = $('#archive > div > section > h1 > span > i').text().trim();
        const thumbnail = $('#archive > div > aside > figure > a > img').attr('src');

        // Close the browser
        await browser.close();

        return {
            title,
            alterTitle,
            thumbnail,
            details,
            chapters,
        };
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Example usage
async function DoujindesuChapterDetailImages(url) {
    try {
        const browser = await puppeteer.launch({
            headless: 'new',
        });

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        await page.goto(url, {
            waitUntil: 'domcontentloaded',
        });

        // Wait for some time to ensure the result is loaded
        await page.waitForTimeout(8000);

        // Get the HTML content after navigating to the URL
        const bodyContent = await page.content();

        // Use Cheerio to manipulate the HTML
        const $ = cheerio.load(bodyContent);

        // Extract title from the specified selector
        const title = $('#weekly-trending > header > h1').text().trim();

        // Extract images from the specified ID
        const images = [];
        $('#anu img').each((index, element) => {
            const imageUrl = $(element).attr('src');
            images.push(imageUrl);
        });

        // Close the browser
        await browser.close();

        return {
            title,
            images,
        };
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function DoujindesuChapterDetailImages2(url) {
    try {
        // Fetch HTML content using Axios
        const response = await axios.get(url);
        const bodyContent = response.data;

        // Use Cheerio to manipulate the HTML
        const $ = cheerio.load(bodyContent);

        // Extract title from the specified selector
        const title = $('#weekly-trending > header > h1').text().trim();

        // Extract images from the specified ID
        const images = [];
        $('#anu img').each((index, element) => {
            const imageUrl = $(element).attr('src');
            images.push(imageUrl);
        });

        return {
            title,
            images,
        };
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

module.exports = {
    DoujindesuLatest,
    DoujindesuChapterDetailImages,
    DoujindesuDetailsAndChapters
};