class GetViewport {
  constructor() {
    this.breakpoints = {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1400,
    };

    // Inject CSS for breakpoints
    this.injectBreakpointStyles();

    // Listen to changes in viewport size
    window.addEventListener("resize", () => this.updateViewportVariable());
    this.updateViewportVariable();
  }

  // Injects CSS with media queries and a CSS variable to track the viewport
  injectBreakpointStyles() {
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
  }

  // Updates the viewport variable for the current breakpoint
  updateViewportVariable() {
    this.viewport = getComputedStyle(document.documentElement)
      .getPropertyValue("--viewport")
      .replace(/['"]/g, "")
      .trim();
  }

  // Gets the current viewport breakpoint name and index
  getBreakpoint() {
    return this.viewport.split(",")[0];
  }

  // Gets the numeric value associated with the current breakpoint
  getBreakpointValue() {
    return parseInt(this.viewport.split(",")[1]);
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
