import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const body = await req.json();
        let { filenames } = body;

        if (!filenames || !Array.isArray(filenames)) {
            return NextResponse.json({ status: 'error', message: 'filenames must be an array' }, { status: 400 });
        }

        const cleanedFilenames = filenames.map(f => f.trim());
        console.log("Searching for titles:", cleanedFilenames);

        const rawResult = await prisma.$queryRawUnsafe(`
          SELECT * FROM "docInfo" WHERE title = ANY($1)
        `, filenames);

        console.log("Raw SQL query results:", rawResult);

        const results = await prisma.docInfo.findMany({
            where: {
              title: {
                in: filenames,  // Use full filenames as received
                mode: 'insensitive',
              },
            },
          });

        console.log("Prisma query results:", results);

        return NextResponse.json({ status: 'success', results });
    } catch (error) {
        console.error('Error in /api/getDocs:', error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
