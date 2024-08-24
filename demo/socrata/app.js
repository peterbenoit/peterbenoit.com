function getZoomLevel() {
	const screenWidth = window.innerWidth;

	if ( screenWidth < 1280 ) {
		return 3;
	} else {
		return 5;
	}
}

// Initialize the map and center it on the US
var map = L.map( 'map' ).setView( [ 37.8, -96 ], getZoomLevel() );

// Define bounds for the contiguous United States (including Alaska and Hawaii)
var bounds = [
	[ 49.38, -124.85 ], // Northwest corner
	[ 24.396308, -66.93457 ] // Southeast corner
];

// Fit the map to the defined bounds
map.fitBounds( bounds );

// Load and display the map tiles
L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 10,
	attribution: '&copy; OpenStreetMap contributors'
} ).addTo( map );

// Update map zoom and recenter on window resize
window.addEventListener( 'resize', function() {
	map.setView( [ 37.8, -96 ], getZoomLevel() );
	map.fitBounds( bounds );
} );

// Example CSV data preprocessing
const stateData = {}; // Dictionary to store CSV data

// Load the CSV file
fetch( 'data/state-data.csv' )
	.then( response => response.text() )
	.then( csvText => {
		const rows = csvText.split( '\n' );
		rows.forEach( row => {
			const [ Name, Population, YearFounded, Capital, Area ] = row.split( ',' );
			stateData[ Name ] = {
				Population,
				YearFounded,
				Capital,
				Area
			};
		} );
	} );



// Color palette for states and territories
const colors = [
	"AliceBlue", "Aqua", "Aquamarine",
	"Beige", "Bisque", "Black", "BlanchedAlmond", "Blue",
	"BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse",
	"Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson",
	"Cyan", "DarkBlue", "DarkCyan", "DarkGoldenRod", "DarkGray",
	"DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "Darkorange",
	"DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue",
	"DarkSlateGray", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue",
	"DimGray", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen",
	"Fuchsia", "Gainsboro", "Gold", "GoldenRod",
	"Gray", "Green", "GreenYellow", "HotPink",
	"IndianRed", "Indigo", "Khaki", "Lavender",
	"LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral",
	"LightCyan", "LightGoldenRodYellow", "LightGray", "LightGreen", "LightPink",
	"LightSalmon", "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSteelBlue",
	"LightYellow", "Lime", "LimeGreen", "Linen", "Magenta",
	"Maroon", "MediumAquaMarine", "MediumBlue", "MediumOrchid", "MediumPurple",
	"MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed",
	"MidnightBlue", "MistyRose", "Moccasin", "NavajoWhite",
	"Navy", "OldLace", "Olive", "OliveDrab", "Orange",
	"OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen", "PaleTurquoise",
	"PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru", "Pink",
	"Plum", "PowderBlue", "Purple", "RebeccaPurple", "Red",
	"RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown",
	"SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue",
	"SlateBlue", "SlateGray", "SpringGreen", "SteelBlue",
	"Tan", "Teal", "Thistle", "Tomato", "Turquoise",
	"Violet", "Wheat", "WhiteSmoke", "Yellow",
	"YellowGreen"
];



// List of GeoJSON files to load individually
const geojsonFiles = [
	'geojson/alabama.json',
	'geojson/alaska.json',
	'geojson/american_samoa.json',
	'geojson/arizona.json',
	'geojson/arkansas.json',
	'geojson/bajo_nuevo_bank.json',
	'geojson/baker_island.json',
	'geojson/california.json',
	'geojson/colorado.json',
	'geojson/connecticut.json',
	'geojson/delaware.json',
	'geojson/district_of_columbia.json',
	'geojson/florida.json',
	'geojson/georgia.json',
	'geojson/guam.json',
	'geojson/howland_island.json',
	'geojson/idaho.json',
	'geojson/illinois.json',
	'geojson/indiana.json',
	'geojson/iowa.json',
	'geojson/jarvis_island.json',
	'geojson/johnston_atoll.json',
	'geojson/kansas.json',
	'geojson/kentucky.json',
	'geojson/kingman_reef.json',
	'geojson/louisiana.json',
	'geojson/maine.json',
	'geojson/hawaii.json',
	'geojson/maryland.json',
	'geojson/massachusetts.json',
	'geojson/michigan.json',
	'geojson/midway_atoll.json',
	'geojson/minnesota.json',
	'geojson/mississippi.json',
	'geojson/missouri.json',
	'geojson/montana.json',
	'geojson/navassa_island.json',
	'geojson/nebraska.json',
	'geojson/nevada.json',
	'geojson/new_hampshire.json',
	'geojson/new_jersey.json',
	'geojson/new_mexico.json',
	'geojson/new_york.json',
	'geojson/north_carolina.json',
	'geojson/north_dakota.json',
	'geojson/northern_mariana_islands.json',
	'geojson/ohio.json',
	'geojson/oklahoma.json',
	'geojson/oregon.json',
	'geojson/palmyra_atoll.json',
	'geojson/pennsylvania.json',
	'geojson/puerto_rico.json',
	'geojson/rhode_island.json',
	'geojson/seranilla_bank.json',
	'geojson/south_carolina.json',
	'geojson/south_dakota.json',
	'geojson/tennessee.json',
	'geojson/texas.json',
	'geojson/us_virgin_islands.json',
	'geojson/utah.json',
	'geojson/vermont.json',
	'geojson/virginia.json',
	'geojson/wake_island.json',
	'geojson/washington.json',
	'geojson/west_virginia.json',
	'geojson/wisconsin.json',
	'geojson/wyoming.json',
];

geojsonFiles.forEach( file => {
	fetch( file )
		.then( response => response.json() )
		.then( geojsonData => {
			const color = colors.splice( Math.floor( Math.random() * colors.length ), 1 )[ 0 ];

			L.geoJson( geojsonData, {
				style: function( feature ) {
					return {
						fillColor: color,
						weight: 2,
						opacity: 1,
						color: "white",
						fillOpacity: 0.9
					};
				},
				onEachFeature: function( feature, layer ) {
					const stateName = feature.properties.name;
					const data = stateData[ stateName ];
					if ( data ) {
						layer.bindPopup( `
							<strong>${stateName}</strong><br>
							Population: ${data.Population}<br>
							Year Founded: ${data.YearFounded}<br>
							Capital: ${data.Capital}<br>
							Area: ${data.Area} sq mi
						` );
					} else {
						layer.bindPopup( `<strong>${stateName}</strong><br>No additional data available.` );
					}
				}
			} ).addTo( map );
		} )
		.catch( error => console.error( 'Error loading GeoJSON file:', error ) );
} );