import { MAX_FILE_SIZE } from '@/lib/constants';
import { IScanSuccessResponse } from '@/lib/interfaces/api/IAnalysisResponse.interface';
import {
  IErrorResponse,
  IFetchAnalysisResponse,
} from '@/lib/interfaces/api/IFetchResponse.interface';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest
): Promise<NextResponse<IScanSuccessResponse | IErrorResponse>> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json<IErrorResponse>({ error: 'File is not provided' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json<IErrorResponse>(
        { error: 'File exceeds the 32 MB limit' },
        { status: 400 }
      );
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
      const errorData = await vtResponse.json().catch(() => {
        throw new Error('Error while catching JSON');
      });
      throw new Error(errorData.error?.message || 'Error uploading to VirusTotal');
    }

    const data = (await vtResponse.json()) as IFetchAnalysisResponse;
    return NextResponse.json<IScanSuccessResponse>({ analysisId: data.data.id });
  } catch (error: unknown) {
    console.error('Error uploading to VirusTotal:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    );
  }
}
