'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');
const http = require('node:http');
const crypto = require('node:crypto');
const Koa = require('koa');
const Router = require('koa-router');
const formidable = require('koa-formidable');

// Exercise the Koa 1 generator middleware contract on the patched Koa 2 runtime.
function request(app, options, body) {
    return new Promise((resolve, reject) => {
        const server = app.listen(0, '127.0.0.1', () => {
            const req = http.request({ host: '127.0.0.1', port: server.address().port, ...options }, res => {
                let result = '';
                res.on('data', chunk => { result += chunk; });
                res.on('end', () => server.close(() => resolve({ status: res.statusCode, body: result })));
            });
            req.on('error', error => server.close(() => reject(error)));
            req.end(body);
        });
        server.on('error', reject);
    });
}

test('Koa 2 preserves generator routing, params, JSON bodies and next', async () => {
    const app = new Koa();
    app.use(formidable({ maxFieldsSize: 3145728 }));
    const router = new Router();
    router.prefix('/api');
    router.post('/item/:id', function*(next) {
        this.state.value = this.request.body.name;
        yield next;
    }, function*() { this.body = { id: this.params.id, name: this.state.value }; });
    app.use(router.routes());
    app.use(router.allowedMethods());
    const result = await request(app, {
        method: 'POST', path: '/api/item/42', headers: { 'content-type': 'application/json' }
    }, JSON.stringify({ name: 'example' }));
    assert.equal(result.status, 200);
    assert.deepEqual(JSON.parse(result.body), { id: '42', name: 'example' });
    assert.equal((await request(app, { method: 'GET', path: '/api/item/42' })).status, 405);
});

test('cookie example uses authenticated encryption and rejects tampering', () => {
    const oldKey = process.env.CMS_COOKIE_KEY;
    process.env.CMS_COOKIE_KEY = crypto.randomBytes(32).toString('base64');
    try {
        const cry = require('../lib/cry.demo');
        const token = cry.en('session-value');
        assert.equal(cry.de(token), 'session-value');
        assert.notEqual(cry.en('session-value'), token);
        const bytes = Buffer.from(token, 'base64url');
        bytes[15] ^= 1;
        assert.equal(cry.de(bytes.toString('base64url')), '');
        assert.equal(cry.de(undefined), '');
        assert.equal(cry.de('bad-cookie'), '');
    } finally {
        if (oldKey === undefined) delete process.env.CMS_COOKIE_KEY;
        else process.env.CMS_COOKIE_KEY = oldKey;
    }
});

test('login rejects an absent or invalid CAPTCHA before querying credentials', async (t) => {
    const Module = require('node:module');
    const load = Module._load;
    let queries = 0;
    const hook = t.mock.method(Module, '_load', function(name, parent, isMain) {
        if (parent && parent.filename.endsWith('/router/login.js')) {
            if (name === '../lib/cry') return { de: () => '', en: value => value };
            if (name === '../lib/db') return { Admin: { valida: () => { queries++; } } };
        }
        return load.call(this, name, parent, isMain);
    });
    const login = require('../router/login');
    hook.mock.restore();
    for (const verify of ['', 0, undefined]) {
        const ctx = { cookies: { get: () => undefined }, request: { body: { verify } } };
        await require('co').call(ctx, login);
        assert.deepEqual(ctx.body, { err: 'verify' });
    }
    assert.equal(queries, 0);
});
