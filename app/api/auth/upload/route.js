// app/api/auth/upload/route.js
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma'; // Adjust the path based on your project structure
export async function POST(req) {
  try {
    const { name, date, keyValuePairs, images } = await req.json();

    // Validate the incoming data
    if (!name || !date || !images || !Array.isArray(images)) {
      return NextResponse.json({ success: false, message: 'Invalid data format.' }, { status: 400 });
    }

    // Convert date string to a valid Date object
    const uploadDate = new Date(date);

    if (isNaN(uploadDate.getTime())) {
      return NextResponse.json({ success: false, message: 'Invalid date format.' }, { status: 400 });
    }

    // Prepare image records for insertion
    const imageRecords = await Promise.all(
        images.map((image) =>
            prisma.imageInfo.create({
              data: {
                username: name,
                upload_date: uploadDate, // Use the converted Date object
                image_name: image.image_name,
                image_size: image.image_size,
                image_type: image.image_type,
                key_value_pairs: keyValuePairs,
                image_data: image.image_data, // Store base64 data
              },
            })
        )
    );

    console.log('Inserted records:', imageRecords);

    return NextResponse.json({ success: true, message: 'Files uploaded successfully.', imageRecords }, { status: 200 });
  } catch (error) {
    console.error('Failed to save data:', error);
    return NextResponse.json({ success: false, message: 'Failed to save data', error: error.message }, { status: 500 });
  }
}
