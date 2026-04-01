import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

declare global {
  interface Window {
    setScannerScanning?: (active: boolean) => void;
    changeDirection?: () => void;
  }
}

const CardScannerSection: React.FC = () => {
  const cardStreamRef = useRef<HTMLDivElement>(null);
  const cardLineRef = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const scannerCanvasRef = useRef<HTMLCanvasElement>(null);
  const [speed, setSpeed] = useState(120);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!cardStreamRef.current || !cardLineRef.current || !particleCanvasRef.current || !scannerCanvasRef.current) return;

    // --- Card Stream Controller Logic ---
    const container = cardStreamRef.current;
    const cardLine = cardLineRef.current;
    
    let position = 0;
    let velocity = 120;
    let direction = -1;
    let localIsAnimating = true;
    let isDragging = false;
    let lastTime = 0;
    let lastMouseX = 0;
    let mouseVelocity = 0;
    const friction = 0.95;
    const minVelocity = 30;
    let containerWidth = container.offsetWidth;
    let cardLineWidth = 0;

    const generateCode = (width: number, height: number) => {
      const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
      const pick = (arr: string[]) => arr[randInt(0, arr.length - 1)];

      const library = [
        "MC Exterior Care // Premium Service // Quality Workmanship",
        "Pressure Washing • Gutter Cleaning • Window Cleaning",
        "Roof Treatment • Siding Restoration • Deck Sealing",
        "// Professional Equipment // Eco-Friendly Solutions",
        "// Long-term Protection // Stunning Results",
        "// Reliable • Insured • Guaranteed"
      ];

      let flow = library.join(" ");
      flow = flow.replace(/\s+/g, " ").trim();
      const totalChars = width * height;
      while (flow.length < totalChars + width) {
        flow += " " + pick(library).replace(/\s+/g, " ").trim();
      }

      let out = "";
      let offset = 0;
      for (let row = 0; row < height; row++) {
        let line = flow.slice(offset, offset + width);
        if (line.length < width) line = line + " ".repeat(width - line.length);
        out += line + (row < height - 1 ? "\n" : "");
        offset += width;
      }
      return out;
    };

    const calculateDimensions = () => {
      containerWidth = container.offsetWidth;
      const cardWidth = 400;
      const cardGap = 60;
      const cardCount = cardLine.children.length;
      cardLineWidth = (cardWidth + cardGap) * cardCount;
    };

    const updateCardClipping = () => {
      const scannerX = window.innerWidth / 2;
      const scannerWidth = 8;
      const scannerLeft = scannerX - scannerWidth / 2;
      const scannerRight = scannerX + scannerWidth / 2;
      let anyScanningActive = false;

      const wrappers = cardLine.querySelectorAll('.card-wrapper');
      wrappers.forEach((wrapper: any) => {
        const rect = wrapper.getBoundingClientRect();
        const cardLeft = rect.left;
        const cardRight = rect.right;
        const cardWidth = rect.width;

        const normalCard = wrapper.querySelector('.card-normal');
        const asciiCard = wrapper.querySelector('.card-ascii');

        if (cardLeft < scannerRight && cardRight > scannerLeft) {
          anyScanningActive = true;
          const scannerIntersectLeft = Math.max(scannerLeft - cardLeft, 0);
          const scannerIntersectRight = Math.min(scannerRight - cardLeft, cardWidth);

          const normalClipRight = (scannerIntersectLeft / cardWidth) * 100;
          const asciiClipLeft = (scannerIntersectRight / cardWidth) * 100;

          normalCard.style.setProperty('--clip-right', `${normalClipRight}%`);
          asciiCard.style.setProperty('--clip-left', `${asciiClipLeft}%`);

          if (!wrapper.hasAttribute('data-scanned') && scannerIntersectLeft > 0) {
            wrapper.setAttribute('data-scanned', 'true');
            const scanEffect = document.createElement('div');
            scanEffect.className = 'scan-effect';
            wrapper.appendChild(scanEffect);
            setTimeout(() => scanEffect.remove(), 600);
          }
        } else {
          if (cardRight < scannerLeft) {
            normalCard.style.setProperty('--clip-right', '100%');
            asciiCard.style.setProperty('--clip-left', '100%');
          } else if (cardLeft > scannerRight) {
            normalCard.style.setProperty('--clip-right', '0%');
            asciiCard.style.setProperty('--clip-left', '0%');
          }
          wrapper.removeAttribute('data-scanned');
        }
      });

      if (window.setScannerScanning) {
        window.setScannerScanning(anyScanningActive);
      }
    };

    const createCardWrapper = (index: number) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'card-wrapper';

      const normalCard = document.createElement('div');
      normalCard.className = 'card card-normal';

      const cardImages = [
        "/media/1.jpeg",
        "/media/2.jpeg",
        "/media/3.jpeg",
        "/media/4.jpeg",
      ];

      const cardImage = document.createElement('img');
      cardImage.className = 'card-image';
      cardImage.src = cardImages[index % cardImages.length];
      cardImage.alt = "Work Sample";
      cardImage.referrerPolicy = "no-referrer";

      normalCard.appendChild(cardImage);

      // Add Credit Card Elements
      const cardOverlay = document.createElement('div');
      cardOverlay.className = 'card-overlay';

      const logo = document.createElement('div');
      logo.className = 'card-logo';
      logo.textContent = 'X';
      cardOverlay.appendChild(logo);

      const name = document.createElement('div');
      name.className = 'card-name';
      name.textContent = 'Elon Musk';
      cardOverlay.appendChild(name);

      const chip = document.createElement('div');
      chip.className = 'card-chip';
      cardOverlay.appendChild(chip);

      const number = document.createElement('div');
      number.className = 'card-number';
      number.textContent = '1234 5678 9000 0001';
      cardOverlay.appendChild(number);

      const contactless = document.createElement('div');
      contactless.className = 'card-contactless';
      contactless.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 8a10 10 0 0 1 0 8M8 6a14 14 0 0 1 0 12M11 4a18 18 0 0 1 0 16" />
        </svg>
      `;
      cardOverlay.appendChild(contactless);

      const brand = document.createElement('div');
      brand.className = 'card-brand';
      brand.innerHTML = `
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
      `;
      cardOverlay.appendChild(brand);

      normalCard.appendChild(cardOverlay);

      const asciiCard = document.createElement('div');
      asciiCard.className = 'card card-ascii';

      const asciiContent = document.createElement('div');
      asciiContent.className = 'ascii-content';
      asciiContent.textContent = generateCode(66, 19);

      asciiCard.appendChild(asciiContent);
      wrapper.appendChild(normalCard);
      wrapper.appendChild(asciiCard);

      return wrapper;
    };

    const populateCardLine = () => {
      cardLine.innerHTML = '';
      for (let i = 0; i < 15; i++) {
        cardLine.appendChild(createCardWrapper(i));
      }
    };

    const updateCardPosition = () => {
      if (position < -cardLineWidth) {
        position = containerWidth;
      } else if (position > containerWidth) {
        position = -cardLineWidth;
      }
      cardLine.style.transform = `translateX(${position}px)`;
      updateCardClipping();
    };

    const animateCards = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (localIsAnimating && !isDragging) {
        if (velocity > minVelocity) {
          velocity *= friction;
        } else {
          velocity = Math.max(minVelocity, velocity);
        }

        position += velocity * direction * deltaTime;
        updateCardPosition();
        setSpeed(Math.round(velocity));
      }
      requestAnimationFrame(animateCards);
    };

    populateCardLine();
    calculateDimensions();
    requestAnimationFrame(animateCards);

    // --- Particle System (Three.js) ---
    const pScene = new THREE.Scene();
    const pCamera = new THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2, 125, -125, 1, 1000);
    pCamera.position.z = 100;

    const pRenderer = new THREE.WebGLRenderer({ canvas: particleCanvasRef.current, alpha: true, antialias: true });
    pRenderer.setSize(window.innerWidth, 250);
    pRenderer.setClearColor(0x000000, 0);

    const pCount = 200;
    const pGeometry = new THREE.BufferGeometry();
    const pPositions = new Float32Array(pCount * 3);
    const pAlphas = new Float32Array(pCount);
    const pVelocities = new Float32Array(pCount);

    for (let i = 0; i < pCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * window.innerWidth * 2;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 250;
      pPositions[i * 3 + 2] = 0;
      pAlphas[i] = Math.random();
      pVelocities[i] = Math.random() * 60 + 30;
    }

    pGeometry.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    pGeometry.setAttribute('alpha', new THREE.BufferAttribute(pAlphas, 1));

    const pMaterial = new THREE.ShaderMaterial({
      uniforms: { size: { value: 2.0 } },
      vertexShader: `
        attribute float alpha;
        varying float vAlpha;
        void main() {
          vAlpha = alpha;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 2.0;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        void main() {
          gl_FragColor = vec4(0.54, 0.17, 0.89, vAlpha * 0.5);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const pPoints = new THREE.Points(pGeometry, pMaterial);
    pScene.add(pPoints);

    const animateParticles = () => {
      const pos = pPoints.geometry.attributes.position.array as Float32Array;
      const alph = pPoints.geometry.attributes.alpha.array as Float32Array;
      for (let i = 0; i < pCount; i++) {
        pos[i * 3] += pVelocities[i] * 0.016;
        if (pos[i * 3] > window.innerWidth / 2 + 100) {
          pos[i * 3] = -window.innerWidth / 2 - 100;
        }
        if (Math.random() < 0.01) alph[i] = Math.random();
      }
      pPoints.geometry.attributes.position.needsUpdate = true;
      pPoints.geometry.attributes.alpha.needsUpdate = true;
      pRenderer.render(pScene, pCamera);
      requestAnimationFrame(animateParticles);
    };
    animateParticles();

    // --- Scanner Logic (Canvas 2D) ---
    const sCanvas = scannerCanvasRef.current;
    const sCtx = sCanvas.getContext('2d')!;
    let sScanningActive = false;

    (window as any).setScannerScanning = (active: boolean) => {
      sScanningActive = active;
    };

    const animateScanner = () => {
      sCtx.clearRect(0, 0, sCanvas.width, sCanvas.height);
      const x = sCanvas.width / 2;
      
      const gradient = sCtx.createLinearGradient(0, 0, 0, sCanvas.height);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(0.5, sScanningActive ? 'rgba(138, 43, 226, 0.8)' : 'rgba(255, 255, 255, 0.2)');
      gradient.addColorStop(1, 'transparent');

      sCtx.fillStyle = gradient;
      sCtx.fillRect(x - 2, 0, 4, sCanvas.height);

      if (sScanningActive) {
        sCtx.shadowBlur = 20;
        sCtx.shadowColor = 'rgba(138, 43, 226, 0.8)';
        sCtx.fillRect(x - 1, 0, 2, sCanvas.height);
        sCtx.shadowBlur = 0;
      }
      requestAnimationFrame(animateScanner);
    };
    animateScanner();

    // --- Controls ---
    const changeDir = () => {
      direction *= -1;
    };

    (window as any).changeDirection = changeDir;

    const handleResize = () => {
      calculateDimensions();
      pRenderer.setSize(window.innerWidth, 250);
      sCanvas.width = window.innerWidth;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      pRenderer.dispose();
    };
  }, []);

  return (
    <section className="card-scanner-section">
      <div className="headline-container">
        <h2 className="headline">
          Stop Burning Cash on <br />
          <span className="blue">Bad</span> 
          <span className="web-box">Contractors</span>
        </h2>
        <p className="description">
          We've seen it all: missed appointments, poor quality work, and hidden costs. 
          Our approach is different. We provide premium exterior care with a focus on 
          long-term protection and stunning results. Use the scanner below to see the 
          precision behind our service.
        </p>
      </div>

      <div className="container">
        <canvas id="particleCanvas" ref={particleCanvasRef}></canvas>
        <canvas id="scannerCanvas" ref={scannerCanvasRef} height={300}></canvas>

        <div className="scanner"></div>

        <div className="card-stream" id="cardStream" ref={cardStreamRef}>
          <div className="card-line" id="cardLine" ref={cardLineRef}></div>
        </div>
      </div>
    </section>
  );
};

export default CardScannerSection;
