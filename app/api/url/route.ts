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
    let urlToScan = '';

    try {
      const body = await request.json();
      urlToScan = body?.url;
    } catch {
      try {
        const formData = await request.formData();
        urlToScan = String(formData.get('url'));
      } catch {
        return NextResponse.json({ error: 'Invalid request data format' }, { status: 400 });
      }
    }

    if (!urlToScan || typeof urlToScan !== 'string') {
      return NextResponse.json<IErrorResponse>(
        { error: 'URL is not provided or has an incorrect format.' },
        { status: 400 }
      );
    }

    try {
      new URL(`http://${urlToScan}`);
    } catch {
      return NextResponse.json<IErrorResponse>({ error: 'Invalid URL' }, { status: 400 });
    }

    const vtResponse = await fetch('https://www.virustotal.com/api/v3/urls', {
      method: 'POST',
      headers: {
        'x-apikey': process.env.VIRUSTOTAL_API_KEY!,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `url=${encodeURIComponent(urlToScan)}`,
    });

    if (!vtResponse.ok) {
      const errorText = await vtResponse.text();
      let errorMessage = 'Ошибка со стороны VirusTotal';

      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    const data = (await vtResponse.json()) as IFetchAnalysisResponse;
    return NextResponse.json<IScanSuccessResponse>({ analysisId: data.data.id });
  } catch (error: any) {
    console.error('Ошибка проверки URL в VT:', error);
    return NextResponse.json<IErrorResponse>(
      { error: error.message || 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
