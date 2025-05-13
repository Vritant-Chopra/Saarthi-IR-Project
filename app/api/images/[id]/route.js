import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request, { params }) {
    const { id } = params;

    try {
        const image = await prisma.imageInfo.findUnique({
            where: { id: parseInt(id) },
        });

        if (!image || !image.image_data) {
            return NextResponse.json({ error: 'Image not found' }, { status: 404 });
        }

        return new NextResponse(image.image_data, {
            status: 200,
            headers: {
                'Content-Type': image.image_type,
                'Content-Length': image.image_size,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('Error fetching image:', error);
        return NextResponse.json(
            { error: 'Error fetching image' },
            { status: 500 }
        );
    }
}
