// Netlify Serverless Function — Proxy para Google Places API (New)
// Mantém a API key segura no servidor, nunca exposta no frontend

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
  if (!GOOGLE_API_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'GOOGLE_PLACES_API_KEY not configured. Set it in Netlify dashboard.' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const { action, query, location, radius, placeId, fieldMask } = body;
  const PLACES_BASE = 'https://places.googleapis.com/v1';

  try {
    if (action === 'textSearch') {
      const requestBody = {
        textQuery: query,
        maxResultCount: 20,
        languageCode: 'pt-BR',
        regionCode: 'BR',
      };

      if (location && radius) {
        requestBody.locationBias = {
          circle: {
            center: { latitude: location.lat, longitude: location.lng },
            radius: (radius || 5) * 1000,
          },
        };
      }

      const res = await fetch(`${PLACES_BASE}/places:searchText`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_API_KEY,
          'X-Goog-FieldMask': fieldMask || 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.websiteUri,places.nationalPhoneNumber,places.photos,places.currentOpeningHours,places.primaryType,places.googleMapsUri',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      return { statusCode: res.status, headers, body: JSON.stringify(data) };
    }

    if (action === 'placeDetails') {
      if (!placeId) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'placeId is required' }) };
      }

      const res = await fetch(`${PLACES_BASE}/places/${placeId}`, {
        headers: {
          'X-Goog-Api-Key': GOOGLE_API_KEY,
          'X-Goog-FieldMask': fieldMask || 'id,displayName,formattedAddress,nationalPhoneNumber,websiteUri,googleMapsUri,businessStatus,rating,userRatingCount,currentOpeningHours,regularOpeningHours,photos,reviews,types,primaryType,editorialSummary,priceLevel,accessibilityOptions,paymentOptions,delivery,dineIn,takeout',
        },
      });

      const data = await res.json();
      return { statusCode: res.status, headers, body: JSON.stringify(data) };
    }

    if (action === 'autocomplete') {
      const res = await fetch(`${PLACES_BASE}/places:autocomplete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_API_KEY,
        },
        body: JSON.stringify({
          input: query,
          languageCode: 'pt-BR',
          regionCode: 'BR',
          includedRegionCodes: ['BR'],
        }),
      });

      const data = await res.json();
      return { statusCode: res.status, headers, body: JSON.stringify(data) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: `Unknown action: ${action}` }) };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || 'Internal server error' }),
    };
  }
};
