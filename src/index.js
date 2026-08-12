export default {
	async fetch(request, env) {
		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization',
			'Content-Type': 'application/json',
		};

		// Handle preflight OPTIONS request
		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}

		const url = new URL(request.url);

		// GET / health check endpoint
		if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/health')) {
			return new Response(
				JSON.stringify({
					status: 'ok',
					service: 'Thikra OTA Update Worker',
					latestVersion: env.LATEST_VERSION || '2.1.0',
				}),
				{ headers: corsHeaders },
			);
		}

		// POST /update - Capgo Capacitor Updater self-hosted endpoint
		if (request.method === 'POST' || url.pathname === '/update') {
			try {
				let body = {};
				try {
					body = await request.json();
				} catch (e) {
					// Body may be empty on simple pings
				}

				const clientVersion = body.version_name || body.version || '0.0.0';
				const latestVersion = env.LATEST_VERSION || '2.1.3';
				const bundleUrl = env.BUNDLE_URL || 'https://thikraworker.thikraworker1.workers.dev/bundle-ota.zip';
				const checksum = env.CHECKSUM || '';

				// Compare version string
				if (latestVersion && bundleUrl && isNewerVersion(latestVersion, clientVersion)) {
					return new Response(
						JSON.stringify({
							version: latestVersion,
							url: bundleUrl,
							checksum: checksum,
						}),
						{ headers: corsHeaders },
					);
				}

				// No update available
				return new Response(JSON.stringify({}), { headers: corsHeaders });
			} catch (err) {
				return new Response(JSON.stringify({ error: 'Internal Worker Error', details: err.message }), {
					status: 500,
					headers: corsHeaders,
				});
			}
		}

		return new Response(JSON.stringify({ error: 'Not Found' }), {
			status: 404,
			headers: corsHeaders,
		});
	},
};

/**
 * Semver comparison helper (returns true if versionA > versionB)
 */
function isNewerVersion(versionA, versionB) {
	if (!versionA || !versionB) return false;
	if (versionB === 'builtin') return true;

	const partsA = versionA.replace(/^v/, '').split('.').map(Number);
	const partsB = versionB.replace(/^v/, '').split('.').map(Number);

	for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
		const numA = partsA[i] || 0;
		const numB = partsB[i] || 0;
		if (numA > numB) return true;
		if (numA < numB) return false;
	}
	return false;
}
