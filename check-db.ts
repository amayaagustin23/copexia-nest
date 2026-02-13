
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function check() {
    const user = await prisma.user.findUnique({
        where: { email: 'amayaagustin.2395@gmail.com' }
    });
    console.log('--- USER CHECK ---');
    if (!user) {
        console.log('User not found!');
    } else {
        console.log('User found:', user.email);
        const match = await bcrypt.compare('Pass1234', user.password);
        console.log('Password match:', match);
    }
}

check().finally(() => prisma.$disconnect());
