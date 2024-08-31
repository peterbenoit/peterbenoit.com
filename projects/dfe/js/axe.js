// this is minified then HTML escaped and passed to JS in the preview window; this currently exists in the axe.html include

// TODO: determine how to exclude disabled elements

//https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md
axe.run( {
	rules: {
		"landmark-one-main": {
			"enabled": false
		},
		"page-has-heading-one": {
			"enabled": false
		},
		"region": {
			"enabled": false
		}
	}
}, function( e, r ) {
	if ( r.violations.length ) {
		const th = gAT( r.violations );
		const body = document.body;
		const rc = document.createElement( 'div' );
		rc.style = "position: fixed;left: 0;bottom: 0;width:100%;font-size: 11px;";
        rc.classList.add('text-monospace');
		rc.innerHTML = th;
		body.appendChild( rc );
		document.querySelectorAll( 'table a' ).forEach( lnk => {
			lnk.addEventListener( 'click', () => document.querySelectorAll( lnk.hash.split( '#' ).pop() )[ 0 ].style = 'border:1px solid red;background:yellow' );
		} );
	} else {
		const body = document.body;
		const rc = document.createElement( 'div' );
		rc.style = "position: fixed;left: 0;bottom: 0;width:100%;font-size: 11px;";
        rc.classList.add('text-monospace');
		rc.innerHTML = "No 508 violations found";
		body.appendChild( rc );
    }
} );

function gAT( r ) {
	let th = '<table class="table table-light">';
	th += '<thead><tr><th>Issue</th><th>Description</th><th>Impact</th><th>Element</th></tr></thead>';
	th += '<tbody>';
	r.forEach( v => {
		const ele = cLFE( v.nodes[ 0 ].target );
		th += `<tr><td>${v.id}</td><td>${v.description}</td><td>${v.impact}</td><td>${ele}</td></tr>`;
	} );
	th += '</tbody>';
	th += '</table>';
	return th;
}

function cLFE( tg ) {
	return `<a href="#${tg}">${tg}</a>`;
}