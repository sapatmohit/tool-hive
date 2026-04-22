import { NextResponse } from "next/server";

/**
 * Mock image upload API.
 * In a real app, you'd integrate Cloudinary, S3, or similar.
 */
export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Mocking upload delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // In a real implementation:
        // const result = await cloudinary.uploader.upload(file.path);
        // return NextResponse.json({ url: result.secure_url });

        // Mock response: Just return a placeholder image URL based on the file name or a random one
        const mockUrl = `https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=1000&auto=format&fit=crop`;

        return NextResponse.json({ 
            url: mockUrl,
            message: "Upload successful (mocked)" 
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
