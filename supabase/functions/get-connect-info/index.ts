import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface GetConnectInfoRequest {
  token: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const body: GetConnectInfoRequest = await req.json();

    if (!body.token) {
      return new Response(
        JSON.stringify({ valid: false }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: tokenData, error: tokenError } = await supabase
      .from("connect_tokens")
      .select("*")
      .eq("token", body.token)
      .single();

    if (tokenError || !tokenData) {
      return new Response(
        JSON.stringify({ valid: false }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const now = new Date();
    const expiresAt = new Date(tokenData.expires_at);

    if (expiresAt < now) {
      return new Response(
        JSON.stringify({ valid: false }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!tokenData.used_at) {
      await supabase
        .from("connect_tokens")
        .update({ used_at: now.toISOString() })
        .eq("token", body.token);
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("display_name, phone, email")
      .eq("user_id", tokenData.user_id)
      .maybeSingle();

    const displayName = profile?.display_name || "A LifeZinc user";

    const response: any = {
      valid: true,
      displayName,
      shareUserPhone: tokenData.share_user_phone,
      shareUserEmail: tokenData.share_user_email,
    };

    if (tokenData.share_user_phone && profile?.phone) {
      response.userPhone = profile.phone;
    }

    if (tokenData.share_user_email && profile?.email) {
      response.userEmail = profile.email;
    }

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ valid: false }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
