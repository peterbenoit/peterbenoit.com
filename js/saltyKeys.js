/**
 * SaltyKeys - A JavaScript library for obfuscating and verifying API keys on CodePen.
 *
 * DISCLAIMER:
 * This library is intended for educational purposes only and is not secure for
 * use in a production environment. The methods provided here rely on client-side
 * obfuscation techniques, which are inherently insecure and can be easily reversed
 * by unskilled attackers. Sensitive information, such as API keys, should always
 * be stored and managed on the server side, never exposed to client-side scripts.
 *
 * USE AT YOUR OWN RISK. The authors assume no responsibility or liability for any
 * use of this library in a production environment or for any consequences that
 * arise from its use.
 */
class SaltyKeys {
	static config = {
		urlPattern: /codepen\.io\/[^/]+\/(?:pen|debug|fullpage|fullembedgrid)\/([^?#]+)/,
		cacheEnabled: true,
		environment: 'codepen'
	};

	static configure(options = {}) {
		this.config = { ...this.config, ...options };
	}

	static #cachedPenId = null;

	/**
	 * Extracts the CodePen Pen ID from the current URL or canonical link.
	 *
	 * The method first attempts to get the Pen ID directly from the URL. If it fails
	 * (e.g., when the Pen is embedded in an iframe), it falls back to searching for
	 * the canonical link tag in the HTML.
	 *
	 * @returns {string|null} The Pen ID if found, otherwise null.
	 */
	static getPenId() {
		if (this.config.cacheEnabled && this.#cachedPenId) {
			return this.#cachedPenId;
		}

		const CODEPEN_ID = this.config.urlPattern;
		let id;

		if (CODEPEN_ID.test(window.location.href)) {
			id = CODEPEN_ID.exec(window.location.href)[1];
		} else {
			const canonicalLink = document.querySelector('link[rel="canonical"]');
			if (canonicalLink) {
				const href = canonicalLink.getAttribute('href');
				if (CODEPEN_ID.test(href)) {
					id = CODEPEN_ID.exec(href)[1];
				}
			}
		}

		this.#cachedPenId = id;
		return id;
	}

	// Polyfill for btoa/atob with Unicode support
	static _safeEncode(str) {
		try {
			return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
				(match, p1) => String.fromCharCode('0x' + p1)));
		} catch (e) {
			console.warn('Encoding failed:', e);
			return null;
		}
	}

	static _safeDecode(str) {
		try {
			return decodeURIComponent(Array.prototype.map.call(atob(str),
				c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
		} catch (e) {
			console.warn('Decoding failed:', e);
			return null;
		}
	}

	/**
	 * Generates a salted API key using the original API key and the Pen ID.
	 *
	 * The method uses the Pen ID as salt to obfuscate the original API key.
	 * It combines the API key and Pen ID, encodes them in base64, and returns
	 * the result.
	 *
	 * @param {string} apiKey - The original API key.
	 * @returns {string|null} The salted API key if successful, otherwise null.
	 */
	static generateSaltedKey(apiKey) {
		if (!apiKey || typeof apiKey !== 'string') {
			console.warn('API key must be a non-empty string.');
			return null;
		}

		const penId = this.getPenId();
		if (!penId) {
			console.warn('Unable to extract Pen ID.');
			return null;
		}

		try {
			// Add obfuscation beyond simple base64
			const timestamp = Date.now().toString();
			const nonce = Math.random().toString(36).substring(2, 10);
			const complexKey = `${apiKey}:${penId}:${timestamp}:${nonce}`;

			// Multiple rounds of encoding with different techniques
			let obfuscatedKey = this._safeEncode(complexKey);
			obfuscatedKey = obfuscatedKey.split('').reverse().join('');

			return obfuscatedKey;
		} catch (error) {
			console.warn('Failed to generate salted key:', error);
			return null;
		}
	}

	/**
	 * Retrieves the original API key from the salted key.
	 *
	 * The method decodes the salted key and checks if the Pen ID from the salted key
	 * matches the current Pen ID. If they match, it returns the original API key;
	 * otherwise, it returns null.
	 *
	 * @param {string} saltedKey - The salted API key to decode.
	 * @returns {string|null} The original API key if the Pen ID matches, otherwise null.
	 */
	static getApiKey(saltedKey) {
		if (!saltedKey || typeof saltedKey !== 'string') {
			console.warn('Invalid salted key format.');
			return null;
		}

		try {
			const penId = this.getPenId();
			if (!penId) {
				console.warn('Unable to extract Pen ID.');
				return null;
			}

			// Reverse the obfuscated key first
			const reversedKey = saltedKey.split('').reverse().join('');

			// Use safe decode
			let decodedKey = this._safeDecode(reversedKey);
			if (!decodedKey) {
				console.warn('Failed to decode the salted key.');
				return null;
			}

			const keyParts = decodedKey.split(':');
			if (keyParts.length < 4) { // Now we have apiKey:penId:timestamp:nonce
				console.warn('Invalid key format: missing components.');
				return null;
			}

			const [apiKey, idFromKey] = keyParts;

			if (idFromKey === penId) {
				return apiKey;
			} else {
				console.warn('Pen ID mismatch. Unable to retrieve the API key.');
				return null;
			}
		} catch (error) {
			console.warn('Error retrieving API key:', error);
			return null;
		}
	}
}
