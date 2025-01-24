const GEOCODING_API_KEY = process.env.NEXT_PUBLIC_GEOCODING_API_KEY;

export async function geocodeLocation(text: string): Promise<[number, number] | undefined> {
  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?` +
      `q=${encodeURIComponent(text)}` +
      `&key=${GEOCODING_API_KEY}` +
      `&limit=1`
    );
    const data = await response.json();
    
    if (data.results?.[0]?.geometry) {
      return [data.results[0].geometry.lat, data.results[0].geometry.lng];
    }
    return undefined;
  } catch (error) {
    console.error('Geocoding error:', error);
    return undefined;
  }
} 