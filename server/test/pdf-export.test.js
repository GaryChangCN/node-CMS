'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { prepareData, localImage, renderPdf, writePdf } = require('../lib/pdf-export');
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64');

async function temporary(t) {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'cms-pdf-'));
    t.after(() => fs.rm(dir, { recursive: true, force: true }));
    return dir;
}

test('local raster images are embedded; arbitrary URLs, traversal and SVG are omitted', async t => {
    const dir = await temporary(t);
    await fs.writeFile(path.join(dir, 'photo.png'), png);
    const read = media => localImage(media, dir, { remaining: 1024 });
    assert.equal(await read('/api/media/pic/photo.png'), 'data:image/png;base64,' + png.toString('base64'));
    for (const media of ['http://127.0.0.1/secret', 'https://evil.test/a.png', 'file:///etc/passwd',
        '//evil.test/a.png', '/api/media/pic/../secret.png', '/api/media/pic/%2e%2e%2fsecret.png',
        '/api/media/pic/photo.png?url=http://evil.test', 'data:image/svg+xml,<svg/>',
        '/api/media/pic/a.svg', '/api/media/pic/a.png onerror=alert(1)']) {
        assert.equal(await read(media), '', media);
    }
    await fs.writeFile(path.join(dir, 'fake.png'), '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');
    assert.equal(await read('/api/media/pic/fake.png'), '');
    await fs.symlink(path.join(dir, 'photo.png'), path.join(dir, 'link.png'));
    assert.equal(await read('/api/media/pic/link.png'), '');
    assert.equal(await localImage('/api/media/pic/photo.png', dir, { remaining: 1 }), '');
});

test('payload is copied to scalar-only known fields with bounded rows and text', async t => {
    const dir = await temporary(t);
    const input = { head: ['Company'], numberValue: '../../outside', title: '<script>alert(1)</script>',
        tableList: [{ name: 'Product', count: 2, media: 'http://169.254.169.254/latest/meta-data/' }],
        filename: '/etc/passwd', escape: false };
    const data = await prepareData(input, dir);
    assert.equal(data.numberValue, '../../outside'); // Display only; never an output path.
    assert.equal(data.title, input.title);
    assert.equal(data.tableList[0].media, '');
    assert.equal(data.tableList[0].count, '2');
    assert.equal(data.productPrice, ''); // Delivery notes omit price fields.
    assert.equal(data.escape, undefined);
    assert.equal(input.tableList[0].media, 'http://169.254.169.254/latest/meta-data/');
    for (const bad of [null, {}, { head: [], tableList: Array(101).fill({}) },
        { head: [], tableList: [null] }, { head: [], tableList: [], title: {} },
        { head: [], tableList: [], title: 'a'.repeat(4097) }]) {
        await assert.rejects(prepareData(bad, dir), { status: 400 });
    }
});

test('Chromium disables scripts and blocks all network and local file requests', async () => {
    const calls = [];
    let intercept;
    const page = {
        setJavaScriptEnabled: async enabled => calls.push(['js', enabled]),
        setRequestInterception: async enabled => calls.push(['intercept', enabled]),
        on: (event, fn) => { assert.equal(event, 'request'); intercept = fn; },
        setContent: async html => calls.push(['html', html]),
        pdf: async () => Buffer.from('%PDF-test')
    };
    const browser = { newPage: async () => page, close: async () => calls.push(['close']) };
    const puppeteer = { launch: async options => { assert.equal(options.args, undefined); return browser; } };
    assert.equal((await renderPdf('<html/>', puppeteer)).toString(), '%PDF-test');
    assert.deepEqual(calls[0], ['js', false]);
    assert.deepEqual(calls[1], ['intercept', true]);
    for (const url of ['http://localhost/', 'https://evil.test/', 'file:///etc/passwd', 'data:text/html,evil']) {
        let aborted = false;
        intercept({ url: () => url, abort: async () => { aborted = true; }, continue: async () => assert.fail(url) });
        assert.equal(aborted, true);
    }
    let continued = false;
    intercept({ url: () => 'data:image/png;base64,YQ==', continue: async () => { continued = true; }, abort: async () => assert.fail() });
    assert.equal(continued, true);
    assert.deepEqual(calls.at(-1), ['close']);
    page.pdf = async () => { throw new Error('render failure'); };
    await assert.rejects(renderPdf('<html/>', puppeteer), /render failure/);
    assert.deepEqual(calls.at(-1), ['close']);
});

test('publishes complete PDF under unique names, without temporary files or overwrites', async t => {
    const dir = await temporary(t);
    const bytes = Buffer.from('%PDF-' + 'x'.repeat(1024 * 1024));
    const names = await Promise.all([writePdf(bytes, dir), writePdf(bytes, dir)]);
    assert.notEqual(names[0], names[1]);
    for (const name of names) {
        assert.match(name, /^[a-f0-9]{48}\.pdf$/);
        assert.deepEqual(await fs.readFile(path.join(dir, name)), bytes);
    }
    assert.deepEqual((await fs.readdir(dir)).sort(), names.sort());
});

test('invoice template escapes text and uses a quoted image attribute', async t => {
    const template = require('art-template');
    const dir = await temporary(t);
    const data = await prepareData({ head: ['<img src=x onerror=alert(1)>'],
        title: '<script>alert(1)</script>', tableList: [{ name: '<iframe src="file:///etc/passwd">',
            media: '/api/media/pic/x.png onerror=alert(1)' }] }, dir);
    const html = template(path.join(__dirname, '../views/orderPageTemplate'), data);
    assert.ok(!html.includes('<script>'));
    assert.ok(!html.includes('<iframe'));
    assert.ok(html.includes('&#60;script&#62;') || html.includes('&lt;script&gt;'));
    assert.ok(html.includes('default-src'));
    assert.ok(!html.includes('<img src=x'));
});
