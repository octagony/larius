import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'File is not provided' }, { status: 400 });
    }

    if (file.size > 32 * 1024 * 1024) {
      return NextResponse.json({ error: 'File exceeds the 32 MB limit' }, { status: 400 });
    }

    const vtFormData = new FormData();
    vtFormData.append('file', file, file.name);

    const vtResponse = await fetch('https://www.virustotal.com/api/v3/files', {
      method: 'POST',
      headers: {
        'x-apikey': process.env.VIRUSTOTAL_API_KEY!,
      },
      body: vtFormData,
    });

    if (!vtResponse.ok) {
      const errorData = await vtResponse.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Error uploading to VirusTotal');
    }

    const data = await vtResponse.json();

    return NextResponse.json({ analysisId: data.data.id });
  } catch (error: any) {
    console.error('Error uploading to VirusTotal:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
