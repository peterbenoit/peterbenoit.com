(function () {
	const scriptTag = document.currentScript;
	const position = scriptTag.getAttribute('data-position') === 'top' ? 'top' : 'bottom';
	const randomId = Math.random().toString(36).slice(2);
	const badge = document.createElement('a');
	badge.id = `badge-${randomId}`;
	badge.href = 'https://uiguy.dev';
	badge.target = '_blank';
	badge.style.position = 'fixed';
	badge.style.right = '10px';
	badge.style.display = 'flex';
	badge.style.alignItems = 'center';
	badge.style.gap = '2px';
	badge.style.fontFamily = 'Comic Sans, sans-serif';
	badge.style.opacity = '1';
	badge.style.transform = 'none';
	badge.style.background = '#ffffff';
	badge.style.border = '1px solid #cccccc';
	badge.style.borderRadius = '20px';
	badge.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
	badge.style.fontSize = '.6rem';
	badge.style.color = '#333333';
	badge.style.paddingLeft = '.625rem';
	badge.style.paddingRight = '.625rem';
	badge.style.paddingTop = '.325rem';
	badge.style.paddingBottom = '.325rem';
	badge.style.textDecoration = 'none';

	if (position === 'top') {
		badge.style.top = '10px';
	} else {
		badge.style.bottom = '10px';
	}

	const style = document.createElement('style');
	style.innerHTML = `
        #badge-${randomId}:hover {
            color: #ff00ff;
            animation: rainbow 1.5s linear infinite;
        }

        @keyframes rainbow {
            0% { filter: hue-rotate(300deg) saturate(3) brightness(1.2); }
            10% { filter: hue-rotate(290deg) saturate(3) brightness(1.2); }
            20% { filter: hue-rotate(280deg) saturate(3) brightness(1.2); }
            30% { filter: hue-rotate(270deg) saturate(3) brightness(1.2); }
            40% { filter: hue-rotate(260deg) saturate(3) brightness(1.2); }
            50% { filter: hue-rotate(250deg) saturate(3) brightness(1.2); }
            60% { filter: hue-rotate(260deg) saturate(3) brightness(1.2); }
            70% { filter: hue-rotate(270deg) saturate(3) brightness(1.2); }
            80% { filter: hue-rotate(280deg) saturate(3) brightness(1.2); }
            90% { filter: hue-rotate(290deg) saturate(3) brightness(1.2); }
            100% { filter: hue-rotate(300deg) saturate(3) brightness(1.2); }
        }
    `;
	document.head.appendChild(style);

	const heart =
		'<?xml version="1.0" encoding="UTF-8"?><svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#ff0000" stroke-width="1.5"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.9999 3.94228C13.1757 2.85872 14.7069 2.25 16.3053 2.25C18.0313 2.25 19.679 2.95977 20.8854 4.21074C22.0832 5.45181 22.75 7.1248 22.75 8.86222C22.75 10.5997 22.0831 12.2728 20.8854 13.5137C20.089 14.3393 19.2938 15.1836 18.4945 16.0323C16.871 17.7562 15.2301 19.4985 13.5256 21.14L13.5216 21.1438C12.6426 21.9779 11.2505 21.9476 10.409 21.0754L3.11399 13.5136C0.62867 10.9374 0.62867 6.78707 3.11399 4.21085C5.54605 1.68984 9.46239 1.60032 11.9999 3.94228Z" fill="#ff0000"></path></svg>';
	badge.innerHTML = `Made with ${heart} by uiGuy`;

	document.body.appendChild(badge);

	const allowBypass = getQueryParam('allow') === 'true';
	const currentUrl = window.location.href;
	const pageTitle = document.title;
	const visitTime = new Date().toISOString();
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const viewportWidth = window.innerWidth;
	const viewportHeight = window.innerHeight;
	const platform = navigator.platform;
	const requestUrl = `https://vercel-email-sandy.vercel.app/api/track${
		allowBypass ? '?allow=true' : ''
	}`;

	fetch(requestUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			currentUrl,
			pageTitle,
			visitTime,
			timezone,
			viewportWidth,
			viewportHeight,
			platform
		})
	});
})();

function getQueryParam(name) {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(name);
}
