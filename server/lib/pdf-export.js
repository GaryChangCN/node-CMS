'use strict';

const fs = require('node:fs/promises');
const { constants } = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const fields = ('title number numberValue saleManager saleManagerValue date dateValue money moneyValue ' +
    'company companyValue customer customerValue contact contactValue index productName productNumber ' +
    'productPicture productPrice productCount productSingleSum sum sumValue tax taxValue discount ' +
    'discountValue bigSum bigSumValue board boardValue adminBoard adminBoardValue').split(' ');
const rowFields = ['index2', 'name', 'number', 'price', 'count', 'singleSum'];
function invalid() {
    return Object.assign(new Error('Invalid PDF data'), { status: 400 });
}
function scalar(value) {
    if (value == null) return '';
    if (typeof value !== 'string' && typeof value !== 'number') throw invalid();
    if (typeof value === 'number' && !Number.isFinite(value)) throw invalid();
    const text = String(value);
    if (text.length > 4096) throw invalid();
    return text;
}

// Never fetch user-supplied URLs. Only raster files in our upload directory may be embedded.
async function localImage(media, imageDir, budget) {
    if (typeof media !== 'string' || !/^\/api\/media\/pic\/[a-zA-Z0-9_-]+\.(png|jpe?g|gif|webp)$/i.test(media)) return '';
    const file = path.join(imageDir, path.basename(media));
    let handle;
    try {
        handle = await fs.open(file, constants.O_RDONLY | constants.O_NOFOLLOW);
        const stat = await handle.stat();
        if (!stat.isFile() || stat.size > 2 * 1024 * 1024 || stat.size > budget.remaining) return '';
        // Bound the read even if a file grows after stat().
        const data = Buffer.alloc(stat.size + 1);
        const { bytesRead } = await handle.read(data, 0, data.length, 0);
        if (bytesRead !== stat.size) return '';
        const bytes = data.subarray(0, bytesRead);
        let mime;
        if (bytes.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))) mime = 'image/png';
        else if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) mime = 'image/jpeg';
        else if (/^GIF8[79]a$/.test(bytes.subarray(0, 6).toString('ascii'))) mime = 'image/gif';
        else if (bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP') mime = 'image/webp';
        else return '';
        budget.remaining -= bytesRead;
        return 'data:' + mime + ';base64,' + bytes.toString('base64');
    } catch (error) {
        if (['ENOENT', 'ELOOP', 'EACCES'].includes(error.code)) return '';
        throw error;
    } finally {
        if (handle) await handle.close();
    }
}

async function prepareData(input, imageDir) {
    if (!input || typeof input !== 'object' || Array.isArray(input) ||
        !Array.isArray(input.tableList) || input.tableList.length > 100 ||
        !Array.isArray(input.head) || input.head.length > 3) throw invalid();
    const data = {};
    fields.forEach(key => { data[key] = scalar(input[key]); });
    data.head = [0, 1, 2].map(i => scalar(input.head[i]));
    data.tableList = input.tableList.map(row => {
        if (!row || typeof row !== 'object' || Array.isArray(row)) throw invalid();
        const copy = {};
        rowFields.forEach(key => { copy[key] = scalar(row[key]); });
        return copy;
    });
    if (JSON.stringify(data).length > 256 * 1024) throw invalid();
    const budget = { remaining: 10 * 1024 * 1024 };
    for (let i = 0; i < data.tableList.length; i++) {
        data.tableList[i].media = await localImage(input.tableList[i].media, imageDir, budget);
    }
    return data;
}

async function renderPdf(html, puppeteer) {
    // Keep Chromium's sandbox enabled. Production must support sandboxed Chromium.
    const browser = await puppeteer.launch({ headless: true, timeout: 30000 });
    try {
        const page = await browser.newPage();
        await page.setJavaScriptEnabled(false);
        await page.setRequestInterception(true);
        page.on('request', request => {
            // Only the server-generated inline raster images are allowed.
            const allowed = /^data:image\/(png|jpeg|gif|webp);base64,[a-zA-Z0-9+/=]+$/.test(request.url());
            (allowed ? request.continue() : request.abort()).catch(() => {});
        });
        await page.setContent(html, { waitUntil: 'load', timeout: 15000 });
        return Buffer.from(await page.pdf({ format: 'A4', printBackground: true, timeout: 15000 }));
    } finally {
        await browser.close();
    }
}

async function writePdf(bytes, outputDir) {
    await fs.mkdir(outputDir, { recursive: true });
    // An unpredictable name, unrelated to the order number, prevents traversal and overwrites.
    const name = crypto.randomBytes(24).toString('hex') + '.pdf';
    const temporary = path.join(outputDir, '.' + name + '.tmp');
    try {
        await fs.writeFile(temporary, bytes, { flag: 'wx', mode: 0o600 });
        // Publish only a completely written file; link() also refuses to overwrite an existing name.
        await fs.link(temporary, path.join(outputDir, name));
    } finally {
        await fs.unlink(temporary).catch(error => { if (error.code !== 'ENOENT') throw error; });
    }
    return name;
}

module.exports = { prepareData, localImage, renderPdf, writePdf };
