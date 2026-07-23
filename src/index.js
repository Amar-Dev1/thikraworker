export default {
	async fetch() {
		// Set to true to trigger update redirect for old preview users
		let isPublished = false;

		if (!isPublished) return;

		return new Response(
			JSON.stringify({
				isPublished: isPublished,
				url: null ,// 'https://thikra.netlify.app/new-update',

				// New properties for the updated app check
				version: null, // '1.0.4'
				message: 'تحديث جديد متاح! يرجى التحديث للحصول على أحدث الميزات والتحسينات.',
			}),
			{
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
				},
			},
		);
	},
};
