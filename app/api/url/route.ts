import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    let urlToScan = '';

    try {
      const body = await request.json();
      urlToScan = body?.url;
    } catch {
      try {
        const formData = await request.formData();
        urlToScan = formData.get('url') as string;
      } catch {
        return NextResponse.json({ error: 'Неверный формат данных запроса' }, { status: 400 });
      }
    }

    if (!urlToScan || typeof urlToScan !== 'string') {
      return NextResponse.json(
        { error: 'URL не предоставлен или имеет неверный формат' },
        { status: 400 }
      );
    }

    try {
      new URL(`http://${urlToScan}`);
    } catch {
      return NextResponse.json({ error: 'Некорректный URL' }, { status: 400 });
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

    const data = await vtResponse.json();
    return NextResponse.json({ analysisId: data.data.id });
  } catch (error: any) {
    console.error('Ошибка проверки URL в VT:', error);
    return NextResponse.json(
      { error: error.message || 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
