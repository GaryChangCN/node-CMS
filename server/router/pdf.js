'use strict';

const artTemplate = require('art-template');
const path = require('node:path');
const puppeteer = require('puppeteer');
const { prepareData, renderPdf, writePdf } = require('../lib/pdf-export');
let rendering = false;

module.exports = function*(next) {
    if (this.method.toUpperCase() !== 'POST') {
        yield next;
        return;
    }
    if (rendering) {
        this.status = 503;
        this.body = { state: false, err: 'PDF export is busy; please retry' };
        return;
    }
    rendering = true;
    try {
        const data = yield prepareData(this.request.body, path.join(__dirname, '../public/pic'));
        const html = artTemplate(path.join(__dirname, '../views/orderPageTemplate'), data);
        const bytes = yield renderPdf(html, puppeteer);
        const name = yield writePdf(bytes, path.join(__dirname, '../public/pdf'));
        this.body = { state: true, err: false, name: name };
    } catch (error) {
        this.logger.error(error);
        this.status = error.status === 400 ? 400 : 500;
        this.body = { state: false, err: error.status === 400 ? 'Invalid PDF data' : 'PDF export failed' };
    } finally {
        rendering = false;
    }
};
