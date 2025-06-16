// Loading Screen
window.addEventListener('load', () => {
	setTimeout(() => {
		document.querySelector('.loading-screen').classList.add('hidden');
	}, 1000);

	// Ensure all words are visible after load (fallback for animation)
	setTimeout(() => {
		document.querySelectorAll('.word').forEach(word => {
			word.style.opacity = '1';
			word.style.transform = 'translateY(0)';
		});
	}, 1500); // Give animations time to complete first
});

// Custom Cursor
const cursor = document.querySelector('.cursor-follower');
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
	mouseX = e.clientX;
	mouseY = e.clientY;
});

function animateCursor() {
	// Set cursor position directly to mouse position without easing
	cursorX = mouseX;
	cursorY = mouseY;

	cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;

	requestAnimationFrame(animateCursor);
}

if (window.innerWidth > 768) {
	animateCursor();
}

// Hover effects for interactive elements
const interactiveElements = document.querySelectorAll('a, button, .card-content');

interactiveElements.forEach((el) => {
	el.addEventListener('mouseenter', () => {
		cursor.style.transform += ' scale(1.5)';
	});

	el.addEventListener('mouseleave', () => {
		cursor.style.transform = cursor.style.transform.replace(' scale(1.5)', '');
	});
});

// Particle System
class ParticleSystem {
	constructor() {
		this.canvas = document.getElementById('particles-canvas');

		// Check if canvas exists and is actually a canvas element
		if (!this.canvas || this.canvas.tagName !== 'CANVAS') {
			console.warn('Canvas element not found or not a canvas element');
			return;
		}

		this.ctx = this.canvas.getContext('2d');
		if (!this.ctx) {
			console.warn('Could not get 2D context from canvas');
			return;
		}

		this.particles = [];
		this.mouse = { x: 0, y: 0 };

		this.init();
		this.animate();
		this.bindEvents();
	}

	init() {
		this.resize();

		for (let i = 0; i < 50; i++) {
			this.particles.push({
				x: Math.random() * this.canvas.width,
				y: Math.random() * this.canvas.height,
				vx: (Math.random() - 0.5) * 0.5,
				vy: (Math.random() - 0.5) * 0.5,
				size: Math.random() * 2 + 1,
				opacity: Math.random() * 0.5 + 0.1,
			});
		}
	}

	resize() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}

	bindEvents() {
		window.addEventListener('resize', () => this.resize());
		window.addEventListener('mousemove', (e) => {
			this.mouse.x = e.clientX;
			this.mouse.y = e.clientY;
		});
	}

	animate() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.particles.forEach((particle, index) => {
			// Update position
			particle.x += particle.vx;
			particle.y += particle.vy;

			// Mouse interaction
			const dx = this.mouse.x - particle.x;
			const dy = this.mouse.y - particle.y;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance < 100) {
				const force = (100 - distance) / 100;
				particle.vx -= (dx / distance) * force * 0.01;
				particle.vy -= (dy / distance) * force * 0.01;
			}

			// Boundaries
			if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
			if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

			// Draw particle
			this.ctx.beginPath();
			this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
			this.ctx.fillStyle = `rgba(99, 102, 241, ${particle.opacity})`;
			this.ctx.fill();

			// Draw connections
			this.particles.slice(index + 1).forEach((otherParticle) => {
				const dx = particle.x - otherParticle.x;
				const dy = particle.y - otherParticle.y;
				const distance = Math.sqrt(dx * dx + dy * dy);

				if (distance < 100) {
					this.ctx.beginPath();
					this.ctx.moveTo(particle.x, particle.y);
					this.ctx.lineTo(otherParticle.x, otherParticle.y);
					this.ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance / 100)
						})`;
					this.ctx.lineWidth = 1;
					this.ctx.stroke();
				}
			});
		});

		requestAnimationFrame(() => this.animate());
	}
}

// Initialize particle system with error checking
try {
	new ParticleSystem();
} catch (error) {
	console.warn('Failed to initialize particle system:', error);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
	anchor.addEventListener('click', function (e) {
		e.preventDefault();
		document.querySelector(this.getAttribute('href')).scrollIntoView({
			behavior: 'smooth',
		});
	});
});

// Add scroll-based animations
const observerOptions = {
	threshold: 0.1,
	rootMargin: '0px 0px -50px 0px',
};

const observer = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			entry.target.style.opacity = '1';
			entry.target.style.transform = 'translateY(0)';
		}
	});
}, observerOptions);

document.querySelectorAll('.feature-card').forEach((card) => {
	card.style.opacity = '0';
	card.style.transform = 'translateY(30px)';
	card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
	observer.observe(card);
});

// Add some interactive sparkle effects
function createSparkle(x, y) {
	const sparkle = document.createElement('div');
	sparkle.style.position = 'fixed';
	sparkle.style.left = x + 'px';
	sparkle.style.top = y + 'px';
	sparkle.style.width = '4px';
	sparkle.style.height = '4px';
	sparkle.style.background = '#6366f1';
	sparkle.style.borderRadius = '50%';
	sparkle.style.pointerEvents = 'none';
	sparkle.style.zIndex = '9999';
	sparkle.style.animation = 'sparkle 1s ease-out forwards';

	document.body.appendChild(sparkle);

	setTimeout(() => {
		document.body.removeChild(sparkle);
	}, 1000);
}

// Add sparkle effect on button hover
document.querySelectorAll('.btn-primary').forEach((btn) => {
	btn.addEventListener('mouseenter', (e) => {
		const rect = btn.getBoundingClientRect();
		for (let i = 0; i < 3; i++) {
			setTimeout(() => {
				createSparkle(
					rect.left + Math.random() * rect.width,
					rect.top + Math.random() * rect.height
				);
			}, i * 100);
		}
	});
});

// Add CSS for sparkle animation
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
                @keyframes sparkle {
                    0% {
                        opacity: 1;
                        transform: scale(0) rotate(0deg);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1) rotate(180deg);
                    }
                    100% {
                        opacity: 0;
                        transform: scale(0) rotate(360deg);
                    }
                }
            `;
document.head.appendChild(sparkleStyle);
