/**
 * Enhanced UI Badge and Analytics
 *
 * Configuration options:
 * - data-position="top" | "bottom" | "top-left" | "bottom-left" - Badge position (default: "bottom")
 * - data-visible="true" | "false" - Show/hide badge (default: "true")
 * - data-mode="full" | "tracker" - Full badge or tracker-only (default: "full")
 * - data-delay="500" - Milliseconds to delay tracking (default: "1000")
 * - Query params:
 *   - visible=false - Hide badge but still track
 *   - allow=true - Pass allow parameter to tracking API
 *   - mode=tracker - Tracking only mode
 */
(function () {
	// Configuration
	const scriptTag = document.currentScript;
	const urlParams = new URLSearchParams(window.location.search);
	const config = {
		mode: (scriptTag.dataset.mode === 'tracker') || (urlParams.get('mode') === 'tracker') ? 'tracker' : 'full',
		position: ['top', 'bottom', 'top-left', 'bottom-left'].includes(scriptTag.dataset.position) ? scriptTag.dataset.position : 'bottom',
		visible: scriptTag.dataset.visible !== 'false' && urlParams.get('visible') !== 'false',
		allowBypass: urlParams.get('allow') === 'true',
		delay: parseInt(scriptTag.dataset.delay || '1000', 10)
	};

	// Inject global author‑link and badge styles only once
	if (!document.getElementById('ui-badge-global-style')) {
		const globalStyle = document.createElement('style');
		globalStyle.id = 'ui-badge-global-style';
		globalStyle.textContent = `
			.seo-author-link{position:absolute;left:-9999px;}
			.ui-badge{
				position:fixed;
				display:flex;
				align-items:center;
				gap:2px;
				font-family:Comic Sans, sans-serif;
				background:#ffffff;
				border:1px solid #f5f5f5;
				border-radius:20px;
				box-shadow:0 2px 4px rgba(0,0,0,.1);
				font-size:.6rem;
				color:#333;
				padding:.325rem .625rem;
				text-decoration:none;
				z-index:9999;
			}
			.ui-badge.top, .ui-badge.top-left{top:10px;}
			.ui-badge.bottom, .ui-badge.bottom-left{bottom:10px;}
			.ui-badge.top, .ui-badge.bottom{right:10px;}
			.ui-badge.top-left, .ui-badge.bottom-left{left:10px;}
			.ui-badge:hover{
				color:#ff00ff;
				animation:rainbow 1.5s linear infinite;
			}
			@keyframes rainbow{
				0%{filter:hue-rotate(300deg) saturate(3) brightness(1.2);}
				100%{filter:hue-rotate(-60deg) saturate(3) brightness(1.2);}
			}
		`;
		document.head.appendChild(globalStyle);
	}

	const HEART_SVG = '<?xml version="1.0" encoding="UTF-8"?><svg width="12px" height="12px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#ff0000" stroke-width="1.5"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.9999 3.94228C13.1757 2.85872 14.7069 2.25 16.3053 2.25C18.0313 2.25 19.679 2.95977 20.8854 4.21074C22.0832 5.45181 22.75 7.1248 22.75 8.86222C22.75 10.5997 22.0831 12.2728 20.8854 13.5137C20.089 14.3393 19.2938 15.1836 18.4945 16.0323C16.871 17.7562 15.2301 19.4985 13.5256 21.14L13.5216 21.1438C12.6426 21.9779 11.2505 21.9476 10.409 21.0754L3.11399 13.5136C0.62867 10.9374 0.62867 6.78707 3.11399 4.21085C5.54605 1.68984 9.46239 1.60032 11.9999 3.94228Z" fill="#ff0000"></path></svg>';
	const BADGE_HTML = `Made with ${HEART_SVG} by uiGuy`;

	function createBadge(position) {
		const badge = document.createElement('a');
		badge.className = `ui-badge ${position}`;
		badge.href = 'https://uiguy.dev';
		badge.target = '_blank';
		badge.setAttribute('role', 'button');
		badge.setAttribute('aria-label', 'Visit uiguy.dev');
		badge.innerHTML = BADGE_HTML;

		document.body.appendChild(badge);
	}

	/**
	 * Get a more reliable referrer source
	 */
	function getReferrerInfo() {
		// Try different referrer sources in order of reliability
		return document.referrer ||
			sessionStorage.getItem('_previous_page') ||
			null;
	}

	/**
	 * Store current URL for future referrer tracking
	 */
	function storeCurrentPageAsReferrer() {
		try {
			sessionStorage.setItem('_previous_page', window.location.href);
		} catch (e) {
			// Handle private browsing mode errors silently
		}
	}

	/**
	 * Tracks the current page visit
	 */
	async function trackVisit(allowBypass) {
		// Store referrer info for next page view before sending the current data
		const referrerInfo = getReferrerInfo();
		storeCurrentPageAsReferrer();

		const visitData = {
			currentUrl: window.location.href,
			pageTitle: document.title || window.location.pathname,
			referrer: referrerInfo,
			visitTime: new Date().toISOString(),
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			viewportWidth: window.innerWidth,
			viewportHeight: window.innerHeight,
			platform: navigator.userAgentData?.platform || navigator.platform
		};

		const requestUrl = `https://vercel-email-sandy.vercel.app/api/track${allowBypass ? '?allow=true' : ''}`;

		try {
			const response = await fetch(requestUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(visitData)
			});
			if (!response.ok) {
				// Silently ignore non-OK HTTP statuses (429, 500, etc.)
			}
		} catch (e) {
			// Silently ignore network errors
		}
	}

	function init() {
		if (config.mode === 'full' && config.visible) {
			createBadge(config.position);
		}
		setTimeout(() => {
			trackVisit(config.allowBypass);
		}, config.delay);
	}

	if (document.readyState === 'loading') {
		window.addEventListener('DOMContentLoaded', init, { once: true });
	} else {
		init();
	}

})();
