import { N2YOAPIResponse } from '@/types/satellite';

const apiKey = process.env.N2YO_API_KEY;
const baseURL = 'https://api.n2yo.com/rest/v1/satellite';

/**
 * Handles GET requests to fetch TLE (Two-Line Element) data for a specified satellite.
 *
 * @param request - The incoming request object.
 * @returns A JSON response containing the TLE data or an error message.
 *
 * @throws Will throw an error if the fetch request fails or if the TLE data is invalid.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const satelliteId = (await params).id;

  try {
    const url = `${baseURL}/tle/${satelliteId}&apiKey=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch TLE data');
    }

    const data: N2YOAPIResponse =
      (await response.json()) as N2YOAPIResponse;

    // Validate TLE data
    if (!data.info?.satid) {
      throw new Error('Invalid TLE data');
    }

    return Response.json(data); // Return TLE data
  } catch (error) {
    return Response.json(
      {
        error: `Failed to fetch TLE data: ${(error as Error).message}`,
      },
      { status: 500 },
    );
  }
}
