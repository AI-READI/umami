/* eslint-disable no-console */
require('dotenv').config();
const fse = require('fs-extra');
const path = require('path');
const del = require('del');

function getDatabaseType(url = process.env.DATABASE_URL) {
  const type = process.env.DATABASE_TYPE || (url && url.split(':')[0]);

  if (type === 'postgres') {
    return 'postgresql';
  }

  return type;
}

const databaseType = getDatabaseType();

if (!databaseType || !['mysql', 'postgresql'].includes(databaseType)) {
  throw new Error('Missing or invalid database');
}

console.log(`Database type detected: ${databaseType}`);

const src = path.resolve(__dirname, `../db/${databaseType}`);
const dest = path.resolve(__dirname, '../prisma');

del.sync(dest);

fse.copySync(src, dest);

console.log(`Copied ${src} to ${dest}`);

const sslCertPath = path.join(__dirname, '..', 'assets', 'ssl', 'DigiCertGlobalRootCA.crt.pem');

const prismaCertPath = path.join(__dirname, '..', 'prisma', 'DigiCertGlobalRootCA.crt.pem');

fse.copySync(sslCertPath, prismaCertPath);

console.log(`Copied ${sslCertPath} to ${prismaCertPath}`);
