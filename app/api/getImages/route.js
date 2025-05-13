import prisma from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const images = await prisma.imageInfo.findMany({
            orderBy: {
                upload_date: 'desc',
            },
        });

        // Group images by upload_date
        const groupedImages = images.reduce((acc, image) => {
            const date = image.upload_date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
            if (!acc[date]) {
                acc[date] = [];
            }

            // Parsing key_value_pairs to make it easier to work with in the frontend
            const parsedKeyValuePairs = image.key_value_pairs.map((pair) => ({
                key: pair.key,
                value: pair.value,
            }));

            acc[date].push({
                id: image.id,
                username: image.username,
                upload_date: image.upload_date,
                image_name: image.image_name,
                image_size: image.image_size,
                image_type: image.image_type,
                key_value_pairs: parsedKeyValuePairs,
                image_data: image.image_data,
            });

            return acc;
        }, {});

        console.log("Grouped Images with image_data and upload_date:", groupedImages);

        return NextResponse.json(groupedImages);
    } catch (error) {
        console.error('Error fetching images:', error);
        return NextResponse.json(
            { error: 'Error fetching images' },
            { status: 500 }
        );
    }
}
