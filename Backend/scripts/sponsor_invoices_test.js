/**
 * Automated Verification Script: Sponsor Invoices Endpoints
 */
const mongoose = require('mongoose');
const http = require('http');
const { app } = require('../server');
const UserModel = require('../models/UserModel');
const SponsorModel = require('../models/SponsorModel');
const InvoiceModel = require('../models/InvoiceModel');
const jwt = require('jsonwebtoken');

let server;
let baseUrl;

const request = async (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(url, { method, headers }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
};

const run = async () => {
  console.log('--- Testing Sponsor Invoices Endpoints ---');
  let passed = 0;
  let total = 0;

  const assert = (condition, desc) => {
    total++;
    if (condition) {
      console.log(`[PASS] ${desc}`);
      passed++;
    } else {
      console.error(`[FAIL] ${desc}`);
    }
  };

  try {
    const port = 5097;
    server = app.listen(port);
    baseUrl = `http://localhost:${port}`;

    const sponsorUser = await UserModel.findOne({ email: 'sponsor1@eventforge.io' });
    const token = jwt.sign({ id: sponsorUser._id, role: sponsorUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // 1. GET /api/sponsors/me/invoices
    const res1 = await request('GET', '/api/sponsors/me/invoices', null, token);
    assert(res1.status === 200, 'GET /api/sponsors/me/invoices returns 200 OK');
    assert(res1.body.success === true, 'Response has success: true');
    assert(Array.isArray(res1.body.data?.invoices), 'Response contains invoices array');
    assert(res1.body.data.invoices.length > 0, `Found ${res1.body.data.invoices.length} invoices for Google Cloud sponsor`);

    const inv = res1.body.data.invoices[0];
    assert(inv.invoiceNumber, `Invoice number present: ${inv.invoiceNumber}`);
    assert(inv.eventId?.title, `Populated event title: ${inv.eventId?.title}`);
    assert(inv.packageId?.name, `Populated package: ${inv.packageId?.name}`);
    assert(inv.total > 0, `Invoice total is > 0: ${inv.total}`);

    // 2. Summary stats
    assert(res1.body.data.summary?.totalBilled > 0, `Summary totalBilled: ${res1.body.data.summary?.totalBilled}`);

    // 3. Filter by status
    const resFilter = await request('GET', '/api/sponsors/me/invoices?status=paid', null, token);
    assert(resFilter.status === 200, 'GET /api/sponsors/me/invoices?status=paid returns 200 OK');
    assert(resFilter.body.data.invoices.every(i => i.status === 'paid'), 'Filtered results all have status: paid');

    // 4. Test Single Invoice GET
    const resSingle = await request('GET', `/api/sponsors/me/invoices/${inv._id}`, null, token);
    assert(resSingle.status === 200, `GET /api/sponsors/me/invoices/${inv._id} returns 200 OK`);

    console.log(`\nResults: ${passed} / ${total} Passed (${Math.round((passed / total) * 100)}%)`);
  } catch (e) {
    console.error('Error during test:', e);
  } finally {
    if (server) server.close();
    await mongoose.disconnect();
    process.exit(passed === total ? 0 : 1);
  }
};

run();
