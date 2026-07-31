document.addEventListener('DOMContentLoaded', () => {

    const triggerOverlay = document.getElementById('triggerOverlay');
    const startButton = document.getElementById('startButton');
    const loadingBar = document.getElementById('loadingBar');
    const statusText = document.getElementById('statusText');
    const ambientLight = document.getElementById('ambientLight');
    const roseWrapper = document.getElementById('roseWrapper');
    const roseHead = document.getElementById('roseHead');
    const stem = document.getElementById('stem');
    const leafLeft = document.getElementById('leafLeft');
    const leafRight = document.getElementById('leafRight');
    const endText = document.getElementById('endText');
    const fallingPetalsEl = document.getElementById('fallingPetals');

    const FLORET_TYPES = ['floret-blue', 'floret-purple', 'floret-pink', 'floret-softblue'];

    const FALLING_PETAL_COLORS = [
        ['#8ca0ff', '#5271ff'],
        ['#b28cff', '#8052ff'],
        ['#f08cff', '#d852ff'],
        ['#7db9ff', '#3b93ff'],
    ];

    let fallingPetalInterval = null;

    function startCardLoader() {
        const duration = 2400;
        const steps = [
            { threshold: 20, text: 'Loading Flower.css...' },
            { threshold: 50, text: 'Assembling 3D florets...' },
            { threshold: 80, text: 'Blending pastel gradients...' },
            { threshold: 95, text: 'Preparing spherical bloom...' },
            { threshold: 100, text: 'Ready to bloom!' }
        ];

        let startTimestamp = null;

        function animateLoader(timestamp) {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const percent = Math.floor(progress * 100);

            loadingBar.style.width = `${percent}%`;
            const activeStep = steps.find(s => percent <= s.threshold) || steps[steps.length - 1];
            statusText.textContent = activeStep.text;

            if (progress < 1) {
                requestAnimationFrame(animateLoader);
            } else {
                startButton.removeAttribute('disabled');
            }
        }

        requestAnimationFrame(animateLoader);
    }

    function createHydrangeaCluster() {
        const totalFlorets = 90;
        const radius = 75;

        for (let i = 0; i < totalFlorets; i++) {
            const floret = document.createElement('div');
            const colorClass = FLORET_TYPES[Math.floor(Math.random() * FLORET_TYPES.length)];
            floret.className = `floret ${colorClass}`;

            const phi = Math.acos(-1 + (2 * i) / totalFlorets);
            const theta = Math.sqrt(totalFlorets * Math.PI) * phi;

            const x = radius * Math.cos(theta) * Math.sin(phi);
            const y = radius * Math.sin(theta) * Math.sin(phi) - 10;
            const z = radius * Math.cos(phi);

            // ปรับทิศทางการหันหน้ากลีบดอกย่อยให้หันออกจากจุดศูนย์กลางธรรมชาติ
            const ry = (theta * 180) / Math.PI;
            const rx = (phi * 180) / Math.PI - 90;

            const delay = (Math.sqrt(x * x + y * y + z * z) / radius) * 0.8 + (i / totalFlorets) * 1.2;
            const scale = 0.85 + Math.random() * 0.3;

            floret.style.setProperty('--x', `${x.toFixed(2)}px`);
            floret.style.setProperty('--y', `${y.toFixed(2)}px`);
            floret.style.setProperty('--z', `${z.toFixed(2)}px`);
            floret.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
            floret.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
            floret.style.setProperty('--delay', `${delay.toFixed(2)}s`);
            floret.style.setProperty('--scale', scale.toFixed(2));

            const center = document.createElement('div');
            center.className = 'floret-center';
            floret.appendChild(center);

            for (let j = 0; j < 4; j++) {
                const petal = document.createElement('div');
                petal.className = 'floret-petal';
                const angle = j * 90 + (Math.random() - 0.5) * 8;
                const curl = 10 + Math.random() * 12;
                petal.style.transform = `rotate(${angle}deg) rotateX(${curl}deg)`;
                floret.appendChild(petal);
            }

            roseHead.appendChild(floret);
        }
    }

    function growStem() {
        return new Promise(resolve => {
            stem.classList.add('grow');

            setTimeout(() => {
                leafLeft.classList.add('visible');
            }, 800);

            setTimeout(() => {
                leafRight.classList.add('visible');
            }, 1100);

            setTimeout(resolve, 2200);
        });
    }

    function bloom() {
        ambientLight.classList.add('visible');
        roseHead.classList.add('blooming');
    }

    function spawnFallingPetal() {
        if (fallingPetalsEl.childElementCount > 10) return;

        const petal = document.createElement('div');
        petal.className = 'falling-petal';

        const w = 10 + Math.random() * 10;
        const h = w * (1.2 + Math.random() * 0.2);
        const x = 20 + Math.random() * 60;
        const y = 3 + Math.random() * 10;
        const dur = 5.5 + Math.random() * 3.5;
        const delay = Math.random() * 0.6;

        const colors = FALLING_PETAL_COLORS[Math.floor(Math.random() * FALLING_PETAL_COLORS.length)];

        const sign = () => (Math.random() > 0.5 ? 1 : -1);
        const s1 = sign() * (15 + Math.random() * 25);
        const s2 = sign() * (10 + Math.random() * 20);
        const s3 = sign() * (20 + Math.random() * 30);
        const s4 = sign() * (10 + Math.random() * 15);

        petal.style.left = `${x}vw`;
        petal.style.top = `${y}vh`;
        petal.style.setProperty('--fp-w', `${w}px`);
        petal.style.setProperty('--fp-h', `${h}px`);
        petal.style.setProperty('--fp-c1', colors[0]);
        petal.style.setProperty('--fp-c2', colors[1]);
        petal.style.setProperty('--f-dur', `${dur}s`);
        petal.style.setProperty('--f-delay', `${delay}s`);
        petal.style.setProperty('--s1', `${s1}px`);
        petal.style.setProperty('--s2', `${s2}px`);
        petal.style.setProperty('--s3', `${s3}px`);
        petal.style.setProperty('--s4', `${s4}px`);

        fallingPetalsEl.appendChild(petal);

        setTimeout(() => {
            if (petal.parentNode) petal.remove();
        }, (dur + delay) * 1000 + 300);
    }

    function startFallingPetals() {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => spawnFallingPetal(), i * 300);
        }

        fallingPetalInterval = setInterval(() => {
            spawnFallingPetal();
        }, 2200);
    }

    async function startAnimationSequence() {
        await growStem();
        await delay(100);
        bloom();

        setTimeout(() => {
            roseWrapper.classList.add('rotating');
        }, 3400);

        setTimeout(() => startFallingPetals(), 3800);

        setTimeout(() => {
            endText.classList.add('visible');
        }, 4600);
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    startButton.addEventListener('click', () => {
        triggerOverlay.classList.add('fade-out');

        setTimeout(() => {
            startAnimationSequence();
        }, 800);
    });

    createHydrangeaCluster();

    setTimeout(() => {
        startCardLoader();
    }, 400);

});
