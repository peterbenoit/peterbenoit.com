const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const numberOfParticles = 100;
const maxRadius = 3;
const zipDuration = 2000; // Duration of zip animation in milliseconds

// Function to create particles with random positions and velocities
function createParticles() {
    for (let i = 0; i < numberOfParticles; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            originalX: Math.random() * canvas.width,
            originalY: Math.random() * canvas.height,
            velocityX: (Math.random() - 0.5) * 2,
            velocityY: (Math.random() - 0.5) * 2,
            radius: Math.random() * maxRadius,
            color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 255, 0.8)`,
            zipping: false, // Flag to check if particle is currently zipping
        });
    }
}

// Function to update particle positions
function updateParticles() {
    particles.forEach(particle => {
        if (!particle.zipping) {
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;

            // Bounce particles off the edges
            if (particle.x < 0 || particle.x > canvas.width) particle.velocityX *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.velocityY *= -1;
        }
    });
}

// Function to draw particles on the canvas
function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = particle.color;
        ctx.fill();
    });
}

// Function to animate the background
function animateBackground() {
    drawParticles();
    updateParticles();
    requestAnimationFrame(animateBackground);
}

// Function to handle mouse movement and scroll events
window.addEventListener('mousemove', (event) => {
    particles.forEach(particle => {
        const distanceX = particle.x - event.clientX;
        const distanceY = particle.y - event.clientY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        // Adjust particle velocity based on mouse distance
        if (distance < 100) {
            particle.velocityX += (distanceX / distance) * 0.1;
            particle.velocityY += (distanceY / distance) * 0.1;
        }
    });
});

window.addEventListener('scroll', () => {
    const scrollFactor = window.scrollY / window.innerHeight;
    particles.forEach(particle => {
        particle.x += particle.velocityX * scrollFactor;
        particle.y += particle.velocityY * scrollFactor;
    });
});

// Function to randomly select a particle to zip across the screen
function startZipAnimation() {
    const randomIndex = Math.floor(Math.random() * particles.length);
    const particle = particles[randomIndex];
    if (!particle.zipping) {
        particle.zipping = true; // Set the zipping flag

        // Store original position to reset later
        const startX = particle.x;
        const startY = particle.y;
        const endX = Math.random() * canvas.width;
        const endY = Math.random() * canvas.height;

        let startTime = null;
        function zip(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;

            // Linear interpolation for zipping animation
            particle.x = startX + (endX - startX) * (elapsed / zipDuration);
            particle.y = startY + (endY - startY) * (elapsed / zipDuration);

            if (elapsed < zipDuration) {
                requestAnimationFrame(zip);
            } else {
                // Reset position after zipping and allow to zip again
                particle.x = particle.originalX;
                particle.y = particle.originalY;
                particle.zipping = false; // Reset zipping flag
            }
        }
        requestAnimationFrame(zip);
    }
}

// Initialize and animate the background
createParticles();
animateBackground();

// Start zip animation every 5-10 seconds
// setInterval(startZipAnimation, Math.random() * 5000 + 5000);
