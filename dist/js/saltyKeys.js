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
        const CODEPEN_ID = /codepen\.io\/[^/]+\/(?:pen|debug|fullpage|fullembedgrid)\/([^?#]+)/;
        let id;

        if (CODEPEN_ID.test(window.location.href)) {
            id = CODEPEN_ID.exec(window.location.href)[1];
        } else {
            const metas = document.getElementsByTagName('link');
            for (let i = 0; i < metas.length; i++) {
                if (metas[i].getAttribute('rel') === 'canonical') {
                    const href = metas[i].getAttribute('href');
                    if (CODEPEN_ID.test(href)) {
                        id = CODEPEN_ID.exec(href)[1];
                    }
                }
            }
        }

        return id;
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
        const penId = this.getPenId();
        if (!penId) {
            console.warn('Unable to extract Pen ID.');
            return null;
        }

        const saltedKey = btoa(`${apiKey}:${penId}`);
        return saltedKey;
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
        const penId = this.getPenId();
        if (!penId) {
            console.warn('Unable to extract Pen ID.');
            return null;
        }

        const decodedKey = atob(saltedKey);
        const [apiKey, idFromKey] = decodedKey.split(':');

        if (idFromKey === penId) {
            return apiKey;
        } else {
            console.warn('Pen ID mismatch. Unable to retrieve the API key.');
            return null;
        }
    }
}
