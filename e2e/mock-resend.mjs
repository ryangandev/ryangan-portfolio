import { createServer } from 'node:http';

/**
 * A stand-in for the Resend API, so the contact form can be submitted for
 * real without sending email. The server under test reaches it through
 * `RESEND_BASE_URL`, which the Resend SDK reads in place of its default.
 *
 * - `POST /emails` records the email and answers the way Resend does. A
 *   subject containing `resend-fail` gets Resend's error shape instead, so a
 *   test can pick the failure path without touching shared state.
 * - `GET /sent` lists what was recorded, for tests to assert on.
 *
 * Every send is delayed, so a test can see the form's pending state.
 */
const SEND_DELAY_MS = 500;

const sent = [];

const readJson = async (request) => {
  let body = '';

  for await (const chunk of request) body += chunk;

  return JSON.parse(body);
};

const reply = (response, status, body) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(body));
};

createServer(async (request, response) => {
  if (request.method === 'GET' && request.url === '/health') {
    return reply(response, 200, { ok: true });
  }

  if (request.method === 'GET' && request.url === '/sent') {
    return reply(response, 200, sent);
  }

  if (request.method === 'POST' && request.url === '/emails') {
    const email = await readJson(request);

    await new Promise((resolve) => setTimeout(resolve, SEND_DELAY_MS));

    if (email.subject?.includes('resend-fail')) {
      return reply(response, 422, {
        statusCode: 422,
        name: 'validation_error',
        message: 'Simulated failure',
      });
    }

    sent.push(email);

    return reply(response, 200, { id: `e2e-${sent.length}` });
  }

  reply(response, 404, { message: 'Not found' });
}).listen(Number(process.env.PORT), '127.0.0.1');
