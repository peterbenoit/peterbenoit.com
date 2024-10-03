(function () {
	const randomId = Math.random().toString(36).slice(2);
    function gAT(t) {
        let e = `<table class="styled-table-${randomId}">`;
        e += "<thead><tr><th>Issue</th><th>Description</th><th>Impact</th><th>Element</th></tr></thead>";
        e += "<tbody>";
        t.forEach(t => {
            let l = cLFE(t.nodes[0].target);
            e += `<tr><td>${t.id}</td><td>${t.description}</td><td>${t.impact}</td><td>${l}</td></tr>`;
        });
        e += "</tbody>";
        e += "</table>";
        return e;
    }

	function cLFE(target) {
		const targetString = Array.isArray(target) ? target[0] : target;
		const cleanTarget = targetString.replace(/\s/g, '').replace(/"/g, '&quot;').replace(/^#/, '');
		return `<a href="#${cleanTarget}">${targetString}</a>`;
	}

    function createAccessibilityIcon() {
        const icon = document.createElement("div");
        icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm161.5-86.1c-12.2-5.2-26.3 .4-31.5 12.6s.4 26.3 12.6 31.5l11.9 5.1c17.3 7.4 35.2 12.9 53.6 16.3l0 50.1c0 4.3-.7 8.6-2.1 12.6l-28.7 86.1c-4.2 12.6 2.6 26.2 15.2 30.4s26.2-2.6 30.4-15.2l24.4-73.2c1.3-3.8 4.8-6.4 8.8-6.4s7.6 2.6 8.8 6.4l24.4 73.2c4.2 12.6 17.8 19.4 30.4 15.2s19.4-17.8 15.2-30.4l-28.7-86.1c-1.4-4.1-2.1-8.3-2.1-12.6l0-50.1c18.4-3.5 36.3-8.9 53.6-16.3l11.9-5.1c12.2-5.2 17.8-19.3 12.6-31.5s-19.3-17.8-31.5-12.6L338.7 175c-26.1 11.2-54.2 17-82.7 17s-56.5-5.8-82.7-17l-11.9-5.1zM256 160a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"/></svg>`;
        icon.style.position = 'fixed';
        icon.style.top = '20px';
        icon.style.right = '20px';
        icon.style.zIndex = '1000';
        icon.style.display = 'none';
        icon.style.color = '#0881c4';
        icon.style.width = '30px';
        icon.style.cursor = 'pointer';
        document.body.appendChild(icon);
        return icon;
    }

    function createFloatingPanel() {
        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.top = '60px';
        panel.style.right = '10px';
        panel.style.width = '1000px';
        panel.style.maxHeight = '50vh';
        panel.style.backgroundColor = 'white';
        panel.style.border = '1px solid #ddd';
        panel.style.padding = '5px';
        panel.style.overflowY = 'auto';
        panel.style.display = 'none';
        panel.style.zIndex = '99999';
        panel.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
        panel.style.fontSize = '12px';
        document.body.appendChild(panel);

        const style = document.createElement('style');
        style.innerHTML = `
            .styled-table-${randomId} {
                width: 100%;
                border-collapse: collapse;
                font-size: 14px;
                text-align: left;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            }
            .styled-table-${randomId} thead tr {
                background-color: #0881c4;
                color: #ffffff;
                text-align: left;
            }
            .styled-table-${randomId} th,
            .styled-table-${randomId} td {
                padding: 12px 15px;
            }
            .styled-table-${randomId} tbody tr {
                border-bottom: 1px solid #dddddd;
            }
            .styled-table-${randomId} tbody tr:nth-of-type(even) {
                background-color: #f3f3f3;
            }
            .styled-table-${randomId} tbody tr:last-of-type {
                border-bottom: 2px solid #0881c4;
            }
            .styled-table-${randomId} tbody tr:hover {
                background-color: #f5f5f5;
            }
        `;
        document.head.appendChild(style);

        return panel;
    }

    function runAxeAnalysis() {
        const axeCDN = document.createElement('script');
        axeCDN.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.0/axe.min.js';
        document.head.appendChild(axeCDN);

        axeCDN.onload = function () {
            axe.run({ rules: { "landmark-one-main": { enabled: !1 }, "page-has-heading-one": { enabled: !1 }, region: { enabled: !1 } } }, function (t, e) {
                const icon = createAccessibilityIcon();
                const panel = createFloatingPanel();

                console.log(t, e);
                if (e.violations.length) {
                    let tableContent = gAT(e.violations);
                    panel.innerHTML = tableContent;
                    icon.style.display = 'block';

                    icon.addEventListener('click', function () {
                        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
                    });

                    document.querySelectorAll("table a").forEach(link => {
                        link.addEventListener("click", () => {
                            document.querySelectorAll(link.hash.split("#").pop())[0].style = "border:1px solid red;background:yellow";
                        });
                    });
                } else {
                    console.log("No accessibility violations found.");
                }
            });
        };
    }

    document.addEventListener("DOMContentLoaded", runAxeAnalysis);
})();
