// Starfield Animation Library
// Gestisce l'animazione delle stelle e delle shooting stars

class Starfield {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.stars = [];
		this.shootingStars = [];
		this.lastShootingStarTime = 0;
		this.shootingStarInterval = 4000;
		this.animationId = null;
	}

	init() {
		this.resize();
		this.createStars();
		this.animate();
	}

	resize() {
		this.canvas.width = this.canvas.offsetWidth;
		this.canvas.height = this.canvas.offsetHeight;
	}

	createStars() {
		this.stars = [];
		const count = Math.max(150, Math.floor(this.canvas.width / 6));
		for (let i = 0; i < count; i++) {
			const isLargeStar = Math.random() < 0.15;
			const size = isLargeStar ? Math.random() * 2 + 1.5 : Math.random() * 0.8 + 0.2;
			
			this.stars.push({
				x: Math.random() * this.canvas.width,
				y: Math.random() * this.canvas.height,
				size: size,
				isLargeStar: isLargeStar,
				brightness: Math.random() * 0.5 + 0.5,
				twinkleSpeed: Math.random() * 0.04 + 0.02,
				twinklePhase: Math.random() * Math.PI * 2
			});
		}
	}

	createShootingStar() {
		// Spawn da un lato con direzione verso un lato adiacente
		const spawnSide = Math.floor(Math.random() * 4);
		let startX, startY, targetX, targetY;
		
		// Lati adiacenti: 0=top, 1=right, 2=bottom, 3=left
		// Lato opposto: (side + 2) % 4
		// Lati adiacenti: (side + 1) % 4 e (side + 3) % 4
		
		if (spawnSide === 0) {
			// Top -> verso destra o sinistra (non bottom)
			startX = Math.random() * this.canvas.width * 0.6 + this.canvas.width * 0.2;
			startY = -90;
			const direction = Math.random() < 0.5 ? 1 : -1;
			targetX = direction > 0 ? this.canvas.width + 90 : -90;
			targetY = Math.random() * this.canvas.height * 0.4 + this.canvas.height * 0.1;
		} else if (spawnSide === 1) {
			// Right -> verso top o bottom (non left)
			startX = this.canvas.width + 90;
			startY = Math.random() * this.canvas.height * 0.6 + this.canvas.height * 0.2;
			const direction = Math.random() < 0.5 ? 1 : -1;
			targetX = -90;
			targetY = direction > 0 ? -90 : this.canvas.height + 90;
		} else if (spawnSide === 2) {
			// Bottom -> verso destra o sinistra (non top)
			startX = Math.random() * this.canvas.width * 0.6 + this.canvas.width * 0.2;
			startY = this.canvas.height + 90;
			const direction = Math.random() < 0.5 ? 1 : -1;
			targetX = direction > 0 ? this.canvas.width + 90 : -90;
			targetY = Math.random() * this.canvas.height * 0.4 + this.canvas.height * 0.5;
		} else {
			// Left -> verso top o bottom (not right)
			startX = -90;
			startY = Math.random() * this.canvas.height * 0.6 + this.canvas.height * 0.2;
			const direction = Math.random() < 0.5 ? 1 : -1;
			targetX = this.canvas.width + 90;
			targetY = direction > 0 ? -90 : this.canvas.height + 90;
		}

		const deltaX = targetX - startX;
		const deltaY = targetY - startY;
		const distance = Math.hypot(deltaX, deltaY);

		// Dimensioni casuali per la shooting star
		const sizeMultiplier = Math.random() * 0.8 + 0.4;

		this.shootingStars.push({
			x: startX,
			y: startY,
			length: Math.random() * 100 + 150,
			speed: Math.random() * 3 + 5,
			directionX: deltaX / distance,
			directionY: deltaY / distance,
			opacity: 1,
			life: 0,
			maxLife: 200,
			size: 2 * sizeMultiplier,
			tailSize: 2 * sizeMultiplier
		});
	}

	drawFourPointStar(ctx, x, y, size) {
		const points = 4;
		const outerRadius = size;
		const innerRadius = size * 0.4;

		ctx.beginPath();
		for (let i = 0; i < points * 2; i++) {
			const radius = i % 2 === 0 ? outerRadius : innerRadius;
			const angle = (i * Math.PI) / points - Math.PI / 2;
			const px = x + Math.cos(angle) * radius;
			const py = y + Math.sin(angle) * radius;

			if (i === 0) {
				ctx.moveTo(px, py);
			} else {
				ctx.lineTo(px, py);
			}
		}
		ctx.closePath();
	}

	drawStars() {
		this.stars.forEach((star) => {
			star.twinklePhase += star.twinkleSpeed;
			const twinkle = Math.sin(star.twinklePhase);
			const opacity = 0.1 + (twinkle + 1) * 0.45;

			if (star.isLargeStar) {
				const grad = this.ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3);
				grad.addColorStop(0, `rgba(255,255,255,${opacity})`);
				grad.addColorStop(0.3, `rgba(200,220,255,${opacity * 0.8})`);
				grad.addColorStop(1, `rgba(150,180,255,${opacity * 0.2})`);

				this.ctx.fillStyle = grad;
				this.ctx.shadowColor = `rgba(180,210,255,${opacity * 0.8})`;
				this.ctx.shadowBlur = star.size * 5;

				this.drawFourPointStar(this.ctx, star.x, star.y, star.size);
				this.ctx.fill();

				this.ctx.fillStyle = `rgba(255,255,255,${opacity})`;
				this.ctx.beginPath();
				this.ctx.arc(star.x, star.y, star.size * 0.2, 0, Math.PI * 2);
				this.ctx.fill();
			} else {
				const grad = this.ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3);
				grad.addColorStop(0, `rgba(255,255,255,${opacity})`);
				grad.addColorStop(0.4, `rgba(220,240,255,${opacity * 0.6})`);
				grad.addColorStop(1, `rgba(100,180,255,${opacity * 0.2})`);

				this.ctx.fillStyle = grad;
				this.ctx.shadowColor = `rgba(150,200,255,${opacity * 0.8})`;
				this.ctx.shadowBlur = star.size * 4;

				this.ctx.beginPath();
				this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
				this.ctx.fill();
			}

			this.ctx.shadowBlur = 0;
		});
	}

	drawShootingStars() {
		for (let i = this.shootingStars.length - 1; i >= 0; i--) {
			const s = this.shootingStars[i];
			s.life++;
			s.x += s.directionX * s.speed;
			s.y += s.directionY * s.speed;
			s.opacity = Math.max(0, 1 - s.life / s.maxLife);

			const tailX = s.x - s.directionX * s.length;
			const tailY = s.y - s.directionY * s.length;
			const gradient = this.ctx.createLinearGradient(tailX, tailY, s.x, s.y);

			gradient.addColorStop(0, 'rgba(255,255,255,0)');
			gradient.addColorStop(0.3, `rgba(200,220,255,${s.opacity * 0.5})`);
			gradient.addColorStop(0.7, `rgba(255,255,255,${s.opacity * 0.8})`);
			gradient.addColorStop(1, `rgba(255,255,255,${s.opacity})`);

			this.ctx.save();
			this.ctx.strokeStyle = gradient;
			this.ctx.lineWidth = s.tailSize || 4;
			this.ctx.shadowColor = `rgba(220,230,255,${s.opacity})`;
			this.ctx.shadowBlur = 14;
			this.ctx.beginPath();
			this.ctx.moveTo(tailX, tailY);
			this.ctx.lineTo(s.x, s.y);
			this.ctx.stroke();

			// Disegna la stella alla punta
			this.ctx.fillStyle = `rgba(255,255,255,${s.opacity})`;
			this.ctx.beginPath();
			this.ctx.arc(s.x, s.y, s.size || 2.2, 0, Math.PI * 2);
			this.ctx.fill();
			
			// Aggiungi una stella a 4 punte alla punta
			this.drawFourPointStar(this.ctx, s.x, s.y, (s.size || 1.5) * 1.2);
			this.ctx.fillStyle = `rgba(255,255,255,${s.opacity * 0.8})`;
			this.ctx.fill();
			this.ctx.restore();

			// Rimuovi solo quando esce completamente dallo schermo
			const margin = 50;
			const outOfBounds = 
				(s.directionX > 0 && s.x > this.canvas.width + margin) ||
				(s.directionX < 0 && s.x < -margin) ||
				(s.directionY > 0 && s.y > this.canvas.height + margin) ||
				(s.directionY < 0 && s.y < -margin);
			
			if (outOfBounds) {
				this.shootingStars.splice(i, 1);
			}
		}
	}

	animate(timestamp = 0) {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.drawStars();

		if (timestamp - this.lastShootingStarTime >= this.shootingStarInterval) {
			this.createShootingStar();
			this.lastShootingStarTime = timestamp;
			
			// Occasionalmente crea una seconda shooting star
			if (Math.random() < 0.3) {
				setTimeout(() => this.createShootingStar(), 200);
			}
		}

		this.drawShootingStars();

		this.animationId = requestAnimationFrame((t) => this.animate(t));
	}

	destroy() {
		if (this.animationId) {
			cancelAnimationFrame(this.animationId);
		}
	}
}

// Esporta la classe
if (typeof module !== 'undefined' && module.exports) {
	module.exports = Starfield;
}