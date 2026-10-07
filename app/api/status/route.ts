import { IErrorResponse } from '@/lib/interfaces/api/IFetchResponse.interface';
import {
  IAnalysisResponse,
  IAnalysisSuccessResponse,
} from '@/lib/interfaces/api/IStatusResponse.interface';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest
): Promise<NextResponse<IAnalysisSuccessResponse | IErrorResponse>> {
  const { searchParams } = new URL(request.url);
  const analysisId = searchParams.get('analysisId');

  if (!analysisId) {
    return NextResponse.json<IErrorResponse>(
      { error: 'AnalysisId not specified' },
      { status: 400 }
    );
  }

  try {
    const vtResponse = await fetch(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
      headers: {
        'x-apikey': process.env.VIRUSTOTAL_API_KEY!,
      },
    });

    if (!vtResponse.ok) {
      throw new Error("Couldn't get the analysis status");
    }

    const data = (await vtResponse.json()) as IAnalysisResponse;

    return NextResponse.json<IAnalysisSuccessResponse>({
      status: data.data.attributes.status,
      stats: data.data.attributes.stats,
      results: data.data.attributes.results,
    });
  } catch (error: any) {
    console.error('Error checking status:', error);
    return NextResponse.json<IErrorResponse>({ error: error.message }, { status: 500 });
  }
}
