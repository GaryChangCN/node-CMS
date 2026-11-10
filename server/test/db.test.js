'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test, mock } = require('node:test');
const mongoose = require('mongoose');

// Load the real schemas without opening a network connection. Collection stubs
// below replace only the MongoDB transport, keeping Mongoose casting and hooks.
const connect = mock.method(mongoose, 'connect', async () => mongoose);
const db = require('../lib/db');
connect.mock.restore();

async function runRoute(route, context) {
    const iterator = route.call(context, Promise.resolve());
    let step = iterator.next();
    while (!step.done) {
        try { step = iterator.next(await step.value); }
        catch (error) { step = iterator.throw(error); }
    }
}

function context(method, body) {
    return { method, request: { body }, logger: { error(error) { throw error; } } };
}

test('all schemas validate and retain legacy defaults', async () => {
    assert.match(mongoose.version, /^8\./);
    for (const Model of Object.values(db)) await new Model().validate();
    assert.equal(new db.Group().type, 'group');
    assert.equal(new db.Product().type, 'product');
    assert.deepEqual(new db.Admin().limit.toObject(), []);
    assert.equal(new db.Order().where, 'unhandled');
});

test('save hooks populate order and article timestamps through promise APIs', async (t) => {
    for (const Model of [db.Order, db.Article]) {
        let inserted;
        t.mock.method(Model.collection, 'insertOne', async document => {
            inserted = document;
            return { acknowledged: true, insertedId: document._id };
        });
        const document = await new Model().save();
        assert.ok(inserted.time instanceof Date);
        assert.ok(document.time instanceof Date);
        if (Model === db.Order) {
            assert.equal(inserted.customerTime.getTime(), inserted.time.getTime());
            assert.equal(inserted.number, inserted.time.getTime());
        }
    }
});

test('login returns a promise and rejects operator-valued credentials', async (t) => {
    let filter;
    t.mock.method(db.Admin.collection, 'findOne', async query => {
        filter = query;
        return { username: 'admin', password: 'digest', limit: [1] };
    });
    const result = await db.Admin.valida({ username: 'admin', password: 'digest' });
    assert.equal(result.username, 'admin');
    assert.deepEqual(filter, { username: 'admin', password: 'digest' });
    await assert.rejects(db.Admin.valida({ username: { $ne: null }, password: 'digest' }), TypeError);
    await assert.rejects(db.Admin.valida({ username: 'admin', password: { $ne: null } }), TypeError);
});

test('sanitized filters reject injected operators without removing legacy search fields', async (t) => {
    let calls = 0;
    t.mock.method(db.Admin.collection, 'findOne', async () => { calls++; return null; });
    await assert.rejects(db.Admin.findOne({ username: { $ne: null } }).exec(), /Cast to string failed/);
    assert.equal(calls, 0);
    let filter;
    t.mock.method(db.Product.collection, 'find', query => {
        filter = query;
        return { toArray: async () => [] };
    });
    const expression = /bowling/i;
    await db.Product.find({ $or: [{ name: expression }, { brand: expression }] }).exec();
    assert.deepEqual(filter, { $or: [{ name: expression }, { brand: expression }] });
});

test('group membership queries retain scalar array-membership semantics', async (t) => {
    const id = new mongoose.Types.ObjectId().toString();
    let filter;
    t.mock.method(db.Group.collection, 'find', query => {
        filter = query;
        return { toArray: async () => [] };
    });
    const ctx = context('GET', {});
    ctx.params = { _id: id };
    await runRoute(require('../router/product/where'), ctx);
    assert.deepEqual(filter, { children: id });
});

test('product deletion removes one product and updates every referring group', async (t) => {
    const id = new mongoose.Types.ObjectId().toString();
    const calls = [];
    t.mock.method(db.Product.collection, 'deleteOne', async filter => {
        calls.push(['delete', filter]);
        return { acknowledged: true, deletedCount: 1 };
    });
    t.mock.method(db.Group.collection, 'updateMany', async (filter, update) => {
        calls.push(['update', filter, update]);
        return { acknowledged: true, matchedCount: 2, modifiedCount: 2 };
    });
    const ctx = context('DELETE', { _id: id });
    await runRoute(require('../router/product/delete'), ctx);
    assert.equal(calls[0][1]._id.toString(), id);
    assert.deepEqual(calls[1], ['update', {}, { $pull: { children: id } }]);
    assert.deepEqual(ctx.body, { err: false, state: true });
});

test('style upserts and filtered counts use supported Mongoose methods', async (t) => {
    let written;
    t.mock.method(db.Style.collection, 'updateOne', async (filter, update, options) => {
        written = { filter, update, options };
        return { acknowledged: true, upsertedCount: 1 };
    });
    const ctx = context('POST', { type: 'logo', array: JSON.stringify(['logo.png']) });
    await runRoute(require('../router/style/post'), ctx);
    assert.deepEqual(written.filter, { type: 'logo' });
    assert.deepEqual(written.update.$set.array, ['logo.png']);
    assert.equal(written.options.upsert, true);
    let counted;
    t.mock.method(db.Order.collection, 'countDocuments', async filter => { counted = filter; return 3; });
    assert.equal(await db.Order.countDocuments({ where: 'unhandled' }).exec(), 3);
    assert.deepEqual(counted, { where: 'unhandled' });
});

test('server routes contain no removed Mongoose model APIs', () => {
    for (const folder of ['router', 'render-router']) {
        const root = path.join(__dirname, '..', folder);
        for (const name of fs.readdirSync(root, { recursive: true })) {
            if (!name.endsWith('.js')) continue;
            const source = fs.readFileSync(path.join(root, name), 'utf8');
            assert.doesNotMatch(source, /db\.\w+\.(?:count|update|remove)\s*\(/, name);
        }
    }
});
