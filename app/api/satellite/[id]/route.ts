import { NextResponse } from 'next/server';

// API handler function to fetch TLE data from N2YO API
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const apiKey = process.env.N2YO_API_KEY;
  const satelliteId = params.id || '25544'; // Example satellite: ISS 25544

  try {
    const url = `https://api.n2yo.com/rest/v1/satellite/tle/${satelliteId}&apiKey=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch TLE data');
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch TLE data: ' + error },
      { status: 500 },
    );
  }
}
