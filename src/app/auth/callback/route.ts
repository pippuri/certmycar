import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  let next = searchParams.get("next") ?? "/en-US/check";
  
  // Extract locale from state if available
  if (state) {
    try {
      const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
      if (stateData.locale) {
        next = `/${stateData.locale}/check`;
      }
    } catch (e) {
      console.warn('Failed to parse state for locale:', e);
    }
  }

  console.log("Tesla OAuth callback received:", { code: !!code, state, error });

  // Handle OAuth errors from Tesla
  if (error) {
    console.error("Tesla OAuth error:", error);
    const errorMsg = encodeURIComponent(
      `Tesla authentication failed: ${error}`
    );
    return NextResponse.redirect(`${origin}${next}?error=${errorMsg}`);
  }

  if (!code) {
    console.error("No authorization code received from Tesla");
    return NextResponse.redirect(`${origin}${next}?error=no_authorization_code`);
  }

  try {
    // Exchange authorization code for access token
    console.log("Exchanging Tesla authorization code for tokens...");

    const tokenResponse = await fetch(
      "https://auth.tesla.com/oauth2/v3/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: process.env.TESLA_CLIENT_ID!,
          client_secret: process.env.TESLA_CLIENT_SECRET!,
          code,
          redirect_uri: `${request.headers.get('x-forwarded-proto') || 'https'}://${request.headers.get('host')}/auth/callback`,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error(
        `Tesla token exchange failed: ${tokenResponse.status} - ${errorText}`
      );
      throw new Error(`Token exchange failed: ${tokenResponse.status}`);
    }

    const tokens = await tokenResponse.json();
    console.log("Tesla tokens received successfully");

    // Store access token in session or pass it securely to the frontend
    // For now, we'll pass it via URL parameter (in production, use secure session storage)
    const accessToken = tokens.access_token;

    // Determine the correct API region
    let apiRegion = 'na';
    let locale = 'en-US';
    
    if (state) {
      try {
        const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
        locale = stateData.locale || 'en-US';
        
        // Import region detection
        const { localeToRegion } = await import('@/lib/tesla-regions');
        apiRegion = localeToRegion(locale);
      } catch (e) {
        console.warn('Failed to parse state for API region:', e);
      }
    }

    console.log(`Using Tesla API for region: ${apiRegion}, locale: ${locale}`);

    // Fetch vehicles first to redirect to vehicle selection
    const vehiclesResponse = await fetch(`${origin}/api/tesla-auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "get_vehicles",
        access_token: accessToken,
        region: apiRegion,
        locale: locale,
      }),
    });

    if (!vehiclesResponse.ok) {
      const errorData = await vehiclesResponse.json();
      throw new Error(errorData.error || "Failed to fetch vehicles");
    }

    const vehiclesData = await vehiclesResponse.json();

    // Encode the vehicles data and access token for vehicle selection
    const sessionData = {
      vehicles: vehiclesData.vehicles,
      access_token: accessToken,
      region: apiRegion,
      locale: locale,
    };
    const dataParam = encodeURIComponent(JSON.stringify(sessionData));
    const vehiclesUrl = `${origin}${next.replace('/check', '/vehicles')}?data=${dataParam}`;

    console.log(
      "Tesla OAuth flow completed successfully, redirecting to vehicle selection"
    );
    return NextResponse.redirect(vehiclesUrl);
  } catch (error) {
    console.error("Tesla OAuth callback processing error:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error during Tesla authentication";

    const encodedError = encodeURIComponent(errorMessage);
    return NextResponse.redirect(`${origin}${next}?error=${encodedError}`);
  }
}

// Handle CORS preflight for the callback
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
