// Animations Library
// Gestisce tutte le animazioni del sito

// Inizializza le animazioni quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
	initHeaderAnimation();
	initMenuAnimation();
});

// Animazione dell'header con stelle
function initHeaderAnimation() {
	const headerCanvas = document.getElementById('headerSpace');
	if (!headerCanvas) return;

	// Crea una nuova istanza di Starfield
	const starfield = new Starfield(headerCanvas);
	starfield.init();

	// Gestisci il ridimensionamento
	window.addEventListener('resize', () => {
		starfield.resize();
		starfield.createStars();
	});

	// Salva l'istanza per eventuali utilizzi futuri
	window.headerStarfield = starfield;
}

// Animazione del menu
function initMenuAnimation() {
	const menuToggle = document.getElementById('menuToggle');
	const menu = document.getElementById('menu');

	if (!menuToggle || !menu) return;

	menuToggle.addEventListener('click', () => {
		menu.classList.toggle('active');
	});

	const navLinks = menu.querySelectorAll('a');
	navLinks.forEach(link => {
		link.addEventListener('click', () => {
			menu.classList.remove('active');
		});
	});

	document.addEventListener('click', (e) => {
		if (!e.target.closest('header')) {
			menu.classList.remove('active');
		}
	});
}