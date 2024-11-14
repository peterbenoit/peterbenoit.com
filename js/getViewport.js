/**
 * GetViewport Library v1.0.0
 * https://github.dev/peterbenoit/GetViewport
 *
 * A lightweight JavaScript utility for responsive breakpoint detection.
 * Injects CSS for breakpoints, allowing JavaScript access to viewport state
 * for dynamic handling of mobile and desktop layouts.
 *
 * Released under the MIT License.
 *
 * Copyright (c) 2024 Peter Benoit
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * @author Peter Benoit
 * @version 1.0.0
 * @license MIT
 */
class GetViewport {
	constructor() {
		this.breakpoints = {
			xs: 0,
			sm: 576,
			md: 768,
			lg: 992,
			xl: 1200,
			xxl: 1400
		};

		// Inject CSS for breakpoints
		this.injectBreakpointStyles();

		// Listen to changes in viewport size
		window.addEventListener('resize', () => this.updateViewportVariable());
		this.updateViewportVariable();
	}

	// Injects CSS with media queries and a CSS variable to track the viewport
	injectBreakpointStyles() {
		const style = document.createElement('style');
		style.innerHTML = Object.entries(this.breakpoints)
			.map(
				([key, minWidth], index) => `
				@media (min-width: ${minWidth}px) {
					:root {
						--viewport: '${key},${index + 1}';
					}
				}
			`
			)
			.join('');
		document.head.appendChild(style);
	}

	// Updates the viewport variable for the current breakpoint
	updateViewportVariable() {
		this.viewport = getComputedStyle(document.documentElement)
			.getPropertyValue('--viewport')
			.replace(/['"]/g, '')
			.trim();
	}

	// Gets the current viewport breakpoint name and index
	getBreakpoint() {
		return this.viewport.split(',')[0];
	}

	// Gets the numeric value associated with the current breakpoint
	getBreakpointValue() {
		return parseInt(this.viewport.split(',')[1]);
	}

	// Checks if the viewport is considered mobile (xs, sm)
	isMobile() {
		return this.getBreakpointValue() < 2;
	}

	// Checks if the viewport is considered desktop (lg, xl, xxl)
	isDesktop() {
		return this.getBreakpointValue() > 2;
	}
}
