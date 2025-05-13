import prisma from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const dataArray = await request.json();
        console.log('Data received for saving:', dataArray);

        const formattedDataArray = dataArray.map((data, index) => {
            if (!data.upload_date) {
                console.error(`Missing upload_date for item at index ${index}:`, data);
                throw new Error(`Missing or invalid upload_date for item at index ${index}`);
            }

            const uploadDate = new Date(data.upload_date);
            if (isNaN(uploadDate.getTime())) {
                console.error(`Invalid upload_date format for item at index ${index}:`, data.upload_date);
                throw new Error(`Invalid date format for upload_date at index ${index}`);
            }

            return {
                imageInfoId: data.imageInfoId, // Foreign key linking to imageInfo table
                username: data.username,
                upload_date: uploadDate,
                image_name: data.image_name,
                image_size: data.image_size,
                image_type: data.image_type,
                key_value_pairs: data.key_value_pairs,
                image_data: data.image_data,
            };
        });

        // Save data to FinalData table using a transaction
        const savedData = await prisma.$transaction(
            formattedDataArray.map((data) =>
                prisma.finalData.create({
                    data,
                })
            )
        );

        console.log('Data successfully saved to FinalData table:', savedData);
        return NextResponse.json(savedData);
    } catch (error) {
        console.error('Error saving data:', error.message);
        return NextResponse.json({ error: 'Error saving data', details: error.message }, { status: 500 });
    }
}
