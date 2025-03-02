// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import PinataSDK from '@pinata/sdk';
import { Readable } from 'stream';

const pinata = new PinataSDK({
    pinataApiKey: process.env.PINATA_API_KEY,
    pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        if (!process.env.PINATA_API_KEY || !process.env.PINATA_SECRET_API_KEY) {
            return NextResponse.json(
                { error: 'Missing Pinata credentials' },
                { status: 500 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        // Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Create ReadableStream from Buffer
        const readableStream = new Readable({
            read() {
                this.push(buffer);
                this.push(null);
            },
        });

        // Upload ReadableStream to Pinata
        const result = await pinata.pinFileToIPFS(readableStream, {
            pinataMetadata: { name: file.name },
        });

        const ipfsHash = `ipfs://${result.IpfsHash}`;
        return NextResponse.json({ ipfsHash }, { status: 200 });
    } catch (error: unknown) {
        // Explicitly type as unknown
        console.error('Error uploading to Pinata:', error);
        // Safely extract error message
        const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: 'Upload failed: ' + errorMessage },
            { status: 500 }
        );
    }
}
