'use strict';

const common = require('../common');
const http = require('http');
const assert = require('assert');

const server = http.Server(common.mustCall((req, res) => {
  res.end();
  let closed = false;
  res.on('finish', common.mustCall(() => {
    assert.ok(!closed);
  }));
  res.on('close', common.mustCall(() => {
    closed = true;
  }));
  req.on('close', common.mustCall());
  res.socket.on('close', () => server.close());
}));

server.listen(0, common.mustCall(() => {
  http.get({ port: server.address().port }, common.mustCall());
}));
