import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  const { email, senderName, message } = await req.json();
  const apiKey = Deno.env.get("RESEND_API_KEY");
  console.log("Received request", { email, senderName, message });
console.log("Using API key", apiKey?.slice(0, 6)); // avoid printing full key


  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "whisprrteam@resend.dev",
      to: email,
      subject: `New message from ${senderName}`,
      html: `<strong>${senderName}</strong> sent you: <blockquote>${message}</blockquote>`,
    }),
  });

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "https://whisprr-chatapp.netlify.app",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
});
