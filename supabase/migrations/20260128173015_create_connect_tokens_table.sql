/*
  # Create Connect Tokens System for Loneliness Reach Out Feature

  1. New Tables
    - `connect_tokens`
      - `token` (text, primary key) - Unguessable secure token
      - `user_id` (uuid) - References auth.users, cascading delete
      - `created_at` (timestamp) - Token creation time
      - `expires_at` (timestamp) - Token expiration time (24h from creation)
      - `used_at` (timestamp, nullable) - First time token was accessed
      - `attachment_name` (text, nullable) - Context for the connect request
      - `share_user_phone` (boolean) - Whether to share user's phone
      - `share_user_email` (boolean) - Whether to share user's email

  2. Security
    - Enable RLS on `connect_tokens` table
    - No direct client access - all access via Edge Functions with service role
    - Indexes on user_id and expires_at for performance

  3. Purpose
    - Allows users feeling lonely to send secure, time-limited connect links
    - Recipients can use the link to reach the user via phone/email if shared
    - Tokens expire after 24 hours for security
*/

-- Create connect_tokens table
CREATE TABLE IF NOT EXISTS connect_tokens (
  token TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ NULL,
  attachment_name TEXT NULL,
  share_user_phone BOOLEAN NOT NULL DEFAULT false,
  share_user_email BOOLEAN NOT NULL DEFAULT false
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_connect_tokens_user_id ON connect_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_connect_tokens_expires_at ON connect_tokens(expires_at);

-- Enable RLS
ALTER TABLE connect_tokens ENABLE ROW LEVEL SECURITY;

-- No public policies - access only via Edge Functions with service role
-- This ensures tokens can only be created/read through controlled endpoints