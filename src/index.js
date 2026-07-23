export default {
	async fetch() {
		// Set to true to trigger update redirect for old preview users
		let isPublished = false;
		
		return new Response(JSON.stringify({ 
			isPublished: isPublished, 
			url: 'https://thikra.netlify.app/new-update',
			
			// New properties for the updated app check
			version: '1.0.4',
			message: 'تحديث جديد متاح! يرجى التحديث للحصول على أحدث الميزات والتحسينات.'
		}), {
			headers: { 
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			},
		});
	},
};