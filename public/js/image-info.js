(function () {
	let imgs = document.querySelectorAll('img');
	if (imgs.length === 0) {
		alert('No images found on this page.');
		return;
	}

	// Add CSS for info panels
	const style = document.createElement('style');
	style.textContent = `
        .img-info-panel{
            position:absolute;
            background:rgba(0,0,0,0.8);
            color:white;
            padding:8px;
            border-radius:4px;
            font-size:12px;
            font-family:monospace;
            pointer-events:none;
            z-index:9999;
            max-width:250px;
            text-align:left;
        }
        .img-info-panel table{
            border-collapse:collapse;
        }
        .img-info-panel td{
            padding:2px 5px;
        }
    `;
	document.head.appendChild(style);

	let count = 0;
	imgs.forEach(img => {
		// Skip if already processed
		if (img.hasAttribute('data-info-panel')) return;

		const w = img.naturalWidth;
		const h = img.naturalHeight;
		const aspectRatio = (w / h).toFixed(2);
		const loadedSrc = img.currentSrc || img.src;
		const alt = img.alt || 'No alt text';
		const format = loadedSrc.split('.').pop().split('?')[0].toUpperCase();

		// Calculate image size if possible
		let imgSize = 'Unknown';
		if (loadedSrc.startsWith('data:')) {
			const base64 = loadedSrc.split(',')[1];
			const sizeInBytes = Math.ceil(atob(base64).length);
			imgSize = formatBytes(sizeInBytes);
		}

		// Create info panel with enhanced data
		const infoPanel = document.createElement('div');
		infoPanel.className = 'img-info-panel';
		infoPanel.innerHTML = `
            <table>
                <tr><td>Dimensions:</td><td>${w} × ${h}px</td></tr>
                <tr><td>Aspect Ratio:</td><td>${aspectRatio}</td></tr>
                <tr><td>Format:</td><td>${format}</td></tr>
                <tr><td>Size:</td><td>${imgSize}</td></tr>
                <tr><td>Alt Text:</td><td>${alt.length > 20 ? alt.substring(0, 20) + '...' : alt}</td></tr>
                <tr><td>Loading:</td><td>${img.loading || 'auto'}</td></tr>
            </table>
        `;

		// Position info panel
		img.setAttribute('data-info-panel', 'true');

		// Add hover behavior
		img.addEventListener('mouseover', () => {
			document.body.appendChild(infoPanel);
			const rect = img.getBoundingClientRect();
			infoPanel.style.top = (window.scrollY + rect.top) + 'px';
			infoPanel.style.left = (window.scrollX + rect.left) + 'px';
		});

		img.addEventListener('mouseout', () => {
			if (document.body.contains(infoPanel)) {
				document.body.removeChild(infoPanel);
			}
		});

		count++;
	});

	function formatBytes(bytes) {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'MB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}

	alert(`Found ${count} images. Hover over images to see details. Refresh the page to disable.`);
})();
