#!/bin/bash

# Fetch data.json
response=$(curl -s /data.json)

# Extract id, secret, and code using jq
id=$(echo "$response" | jq -r '.spotify.id')
secret=$(echo "$response" | jq -r '.spotify.secret')
code=$(echo "$response" | jq -r '.spotify.code')

# Encode id and secret in base64
auth=$(echo -n "$id:$secret" | base64)

# Make POST request to Spotify API
tokenResponse=$(curl -s -X POST 'https://accounts.spotify.com/api/token' \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Authorization: Basic $auth" \
  -d "grant_type=authorization_code&code=$code&redirect_uri=http://localhost:8080/callback")

# Parse token response
tokenData=$(echo "$tokenResponse" | jq '.')

echo "$tokenData"