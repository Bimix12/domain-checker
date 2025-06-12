export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { domains } = req.body;

  if (!domains || !Array.isArray(domains)) {
    return res.status(400).json({ error: 'Invalid input. Expected an array of domains.' });
  }

  const apiKey = process.env.GODADDY_API_KEY;
  const apiSecret = process.env.GODADDY_API_SECRET;

  const results = [];

  for (const domain of domains) {
    try {
      const response = await fetch(
        `https://api.godaddy.com/v1/domains/available?domain=${encodeURIComponent(domain)}`,
        {
          headers: {
            Authorization: `sso-key ${apiKey}:${apiSecret}`,
            Accept: 'application/json',
          },
        }
      );

      const data = await response.json();
      results.push({ domain, available: data.available });
    } catch (error) {
      results.push({ domain, error: 'Error checking domain' });
    }
  }

  res.status(200).json({ results });
}
