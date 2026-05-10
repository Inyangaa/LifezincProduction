#!/bin/bash

# Test email sending via Supabase edge function
# Replace YOUR_EMAIL with your actual email address

SUPABASE_URL="https://zelbbjeuaalevquxsajs.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplbGJiamV1YWFsZXZxdXhzYWpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0ODM2NjcsImV4cCI6MjA3OTA1OTY2N30.DXIzUcaF6XgP2DkVD0X3678ASZNSrmTr8O4vMoWIaaY"

echo "🧪 Testing email send function..."
echo ""

curl -X POST "${SUPABASE_URL}/functions/v1/send-email" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "YOUR_EMAIL_HERE@example.com",
    "subject": "LifeZinc Test Email",
    "html": "<h1>Test Email</h1><p>If you receive this, email sending is working!</p>",
    "text": "Test Email - If you receive this, email sending is working!"
  }'

echo ""
echo ""
echo "✅ Check your inbox (and spam folder) for the test email!"
