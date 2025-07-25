import { NextResponse } from "next/server";

// Tesla Fleet API Configuration
const TESLA_AUTH_URL =
  "https://fleet-auth.prd.vn.cloud.tesla.com/oauth2/v3/token";
const TESLA_API_BASE = "https://fleet-api.prd.na.vn.cloud.tesla.com";
const AUDIENCE = "https://fleet-api.prd.na.vn.cloud.tesla.com";

// Environment variables
const TESLA_CLIENT_ID = process.env.TESLA_CLIENT_ID;
const TESLA_CLIENT_SECRET = process.env.TESLA_CLIENT_SECRET;

interface TeslaTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

// GET handler for Tesla partner registration
export async function GET() {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  try {
    // Validate environment variables
    if (!TESLA_CLIENT_ID || !TESLA_CLIENT_SECRET) {
      return NextResponse.json(
        {
          error: "Tesla credentials not configured",
          message:
            "TESLA_CLIENT_ID and TESLA_CLIENT_SECRET must be set in environment variables",
        },
        { status: 400, headers }
      );
    }

    console.log("Starting Tesla partner registration...");
    console.log(`Using Client ID: ${TESLA_CLIENT_ID}`);

    // Step 1: Get partner authentication token
    console.log("Getting partner token...");

    const tokenResponse = await fetch(TESLA_AUTH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "CertMyBattery/1.0",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: TESLA_CLIENT_ID,
        client_secret: TESLA_CLIENT_SECRET,
        scope: "openid vehicle_device_data",
        audience: AUDIENCE,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error(
        `Token request failed: ${tokenResponse.status} - ${errorText}`
      );

      return NextResponse.json(
        {
          error: "Failed to get Tesla partner token",
          status: tokenResponse.status,
          details: errorText,
        },
        { status: tokenResponse.status, headers }
      );
    }

    const tokenData: TeslaTokenResponse = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error("No access token in response:", tokenData);
      return NextResponse.json(
        {
          error: "No access token received",
          response: tokenData,
        },
        { status: 400, headers }
      );
    }

    console.log("Got token, registering partner account...");

    // Step 2: Register partner account
    const registerResponse = await fetch(
      `${TESLA_API_BASE}/api/1/partner_accounts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
          "User-Agent": "CertMyBattery/1.0",
        },
      }
    );

    const registerData = await registerResponse.json();

    if (!registerResponse.ok) {
      console.error(
        `Registration failed: ${registerResponse.status}`,
        registerData
      );

      // Check if already registered (409 Conflict is expected)
      if (registerResponse.status === 409) {
        return NextResponse.json(
          {
            success: true,
            message: "Partner account already registered",
            status: "already_registered",
            client_id: TESLA_CLIENT_ID,
            registration_response: registerData,
          },
          { headers }
        );
      }

      return NextResponse.json(
        {
          error: "Failed to register partner account",
          status: registerResponse.status,
          details: registerData,
        },
        { status: registerResponse.status, headers }
      );
    }

    console.log("Partner registration successful!");

    return NextResponse.json(
      {
        success: true,
        message: "Tesla partner account registered successfully",
        status: "registered",
        client_id: TESLA_CLIENT_ID,
        registration_response: registerData,
        token_info: {
          expires_in: tokenData.expires_in,
          scope: tokenData.scope,
        },
      },
      { headers }
    );
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      {
        error: "Registration failed",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500, headers }
    );
  }
}

// OPTIONS handler for CORS
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
