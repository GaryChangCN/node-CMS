'use strict';
// Run manually: PUPPETEER_CACHE_DIR=/path/to/cache node test/pdf-smoke.js
// Requires a host capable of launching sandboxed Chromium. Never add --no-sandbox.
const assert = require('node:assert/strict');
const path = require('node:path');
const template = require('art-template');
const { prepareData, renderPdf } = require('../lib/pdf-export');

(async function () {
    const data = await prepareData({
        head: ['CMS security regression'], title: 'Invoice 测试', numberValue: '../../outside',
        tableList: [{ name: '<script>alert(1)</script>', count: 1, media: 'http://127.0.0.1/private' }]
    }, path.join(__dirname, '../public/pic'));
    const html = template(path.join(__dirname, '../views/orderPageTemplate'), data);
    assert.ok(!html.includes('<script>'));
    const bytes = await renderPdf(html, require('puppeteer'));
    assert.equal(bytes.subarray(0, 5).toString(), '%PDF-');
    assert.ok(bytes.length > 1000);
    console.log('Sandboxed Chromium PDF smoke passed: ' + bytes.length + ' bytes');
})().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
});
