require('dotenv').config();
const { defineConfig } = require('@prisma/config');

console.log('DEBUG: DB_URL in JS config:', process.env.DATABASE_URL ? 'PRESENT' : 'MISSING');

module.exports = defineConfig({
    migrations: {
        seed: 'npx ts-node prisma/seed.ts',
    },
    datasource: {
        url: process.env.DATABASE_URL || 'postgres://postgres:password@postgres:5432/copexia',
    },
});
