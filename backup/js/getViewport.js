/**
 * GetViewport - A lightweight JavaScript utility for responsive breakpoint detection
 * @version 1.1.2
 * @author Pete Benoit
 * @license MIT
 */
class GetViewport {
	/**
	 * Creates an instance of the GetViewport utility
	 * @param {Object} [customBreakpoints] - Optional custom breakpoints object
	 */
	constructor(customBreakpoints) {
		// Default breakpoint definitions
		this.breakpoints = customBreakpoints || {
			xs: 0,
			sm: 576,
			md: 768,
			lg: 992,
			xl: 1200,
			xxl: 1400,
		};

		// Debounce delay for resize events (in ms)
		this.debounceDelay = 100;
		this.debounceTimeout = null;

		// For direct width-based breakpoint detection
		this.sortedBreakpoints = this.getSortedBreakpoints();

		// Inject CSS for breakpoints, using CSS to trigger MQ changes
		this.injectBreakpointStyles();

		// Listen to changes in viewport size with improved handling
		window.addEventListener("resize", () => this.handleResize());

		// Initial update
		this.updateViewportVariable();
	}

	/**
	 * Creates a sorted array of breakpoint entries for direct width comparison
	 * @returns {Array} Sorted array of [name, width, index] entries
	 */
	getSortedBreakpoints() {
		return Object.entries(this.breakpoints)
			.map(([key, value], index) => [key, value, index + 1])
			.sort((a, b) => b[1] - a[1]); // Sort from largest to smallest
	}

	/**
	 * Handles resize events with immediate update and debounced followup
	 */
	handleResize() {
		// Immediate update for responsive feel
		this.updateViewportVariable();

		// Debounced update for final state
		this.debounceResize();
	}

	/**
	 * Debounces the resize event handler to improve performance
	 */
	debounceResize() {
		clearTimeout(this.debounceTimeout);
		this.debounceTimeout = setTimeout(() => {
			this.updateViewportVariable();
		}, this.debounceDelay);
	}

	/**
	 * Injects CSS with media queries and a CSS variable to track the viewport
	 */
	injectBreakpointStyles() {
		try {
			const style = document.createElement("style");
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
				.join("");
			document.head.appendChild(style);
		} catch (error) {
			console.error("Failed to inject breakpoint styles:", error);
		}
	}

	/**
	 * Updates the viewport variable for the current breakpoint
	 */
	updateViewportVariable() {
		try {
			this.viewport = getComputedStyle(document.documentElement)
				.getPropertyValue("--viewport")
				.replace(/['"]/g, "")
				.trim();

			// Verify if viewport value matches actual width
			this.verifyBreakpoint();
		} catch (error) {
			console.error("Failed to update viewport variable:", error);
			// Fallback to direct width detection
			this.detectBreakpointFromWidth();
		}
	}

	/**
	 * Verifies if the current breakpoint matches the actual width
	 * If not, corrects it by direct width calculation
	 */
	verifyBreakpoint() {
		const calculatedBreakpoint = this.getBreakpointFromWidth(this.getWidth());
		const currentBreakpoint = this.getBreakpoint();

		if (calculatedBreakpoint !== currentBreakpoint) {
			// If there's a mismatch, use the width-based detection
			this.detectBreakpointFromWidth();
		}
	}

	/**
	 * Detects breakpoint directly from current window width
	 */
	detectBreakpointFromWidth() {
		const width = this.getWidth();
		const breakpoint = this.getBreakpointFromWidth(width);
		const index = this.getBreakpointIndex(breakpoint);
		this.viewport = `${breakpoint},${index}`;
	}

	/**
	 * Gets the appropriate breakpoint name for a given width
	 * @param {number} width - The viewport width to check
	 * @returns {string} Breakpoint name
	 */
	getBreakpointFromWidth(width) {
		// Find the first breakpoint where width is greater than or equal to min-width
		for (const [name, minWidth] of Object.entries(this.breakpoints)) {
			if (width >= minWidth) {
				// Find the largest matching breakpoint
				let largest = name;
				let largestWidth = minWidth;

				for (const [otherName, otherMinWidth] of Object.entries(this.breakpoints)) {
					if (width >= otherMinWidth && otherMinWidth > largestWidth) {
						largest = otherName;
						largestWidth = otherMinWidth;
					}
				}

				return largest;
			}
		}

		// Default to smallest breakpoint if none match
		return Object.keys(this.breakpoints)[0];
	}

	/**
	 * Gets the index of a breakpoint by name
	 * @param {string} name - Breakpoint name
	 * @returns {number} Index value (1-based)
	 */
	getBreakpointIndex(name) {
		const index = Object.keys(this.breakpoints).indexOf(name);
		return index >= 0 ? index + 1 : 1;
	}

	/**
	 * Gets the current viewport breakpoint name
	 * @returns {string} Current breakpoint name (e.g. 'sm', 'md')
	 */
	getBreakpoint() {
		return this.viewport.split(",")[0];
	}

	/**
	 * Gets the numeric value associated with the current breakpoint
	 * @returns {number} Numeric value for current breakpoint
	 */
	getBreakpointValue() {
		return parseInt(this.viewport.split(",")[1]);
	}

	/**
	 * Gets the current viewport width in pixels
	 * @returns {number} Viewport width
	 */
	getWidth() {
		return window.innerWidth;
	}

	/**
	 * Gets the current viewport height in pixels
	 * @returns {number} Viewport height
	 */
	getHeight() {
		return window.innerHeight;
	}

	/**
	 * Gets the viewport dimensions as an object
	 * @returns {Object} Object containing width and height
	 */
	getDimensions() {
		return {
			width: this.getWidth(),
			height: this.getHeight()
		};
	}

	/**
	 * Checks if the viewport is considered mobile (xs, sm)
	 * @returns {boolean} True if mobile viewport
	 */
	isMobile() {
		const value = this.getBreakpointValue();
		return value <= 2;
	}

	/**
	 * Checks if the viewport is considered tablet (md)
	 * @returns {boolean} True if tablet viewport
	 */
	isTablet() {
		return this.getBreakpointValue() === 3;
	}

	/**
	 * Checks if the viewport is considered desktop (lg, xl, xxl)
	 * @returns {boolean} True if desktop viewport
	 */
	isDesktop() {
		return this.getBreakpointValue() > 3;
	}

	/**
	 * Gets all defined breakpoints
	 * @returns {Object} Breakpoint definitions
	 */
	getBreakpoints() {
		return { ...this.breakpoints };
	}
}
