// tslint:disable:no-unused-expression

import { expect, request, use } from 'chai';
import chaiHttp = require('chai-http');
import 'mocha';
import * as sinon from 'sinon';
import Config from '../../src/core/config';
import Server from '../../src/core/server';

before(() => {
  use(chaiHttp);
});

describe('InfoRouter', () => {
  let sandbox: sinon.SinonSandbox;
  let server: Server;
  let testConfig: any;

  beforeEach(async () => {
    testConfig = Config.get(true);
    testConfig.log.file.enabled = false;
    testConfig.log.stdout.enabled = false;
    testConfig.db.name = testConfig.tests.db;
    testConfig.server.port = testConfig.tests.port;
    sandbox = sinon.createSandbox();

    server = new Server();
    await server.init();
    await server.start();
  });

  afterEach(async () => {
    await server.stop();
    sandbox.restore();
  });

  it('GET info: should return api status info', async () => {
    sandbox.stub(Config, 'get').returns(testConfig);

    await new Promise((resolve) => {
      request(server.Application)
        .get(`${Config.get().server.relativePath}info`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          resolve();
        });
    });
  });
});