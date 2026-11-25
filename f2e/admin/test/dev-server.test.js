'use strict';

const assert = require('node:assert/strict');
const { once } = require('node:events');
const { createServer, get } = require('node:http');
const test = require('node:test');

test('legacy development server serves compiled files, local proxy, and hot-reload stream', { timeout: 60_000 }, async t => {
    const upstream = createServer((req, res) => res.end('upstream ' + req.url));
    t.after(() => upstream.close());
    upstream.listen(0, '127.0.0.1');
    await once(upstream, 'listening');
    require('../config').dev.proxyTable = { '/api-smoke': 'http://127.0.0.1:' + upstream.address().port };
    process.env.BROWSER = 'none';
    process.env.PORT = '0';
    const app = require('../build/dev-server');
    t.after(() => app.close());
    await once(app, 'listening');
    assert.equal(app.address().address, '127.0.0.1');
    const origin = 'http://127.0.0.1:' + app.address().port;

    const home = await fetch(origin + '/');
    assert.equal(home.status, 200);
    assert.match(await home.text(), /src=("|')?\/app\.js/);
    const script = await fetch(origin + '/app.js');
    assert.equal(script.status, 200);
    assert.match(script.headers.get('content-type'), /javascript/);
    assert.ok((await script.arrayBuffer()).byteLength > 1000);
    const proxy = await fetch(origin + '/api-smoke/status');
    assert.equal(proxy.status, 200);
    assert.equal(await proxy.text(), 'upstream /api-smoke/status');

    await new Promise((resolve, reject) => {
        const req = get(origin + '/__webpack_hmr', res => {
            try {
                assert.equal(res.statusCode, 200);
                assert.match(res.headers['content-type'], /text\/event-stream/);
                res.once('data', () => { req.destroy(); resolve(); });
                res.once('error', reject);
            } catch (error) {
                req.destroy();
                reject(error);
            }
        });
        req.on('error', reject);
        req.setTimeout(5000, () => req.destroy(new Error('HMR stream timed out')));
    });
});
