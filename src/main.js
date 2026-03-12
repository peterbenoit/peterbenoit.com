import './style.css';

// UI Experiments data extracted from uiguy.dev and CodePen
const experiments = [
	{ title: "Apple Liquid Glass", url: "https://codepen.io/peterbenoit/full/qEdYxyL", desc: "Mimics Apple's liquid glass." },
	{ title: "Netflix Demo", url: "https://codepen.io/peterbenoit/full/ExBGKjY", desc: "Interactive demo showcasing Netflix style." },
	{ title: "Interactive CSS Mask", url: "https://codepen.io/peterbenoit/full/MWMNOYE", desc: "Interactive demo of CSS masks." },
	{ title: "Events Dashboard", url: "https://codepen.io/peterbenoit/full/KKjreLw", desc: "Visually appealing event dashboard UI." },
	{ title: "Animated CSS Backgrounds", url: "https://codepen.io/peterbenoit/full/mdZzrZp", desc: "Keyframe animations for backgrounds." },
	{ title: "GradientMaker", url: "https://codepen.io/peterbenoit/full/bGPJeWj", desc: "Interactive tool for creating beautiful gradients." },
	{ title: "Marco Polo Map Timeline", url: "https://codepen.io/peterbenoit/full/xbwGzzo", desc: "Timeline map with compass and slides." },
	{ title: "ResembleJS Comparison", url: "https://codepen.io/peterbenoit/full/dPozgyN", desc: "Detecting visual differences via UI." },
	{ title: "Youtube Subscribe Anim", url: "https://codepen.io/peterbenoit/full/QwjGmXp", desc: "A demo of the Youtube Subscribe Button Animation." },
	{ title: "Github User Search", url: "https://codepen.io/peterbenoit/full/yLdrxbe", desc: "Search and explore GitHub profiles." },
	{ title: "Doggo Image Slider", url: "https://codepen.io/peterbenoit/full/dyxXyYy", desc: "Image slider showcasing adorable dog images." },
	{ title: "CSS Mask Manipulation", url: "https://codepen.io/peterbenoit/full/MWMNOYE", desc: "Interactive demo showcasing CSS mask manipulation." }
];

document.addEventListener('DOMContentLoaded', () => {
	const container = document.getElementById('ui-experiments-container');
	if (container) {
		const experimentsHtml = experiments.slice(0, 12).map(exp => `
      <a href="${exp.url}" target="_blank" class="group block p-4 rounded-xl border border-slate-800 bg-slate-800/20 hover:bg-slate-800/60 transition-colors flex flex-col justify-between h-full">
        <div>
          <h4 class="font-medium text-cyan-300 mb-2 group-hover:text-cyan-200 transition-colors">${exp.title}</h4>
          <p class="text-xs text-slate-400 leading-relaxed">${exp.desc}</p>
        </div>
        <div class="mt-4 flex justify-end">
          <svg class="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
        </div>
      </a>
    `).join('');
		container.innerHTML = experimentsHtml;
	}
});
