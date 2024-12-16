import { NextResponse } from 'next/server';

const baseURL = 'https://api.n2yo.com/rest/v1/satellite';

/**
 * Handles GET requests to fetch TLE (Two-Line Element) data for a specified satellite.
 *
 * @param req - The incoming request object.
 * @param params - An object containing route parameters.
 * @param params.id - The ID of the satellite to fetch TLE data for.
 * @returns A JSON response containing the TLE data or an error message.
 *
 * @throws Will throw an error if the fetch request fails or if the TLE data is invalid.
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const apiKey = process.env.N2YO_API_KEY;
  const satelliteId = params.id || '25544'; // Example satellite: ISS 25544

  try {
    const url = `${baseURL}/tle/${satelliteId}&apiKey=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch TLE data');
    }

    const data = await response.json();

    // Validate TLE data
    if (!data.info || !data.info.satid) {
      throw new Error('Invalid TLE data');
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch TLE data: ' + error },
      { status: 500 },
    );
  }
}
