/**
 * Generic script loader for bookmarklets
 *
 * Usage:
 * javascript:(function(){var script=document.createElement('script');script.src='https://peterbenoit.com/script-loader.js?script=script-name';document.body.appendChild(script);})()
 *
 * Where script-name is one of: color-picker, image-info, etc.
 */

(function () {
	// Get the script parameter from the URL
	const urlParams = new URLSearchParams(document.currentScript.src.split('?')[1]);
	const scriptName = urlParams.get('script');

	// Basic security check - confirm this is loaded only from your domain
	const currentScriptDomain = new URL(document.currentScript.src).hostname;
	if (currentScriptDomain !== 'peterbenoit.com') {
		console.error('Security Error: Script loaded from unauthorized domain');
		return;
	}

	if (!scriptName) {
		console.error('No script specified');
		alert('Error: No script specified');
		return;
	}

	// Define available scripts with integrity hashes
	const availableScripts = {
		'color-picker': {
			path: 'color-picker.js',
			// Add integrity hash when you generate it for each script
			// integrity: 'sha384-HASH_VALUE_HERE'
		},
		'image-info': {
			path: 'image-info.js',
			// integrity: 'sha384-HASH_VALUE_HERE'
		},
		'osp': {
			path: 'OSP.js',
			integrity: 'sha384-/6qI96NmfnKNcz/h65lVTlp/V7Xd0AY9KJCmgBxCcbsh60JOQiTqyhwCd0na7LPS'
		}
	};

	// Check if the requested script exists
	if (!availableScripts[scriptName]) {
		console.error(`Script "${scriptName}" not found`);
		alert(`Error: Script "${scriptName}" not found`);
		return;
	}

	// Create and inject the requested script
	const script = document.createElement('script');
	script.src = `https://peterbenoit.com/bookmarklets/${availableScripts[scriptName].path}`;

	// Add integrity check if available
	if (availableScripts[scriptName].integrity) {
		script.integrity = availableScripts[scriptName].integrity;
		script.crossOrigin = 'anonymous';
	}

	// Add version parameter to prevent caching if needed
	// script.src += '?v=' + availableScripts[scriptName].version;

	// Remove the loader script once the requested script is loaded
	script.onload = function () {
		document.currentScript.remove();
	};

	script.onerror = function () {
		console.error(`Failed to load script: ${scriptName}`);
		alert(`Error: Failed to load script "${scriptName}"`);
	};

	document.body.appendChild(script);
})();
