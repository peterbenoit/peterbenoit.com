(function() {
    const position = window.badgeConfig && window.badgeConfig.position === 'top' ? 'top' : 'bottom';
    const randomId = Math.random().toString(36).slice(2);
    const footer = document.createElement('div');
    footer.id = `footer-${randomId}`;
    footer.style.position = 'fixed';
    footer.style.right = '10px';
    footer.style.display = 'flex';
    footer.style.alignItems = 'center';
    footer.style.gap = '5px';
    footer.style.fontFamily = 'Comic Sans, sans-serif';
    footer.style.color = '#fff';
    footer.style.fontSize = '14px';
    footer.style.background = 'rgba(0, 0, 0, 0.5)';
    footer.style.padding = '10px';
    footer.style.opacity = '0';
    footer.style.transform = 'translateX(100px)';

    if (position === 'top') {
        footer.style.top = '10px';
    } else {
        footer.style.bottom = '10px';
    }

    const style = document.createElement('style');
    style.innerHTML = `
        #footer-${randomId} {
            animation: slideIn 4s ease-out forwards;
        }

        @keyframes slideIn {
            0% {
                opacity: 0;
                transform: translateX(100px); /* Slide in from right */
            }
            100% {
                opacity: 1;
                transform: translateX(0); /* Fully visible */
            }
        }

        #footer-${randomId} a {
            color: #fff;
            text-decoration: none;
            font-weight: bold;
            transition: filter .3s ease;
        }

        #footer-${randomId} a svg {
            transition: filter .3s ease;
            stroke: #fff;
        }

        #footer-${randomId} a:hover {
            color: #ff00ff;
        }

        #footer-${randomId} a:hover svg {
            stroke: #ff00ff;
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

    const text = document.createElement('span');
    text.innerText = 'Made by';
    footer.appendChild(text);

    const link = document.createElement('a');
    link.href = 'https://peterbenoit.com';
    link.innerText = 'Pete';
    footer.appendChild(link);

    const socialLinks = document.createElement('div');
    socialLinks.style.display = 'flex';
    socialLinks.style.gap = '10px';
    footer.appendChild(socialLinks);

    const icons = [
        { href: 'https://www.linkedin.com/in/peterbenoit', svg: `
            <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M7 17V13.5V10" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M11 17V13.75M11 10V13.75M11 13.75C11 10 17 10 17 13.75V17" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M7 7.01L7.01 6.99889" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>`
        },
        { href: 'https://github.com/peterbenoit', svg: `
            <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 22.0268V19.1568C16.0375 18.68 15.9731 18.2006 15.811 17.7506C15.6489 17.3006 15.3929 16.8902 15.06 16.5468C18.2 16.1968 21.5 15.0068 21.5 9.54679C21.4997 8.15062 20.9627 6.80799 20 5.79679C20.4558 4.5753 20.4236 3.22514 19.91 2.02679C19.91 2.02679 18.73 1.67679 16 3.50679C13.708 2.88561 11.292 2.88561 8.99999 3.50679C6.26999 1.67679 5.08999 2.02679 5.08999 2.02679C4.57636 3.22514 4.54413 4.5753 4.99999 5.79679C4.03011 6.81549 3.49251 8.17026 3.49999 9.57679C3.49999 14.9968 6.79998 16.1868 9.93998 16.5768C9.61098 16.9168 9.35725 17.3222 9.19529 17.7667C9.03334 18.2112 8.96679 18.6849 8.99999 19.1568V22.0268" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M9 20.0267C6 20.9999 3.5 20.0267 2 17.0267" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>`
        },
        { href: 'https://codepen.io/peterbenoit', svg: `
            <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 9V15" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M3 15V9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M12 21V15" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M12 3V9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M12 15L3 9L12 3L21 9L12 15Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M12 21L3 15L12 9L21 15L12 21Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>`
        },
    ];

    icons.forEach(({ href, svg }) => {
        const iconLink = document.createElement('a');
        iconLink.href = href;
        iconLink.target = '_blank';
        iconLink.innerHTML = svg;
        socialLinks.appendChild(iconLink);
    });

    document.body.appendChild(footer);

	const allowBypass = getQueryParam('allow') === 'true';
	const currentUrl = window.location.href;
	const pageTitle = document.title;
	const visitTime = new Date().toISOString();
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const viewportWidth = window.innerWidth;
	const viewportHeight = window.innerHeight;
	const platform = navigator.platform;
	const requestUrl = `https://vercel-email-sandy.vercel.app/api/track${allowBypass ? '?allow=true' : ''}`;

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
