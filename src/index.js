export default {
	async fetch() {
		let status = false;
		console.log('Current status : ', status);
		return new Response(JSON.stringify({ isPublished: status, url: status ? 'https://thikra.netlify.app' : null }), {
			headers: { 'Content-Type': 'application/json' },
		});
	},
};