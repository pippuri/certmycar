
#!/bin/bash

TESLA_CLIENT_ID=6b4c9222-731a-4e4b-9da0-fb4441532772
CLIENT_ID=$TESLA_CLIENT_ID
CLIENT_SECRET=$TESLA_CLIENT_SECRET

AUDIENCE="https://fleet-api.prd.na.vn.cloud.tesla.com"

# Step 1: Get partner authentication token
echo "Getting partner token..."
TOKEN_RESPONSE=$(curl --silent --request POST \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'grant_type=client_credentials' \
  --data-urlencode "client_id=$CLIENT_ID" \
  --data-urlencode "client_secret=$CLIENT_SECRET" \
  --data-urlencode 'scope=openid vehicle_device_data' \
  --data-urlencode "audience=$AUDIENCE" \
  'https://fleet-auth.prd.vn.cloud.tesla.com/oauth2/v3/token')

ACCESS_TOKEN=$(echo "$TOKEN_RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$ACCESS_TOKEN" ]; then
  echo "Failed to get access token"
  echo "$TOKEN_RESPONSE"
  exit 1
fi

echo "Got token, registering partner account..."

# Step 2: Register partner account
curl --request POST \
  --header "Authorization: Bearer $ACCESS_TOKEN" \
  --header "Content-Type: application/json" \
  -d '{"domain": "batterycert.com"}' \
  "https://fleet-api.prd.na.vn.cloud.tesla.com/api/1/partner_accounts"