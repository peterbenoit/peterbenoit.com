console.log(`%c

██████╗ ██████╗ ██╗ ██████╗██╗  ██╗ ██████╗██╗████████╗██╗   ██╗
██╔══██╗██╔══██╗██║██╔════╝██║ ██╔╝██╔════╝██║╚══██╔══╝╚██╗ ██╔╝
██████╔╝██████╔╝██║██║     █████╔╝ ██║     ██║   ██║    ╚████╔╝
██╔══██╗██╔══██╗██║██║     ██╔═██╗ ██║     ██║   ██║     ╚██╔╝
██████╔╝██║  ██║██║╚██████╗██║  ██╗╚██████╗██║   ██║      ██║
╚═════╝ ╚═╝  ╚═╝╚═╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝╚═╝   ╚═╝      ╚═╝

 ██████╗██████╗ ███████╗ █████╗ ████████╗██╗██╗   ██╗███████╗
██╔════╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██║██║   ██║██╔════╝
██║     ██████╔╝█████╗  ███████║   ██║   ██║██║   ██║█████╗
██║     ██╔══██╗██╔══╝  ██╔══██║   ██║   ██║╚██╗ ██╔╝██╔══╝
╚██████╗██║  ██║███████╗██║  ██║   ██║   ██║ ╚████╔╝ ███████╗
 ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═══╝  ╚══════╝


Type window.about() to learn more about Brick City Creative.
`, 'color:#c04557;font-family:monospace;font-size:12px');


window.about = function () {
	const quotes = [
		"Ocala: Where horse country meets opportunity.",
		"The heart of Florida's horse country with a business-forward vision.",
		"Ocala: Small-town charm with big-city possibilities.",
		"Where tradition and innovation intersect in Marion County.",
		"Ocala: A historic destination for modern enterprises.",
		"The Brick City - Building business foundations since 1846.",
		"Marion County's hub for excellence and professional growth.",
		"Ocala: Where southern hospitality powers business success.",
	];
	const quote = quotes[Math.floor(Math.random() * quotes.length)];
	console.log(`%c

BrickCity Creative: Professional Design and Development Services

Established in Ocala, Florida, Brick City Creative delivers premium design,
development, and marketing solutions for businesses nationwide.

Our team of professionals combines decades of industry experience with
cutting-edge technology to provide unmatched results for our clients.

====================
CONTACT INFORMATION
====================
Email: contact@brickcitycreative.com
Phone: (352) 555-1234
Office: 110 SE Watula Ave, Ocala, FL 34471

====================
OPPORTUNITIES
====================
Inquiries: https://brickcitycreative.com/inquiries
Careers: https://brickcitycreative.com/careers

"${quote}"

  `, 'color:#1565c0;font-family:monospace;font-size:12px');
};
