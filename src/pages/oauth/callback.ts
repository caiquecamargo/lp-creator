import type { APIRoute } from 'astro';
import { clientId, clientSecret, tokenUrl } from './config';

export const prerender = false;

export const GET: APIRoute = async ({ url, redirect }) => {
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('<html><body><h1>Error</h1><p>No code provided</p></body></html>', {
      status: 400,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  const data = {
    code,
    client_id: clientId,
    client_secret: clientSecret,
  };

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const body = await response.json();

    const content = {
      token: body.access_token,
      provider: 'github',
    };

    // Return HTML with postMessage script to communicate with CMS
    const script = `
      <script>
        const receiveMessage = (message) => {
          window.opener.postMessage(
            'authorization:${content.provider}:success:${JSON.stringify(content)}',
            message.origin
          );

          window.removeEventListener("message", receiveMessage, false);
        }

        window.addEventListener("message", receiveMessage, false);

        window.opener.postMessage("authorizing:${content.provider}", "*");
      </script>
    `;

    return new Response(script, {
      headers: { 'Content-Type': 'text/html' },
    });
  }
  catch (err) {
    console.error('OAuth callback error:', err);
    return redirect('/?error=oauth_failed');
  }
};
