export default {
	async fetch() {
		let status = false;
		console.log('Current status : ', status);
		return new Response(JSON.stringify({ isPublished: status }), {
			headers: { 'Content-Type': 'application/json' },
		});
	},
};