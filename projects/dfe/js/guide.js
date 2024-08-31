window.addEventListener( 'DOMContentLoaded', event => {
	// NOTE: this WAS used to include files via JS.
	const includeFiles = document.querySelectorAll( '[data-include]' );
	let x = 0;
	if( includeFiles.length ) {
		Array.prototype.forEach.call( includeFiles, function( file ) {
			const filePath = file.getAttribute( 'data-include' );
			const xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if ( xhr.readyState === 4 && xhr.status === 200 ) {
					file.innerHTML = xhr.responseText;
					x++;
					if ( x === includeFiles.length ) {
						init();
					}
				}
			};
			xhr.open( 'GET', filePath, true );
			xhr.send();
		} );
	} else {
		init();
	}
} );

window.addEventListener( 'scroll', event => {
	setScrollPosition();
} );


function init() {
	setScrollPosition();
	matchAnchor();
	highlightCode();
	highlightAnchors();
}

const setScrollPosition = () => {
	const winScroll = document.body.scrollTop || document.documentElement.scrollTop,
		height = document.documentElement.scrollHeight - document.documentElement.clientHeight,
		scrolled = (winScroll / height) * 100,
		container = document.getElementsByClassName( 'progress-container' )[0],
		element = document.getElementById("myBar");

		if ( 5 < scrolled ) {
			container.classList.remove("d-none");
		} else {
			container.classList.add("d-none");
		}
		element.style.width = scrolled + "%";
};

const matchAnchor = () => {
	const currentPage = window.location.pathname.split( '/' ).pop();
	const matchingAnchor = document.querySelector( `#sidebar-wrapper a[href='${currentPage}']` );
	if ( matchingAnchor ) {
		matchingAnchor.classList.add( 'active' );
		if ( matchingAnchor.closest( '.collapse' ) ) {
			matchingAnchor.closest( '.collapse' ).previousElementSibling.classList.add( 'active' );
			matchingAnchor.closest( '.collapse' ).classList.add( 'show' );
		}
	}

	// don't toggle the back to top link
	$( '.list-group-item:not(:last)' ).on( 'click', function() {
		$( '.fa-solid', this ).toggleClass( 'fa-chevron-right fa-chevron-down' );
	} );
};

const highlightCode = () => {
	// hljs.debugMode();
	hljs.addPlugin(
	  new CopyButtonPlugin({
		hook: (text, el) => {
		  return text;
		},
		callback: (text, el) => {
			// console.log(text, el);
		},
	  })
	);
	hljs.highlightAll();
	hljs.initLineNumbersOnLoad();
};

// TODO: clicking on the anchor link should activate the hash, not the heading
const highlightAnchors = () => {
	$( ":header" ).each(function() {
		const t = $(this),
			id = t.text().replace(/[^\w\s]/gi, '').replaceAll(' ', '_');

		t.addClass('position-relative');
		t.on( 'mouseenter mouseleave', function() {
			t.find('.headinganchor').toggleClass('d-none d-block');
		} ).on( 'click', function() {
			history.pushState(null,null,t.find('.headinganchor')[0].hash);
		} );
		t.attr( 'id', id );
		t.prepend('<a href="#'+id+'" class="headinganchor d-none" style="color: #e0e0e0"><i class="fa-solid fa-link"></i></a>');
	} );

	// if the page loaded with a hash, attempt to scroll to it.
 	if( location.hash.length && $(location.hash).length ) {
		$(location.hash)[0].scrollIntoView();
	}
};

/*!
 * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2023 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 */

// (() => {
// 	'use strict'
  
// 	const storedTheme = localStorage.getItem('theme')
  
// 	const getPreferredTheme = () => {
// 	  if (storedTheme) {
// 		return storedTheme
// 	  }
  
// 	  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
// 	}
  
// 	const setTheme = function (theme) {
// 	  if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
// 		document.documentElement.setAttribute('data-bs-theme', 'dark')
// 	  } else {
// 		document.documentElement.setAttribute('data-bs-theme', theme)
// 	  }
// 	}
  
// 	setTheme(getPreferredTheme())
  
// 	const showActiveTheme = (theme, focus = false) => {
// 	  const themeSwitcher = document.querySelector('#bd-theme')
  
// 	  if (!themeSwitcher) {
// 		return
// 	  }
  
// 	  const themeSwitcherText = document.querySelector('#bd-theme-text')
// 	  const activeThemeIcon = document.querySelector('.theme-icon-active use')
// 	  const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`)
// 	  const svgOfActiveBtn = btnToActive.querySelector('svg use').getAttribute('href')
  
// 	  document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
// 		element.classList.remove('active')
// 		element.setAttribute('aria-pressed', 'false')
// 	  })
  
// 	  btnToActive.classList.add('active')
// 	  btnToActive.setAttribute('aria-pressed', 'true')
// 	  activeThemeIcon.setAttribute('href', svgOfActiveBtn)
// 	  const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`
// 	  themeSwitcher.setAttribute('aria-label', themeSwitcherLabel)
  
// 	  if (focus) {
// 		themeSwitcher.focus()
// 	  }
// 	}
  
// 	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
// 	  if (storedTheme !== 'light' || storedTheme !== 'dark') {
// 		setTheme(getPreferredTheme())
// 	  }
// 	})
  
// 	window.addEventListener('DOMContentLoaded', () => {
// 	  showActiveTheme(getPreferredTheme())
  
// 	  document.querySelectorAll('[data-bs-theme-value]')
// 		.forEach(toggle => {
// 		  toggle.addEventListener('click', () => {
// 			const theme = toggle.getAttribute('data-bs-theme-value')
// 			localStorage.setItem('theme', theme)
// 			setTheme(theme)
// 			showActiveTheme(theme, true)
// 		  })
// 		})
// 	})
//   })()