console.log(`%c

██╗   ██╗██╗ ██████╗ ██╗   ██╗██╗   ██╗
██║   ██║██║██╔════╝ ██║   ██║╚██╗ ██╔╝
██║   ██║██║██║  ███╗██║   ██║ ╚████╔╝
██║   ██║██║██║   ██║██║   ██║  ╚██╔╝
╚██████╔╝██║╚██████╔╝╚██████╔╝   ██║
 ╚═════╝ ╚═╝ ╚═════╝  ╚═════╝    ╚═╝


Type window.about() to learn more.
`, 'color:#00e676;font-family:monospace;font-size:12px');


window.about = function () {
	const quotes = [
		"I put the ‘fun’ in ‘functionally obsolete’.",
		"Still waiting for my CSS to impress my parents.",
		"Some people dream in color; I debug in my sleep.",
		"Powered by caffeine, poor decisions, and console.log().",
		"Not all heroes wear capes. Some push to main.",
		"Code is like humor. When you have to explain it, it’s bad.",
		"Why do programmers prefer dark mode? Because light attracts bugs.",
		"Debugging: Being the detective in a crime movie where you are also the murderer.",
	];
	const quote = quotes[Math.floor(Math.random() * quotes.length)];
	console.log(`%c

I've been making and pushing pixels since 1994.

No team, no VC funding, no crypto nonsense—just clean markup, bad jokes, and a tendency to overthink the simple things.

Some projects are serious. Some are just for fun. All are handcrafted with care, built for clarity, and occasionally updated when I remember.

I’m a sucker for clean code, and I’m not afraid to admit it. I’ve been known to spend hours obsessing over the perfect indentation.

Visit → https://uiguy.dev and waste a few more minutes of your life.

"${quote}"

  `, 'color:#ff009d;font-family:monospace;font-size:12px');
};
