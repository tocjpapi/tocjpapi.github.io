const lenis = new Lenis({
  duration: 1,
  direction: 'vertical',
  gestureDirection: 'vertical',
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  smoothTouch: false,
  touchMultiplier: 1,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

let isDragging = false;
let startY = 0;
let startScrollY = 0;
let targetScrollY = 0;
let lastScrollY = 0;
let velocity = 0;
let isAnimating = false;
const friction = 0;
const dragSensitivity = 1.2;

function clampScroll(scrollY) {
  const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
  return Math.max(0, Math.min(scrollY, maxScrollY));
}

document.addEventListener('mousedown', (event) => {
  // Only listen to left mouse button (button 0)
  if (event.button !== 0) return;
  
  isDragging = true;
  startY = event.clientY;
  startScrollY = lenis.scroll;
  lastScrollY = startScrollY;
  
  // Add class to indicate active dragging
  document.body.classList.add('is-actively-dragging');
});

document.addEventListener('mousemove', (event) => {
  if (isDragging) {
    const deltaY = (event.clientY - startY) * dragSensitivity;
    targetScrollY = clampScroll(startScrollY - deltaY);
    if (!isAnimating) {
      animateScroll();
    }
  }
});

document.addEventListener('mouseup', () => {
  if (!isDragging) return;
  
  isDragging = false;
  // Remove active dragging class immediately
  document.body.classList.remove('is-actively-dragging');

  if (Math.abs(velocity) > 0.1) {
    applyInertia();
  }
});

// Prevent link clicks ONLY during active mouse dragging
document.addEventListener('click', (event) => {
  if (isDragging && event.target.closest('a')) {
    event.preventDefault();
    event.stopPropagation();
  }
}, true); // Use capture phase for better reliability

document.addEventListener('selectstart', (event) => {
  if (isDragging) {
    event.preventDefault();
  }
});

document.addEventListener('contextmenu', (event) => {
  // Reset dragging state if context menu appears
  if (isDragging) {
    isDragging = false;
    document.body.classList.remove('is-actively-dragging');
  }
});

// Rest of your existing code (keydown, animateScroll, applyInertia, etc.) remains the same
document.addEventListener('keydown', (event) => {
  const scrollAmount = 200; 
  if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
    targetScrollY = clampScroll(lenis.scroll - scrollAmount);
    animateScroll();
  } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
    targetScrollY = clampScroll(lenis.scroll + scrollAmount);
    animateScroll();       
  } else if (event.key === ' ') {
    event.preventDefault(); 
    targetScrollY = clampScroll(lenis.scroll + window.innerHeight);
    animateScroll();
  }
});

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function animateScroll() {
  isAnimating = true;
  const currentScrollY = lenis.scroll;
  const distance = targetScrollY - currentScrollY;
  const easing = easeOutCubic(Math.min(1, Math.abs(distance) / 100));
  const newScrollY = currentScrollY + distance * easing;
  lenis.scrollTo(newScrollY);

  if (Math.abs(targetScrollY - newScrollY) > 0.5) {
    requestAnimationFrame(animateScroll);
  } else {
    isAnimating = false;
  }
}

function applyInertia() {
  const inertia = (targetScrollY - lastScrollY) * 0.3;
  function inertiaScroll() {
    velocity *= friction;
    const newScrollY = clampScroll(lenis.scroll + velocity);
    if (Math.abs(velocity) > 0.1 && newScrollY !== 0 && newScrollY !== document.documentElement.scrollHeight - window.innerHeight) {
      lenis.scroll = newScrollY;
      requestAnimationFrame(inertiaScroll);
    }
  }
  velocity = inertia;
  inertiaScroll();
}

document.querySelectorAll(".scroll-to-top").forEach(button => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    lenis.scrollTo(0);
  });
});

document.addEventListener('DOMContentLoaded', function() {
  if (typeof lenis !== 'undefined' && lenis) {
    const mapLinks = document.querySelectorAll('.map-link');
    
    if (mapLinks.length > 0) {
      mapLinks.forEach(link => {
        link.addEventListener('click', function(e) {
          // Only prevent if actively dragging
          if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          
          e.preventDefault();
          const targetId = this.getAttribute('data-target');
          if (!targetId) return;
          
          const targetElement = document.querySelector(targetId);
          if (!targetElement) return;
          
          try {
            const offset = 50;
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - offset;
            
            if (typeof lenis.scrollTo === 'function') {
              lenis.scrollTo(targetPosition);
            }
          } catch (error) {
            console.error('Lenis scroll error:', error);
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
    }
  } else {
    document.querySelectorAll('.map-link').forEach(link => {
      link.addEventListener('click', function(e) {
        // Only prevent if actively dragging
        if (isDragging) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        
        e.preventDefault();
        const targetId = this.getAttribute('data-target');
        if (targetId) {
          const target = document.querySelector(targetId);
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
});





// end of lenis

// default stuff

document.querySelectorAll('a').forEach(link => {
    link.setAttribute('draggable', 'false');
  });


  document.querySelectorAll('img').forEach(img => {
    img.setAttribute('draggable', 'false');
  });


  document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'CANVAS' || e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  });


  //index-html-parallax

gsap.registerPlugin(ScrollTrigger);

// Check if '.first' exists before animating
const firstElement = document.querySelector(".first");
if (firstElement) {
  gsap.to(firstElement, {
    yPercent: 300,
    ease: "none",
    scrollTrigger: {
      trigger: firstElement,
      start: "bottom bottom",
      end: "+=10000",
      scrub: true,
    },
  });
}


const turnDarkElement = document.querySelector(".turn-dark");
if (turnDarkElement) {
  gsap.to(turnDarkElement, {
    opacity: 0.4,
    ease: "none",
    scrollTrigger: {
      trigger: firstElement || ".first",
      start: "bottom bottom",
      end: "bottom top",
      scrub: true,
    },
  });
}


//index-html-parallax img

gsap.registerPlugin(ScrollTrigger);

const parallaxyElements = document.querySelectorAll('.parallaxy');
if (parallaxyElements.length > 0) {
  parallaxyElements.forEach((img) => {
    const imgChild = img.querySelector("img");
    if (imgChild) {
      gsap.to(imgChild, {
        yPercent: 190,
        ease: "none",
        scrollTrigger: {
          trigger: img,
          start: "top bottom",
          end: "+=10000",
          scrub: true,
        },
      });
    }
  });
}



  // next-page-hover animation

  const topic = document.querySelector('.u-n-topic');
  const framer = document.querySelector('.up-next-framer');
  const inner = document.querySelector('.up-next-inner');
  
  if (topic && framer && inner) {
      topic.addEventListener('mouseenter', () => {
          framer.style.opacity = '1';
          inner.style.scale = '1';
          framer.style.scale = '1';
      });
  
      topic.addEventListener('mouseleave', () => {
          framer.style.opacity = '0';
          inner.style.scale = '1.15';
          framer.style.scale = '0.9';
      });
  }
  

  // web-gl-canvas-animation
        const dpr = Math.max(window.devicePixelRatio || 1, 2);
        let targetMousePos = [0, 0];
        let currentMousePos = [0, 0];
        let rippleActive = false;
        let rippleIntensity = 0;
        let rippleTime = 0;
        let exitAnimationProgress = 0;
        let exitStartPos = [0, 0];
        let rippleDecaySpeed = 0.03; 
    
        function debounce(func, wait) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        }
    
        function resizeCanvas(cvs3d, ctx3d, img, tex) {
            const newWidth = cvs3d.clientWidth * dpr;
            const newHeight = cvs3d.clientHeight * dpr;
    
            if (cvs3d.width !== newWidth || cvs3d.height !== newHeight) {
                cvs3d.width = newWidth;
                cvs3d.height = newHeight;
                ctx3d.viewport(0, 0, cvs3d.width, cvs3d.height);
                drawImage(ctx3d, img, cvs3d.width, cvs3d.height, tex);
            }
        }
    
        function drawImage(ctx3d, img, canvasWidth, canvasHeight, tex) {
            if (!img.complete) return;
    
            const imgAspectRatio = img.width / img.height;
            const canvasAspectRatio = canvasWidth / canvasHeight;
    
            let scaleX, scaleY, offsetX, offsetY;
    
            if (canvasAspectRatio > imgAspectRatio) {
                scaleX = 1;
                scaleY = imgAspectRatio / canvasAspectRatio;
                offsetX = 0;
                offsetY = (1 - scaleY) / 2;
            } else {
                scaleX = canvasAspectRatio / imgAspectRatio;
                scaleY = 1;
                offsetX = (1 - scaleX) / 2;
                offsetY = 0;
            }
    
            const texCoords = new Float32Array([
                offsetX, offsetY,
                offsetX, offsetY + scaleY,
                offsetX + scaleX, offsetY + scaleY,
                offsetX + scaleX, offsetY
            ]);
    
            ctx3d.bindBuffer(ctx3d.ARRAY_BUFFER, ctx3d.createBuffer());
            ctx3d.bufferData(ctx3d.ARRAY_BUFFER, new Float32Array([
                -1, 1,  -1, -1,  1, -1,  1, 1
            ]), ctx3d.STATIC_DRAW);
            ctx3d.vertexAttribPointer(ctx3d.getAttribLocation(ctx3d.program, "aVertex"), 2, ctx3d.FLOAT, false, 0, 0);
            ctx3d.enableVertexAttribArray(ctx3d.getAttribLocation(ctx3d.program, "aVertex"));
    
            ctx3d.bindBuffer(ctx3d.ARRAY_BUFFER, ctx3d.createBuffer());
            ctx3d.bufferData(ctx3d.ARRAY_BUFFER, texCoords, ctx3d.STATIC_DRAW);
            ctx3d.vertexAttribPointer(ctx3d.getAttribLocation(ctx3d.program, "aUV"), 2, ctx3d.FLOAT, false, 0, 0);
            ctx3d.enableVertexAttribArray(ctx3d.getAttribLocation(ctx3d.program, "aUV"));
    
            ctx3d.uniform2f(ctx3d.getUniformLocation(ctx3d.program, "uResolution"), canvasWidth, canvasHeight);
            ctx3d.uniform2f(ctx3d.getUniformLocation(ctx3d.program, "uMouse"), currentMousePos[0], currentMousePos[1]);
            ctx3d.uniform2f(ctx3d.getUniformLocation(ctx3d.program, "uExitStart"), exitStartPos[0], exitStartPos[1]);
            ctx3d.uniform1f(ctx3d.getUniformLocation(ctx3d.program, "uTime"), rippleTime);
            ctx3d.uniform1f(ctx3d.getUniformLocation(ctx3d.program, "uIntensity"), rippleIntensity);
            ctx3d.uniform1f(ctx3d.getUniformLocation(ctx3d.program, "uExitProgress"), exitAnimationProgress);
    
            ctx3d.clear(ctx3d.COLOR_BUFFER_BIT);
            ctx3d.bindTexture(ctx3d.TEXTURE_2D, tex);
            ctx3d.drawArrays(ctx3d.TRIANGLE_FAN, 0, 4);
        }
    
        function createShader(ctx3d, type, source) {
            const shader = ctx3d.createShader(type);
            ctx3d.shaderSource(shader, source);
            ctx3d.compileShader(shader);
            return shader;
        }
    
        function initializeCanvas(cvs3d) {
            const ctx3d = cvs3d.getContext('webgl', { preserveDrawingBuffer: true });
            const img = new Image();
            img.src = cvs3d.getAttribute('data-img');
    
            const vertexShaderSrc = `
                attribute vec2 aVertex;
                attribute vec2 aUV;
                varying vec2 vTex;
                void main(void) {
                    gl_Position = vec4(aVertex, 0.0, 1.0);
                    vTex = aUV;
                }
            `;
            const fragmentShaderSrc = `
                precision highp float;
                varying vec2 vTex;
                uniform sampler2D sampler0;
                uniform vec2 uResolution;
                uniform vec2 uMouse;
                uniform vec2 uExitStart;
                uniform float uTime;
                uniform float uIntensity;
                uniform float uExitProgress;
                
                void main(void) {
                    vec2 uv = vTex;
                    vec4 color = texture2D(sampler0, uv);
                    
                    if (uIntensity > 0.0 || uExitProgress > 0.0) {
                        vec2 effectCenter = mix(uMouse, uExitStart, uExitProgress);
                        float effectIntensity = uIntensity * (1.0 - uExitProgress); // Combine both factors
                        
                        vec2 mousePos = effectCenter / uResolution;
                        float dist = distance(uv, mousePos);
                        
                        float scaleProgress = effectIntensity;
                        float baseRadius = 0.3;
                        float currentRadius = baseRadius * scaleProgress;
                        float edgeSmoothness = 0.05;
                        
                        if (uExitProgress < 1.0) {
                            float ripple = sin(dist * 2000.0 - uTime * 1.0) * 0.015 * exp(-dist * 4.0);
                            uv += ripple * effectIntensity;
                            color = texture2D(sampler0, uv);
                        }
                        
                        // Smooth circle edge with fixed smoothness regardless of scale
                        float circle = smoothstep(currentRadius + edgeSmoothness, currentRadius - edgeSmoothness, dist);
                        
                        if (circle > 0.0) {
                            vec3 inverted = vec3(1.0) - color.rgb;
                            color.rgb = mix(color.rgb, inverted, circle * effectIntensity);
                        }
                        
                        if (uExitProgress < 1.0) {
                            vec2 dir = normalize(uv - mousePos);
                            float caStrength = smoothstep(0.0, 0.2, exp(-dist * 6.0)) * 0.002 * effectIntensity;
                            color.r = texture2D(sampler0, uv + dir * caStrength * 1.2).r;
                            color.b = texture2D(sampler0, uv - dir * caStrength * 0.8).b;
                        }
                        
                        float contrast = 1.0 + 0.2 * smoothstep(0.0, 0.3, exp(-dist * 6.0)) * effectIntensity;
                        color.rgb = (color.rgb - 0.5) * contrast + 0.5;
                    }
                    
                    gl_FragColor = color;
                }
            `;
    
            const vertShader = createShader(ctx3d, ctx3d.VERTEX_SHADER, vertexShaderSrc);
            const fragShader = createShader(ctx3d, ctx3d.FRAGMENT_SHADER, fragmentShaderSrc);
    
            const program = ctx3d.createProgram();
            ctx3d.attachShader(program, vertShader);
            ctx3d.attachShader(program, fragShader);
            ctx3d.linkProgram(program);
            ctx3d.useProgram(program);
            ctx3d.program = program;
    
            const tex = ctx3d.createTexture();
            ctx3d.bindTexture(ctx3d.TEXTURE_2D, tex);
            ctx3d.texParameteri(ctx3d.TEXTURE_2D, ctx3d.TEXTURE_WRAP_S, ctx3d.CLAMP_TO_EDGE);
            ctx3d.texParameteri(ctx3d.TEXTURE_2D, ctx3d.TEXTURE_WRAP_T, ctx3d.CLAMP_TO_EDGE);
            ctx3d.texParameteri(ctx3d.TEXTURE_2D, ctx3d.TEXTURE_MIN_FILTER, ctx3d.LINEAR);
            ctx3d.texParameteri(ctx3d.TEXTURE_2D, ctx3d.TEXTURE_MAG_FILTER, ctx3d.LINEAR);
            
            img.onload = () => {
                ctx3d.texImage2D(ctx3d.TEXTURE_2D, 0, ctx3d.RGBA, ctx3d.RGBA, ctx3d.UNSIGNED_BYTE, img);
                resizeCanvas(cvs3d, ctx3d, img, tex);
                
                function animate() {
                    currentMousePos[0] += (targetMousePos[0] - currentMousePos[0]) * 0.08;
                    currentMousePos[1] += (targetMousePos[1] - currentMousePos[1]) * 0.08;
                    
                    rippleTime += 0.016;
                    
                    if (rippleActive) {
                        rippleIntensity = Math.min(rippleIntensity + 0.1, 1.0);
                        exitAnimationProgress = 0.0;
                    } else if (rippleIntensity > 0) {
                        // Smoothly reduce ripple intensity when mouse leaves
                        rippleIntensity = Math.max(rippleIntensity - rippleDecaySpeed, 0);
                        
                        // Only start exit animation when ripple is almost gone
                        if (rippleIntensity < 0.1) {
                            exitAnimationProgress = Math.min(exitAnimationProgress + 0.04, 1.0);
                            if (exitAnimationProgress >= 1.0) {
                                rippleIntensity = 0;
                                exitAnimationProgress = 0;
                            }
                        }
                    }
                    
                    drawImage(ctx3d, img, cvs3d.width, cvs3d.height, tex);
                    requestAnimationFrame(animate);
                }
                animate();
            };
    
            cvs3d.addEventListener('mousemove', (e) => {
                const rect = cvs3d.getBoundingClientRect();
                targetMousePos = [
                    (e.clientX - rect.left) * dpr,
                    (e.clientY - rect.top) * dpr
                ];
                rippleActive = true;
            });
    
            cvs3d.addEventListener('mouseleave', (e) => {
                const rect = cvs3d.getBoundingClientRect();
                exitStartPos = [
                    (e.clientX - rect.left) * dpr,
                    (e.clientY - rect.top) * dpr
                ];
                rippleActive = false;
            });
    
            const debouncedResize = debounce(() => {
                requestAnimationFrame(() => resizeCanvas(cvs3d, ctx3d, img, tex));
            }, 250);
            window.addEventListener('resize', debouncedResize);
    
            const observer = new ResizeObserver(entries => {
                for (let entry of entries) {
                    if (entry.target === cvs3d) {
                        requestAnimationFrame(() => resizeCanvas(entry.target, ctx3d, img, tex));
                    }
                }
            });
            observer.observe(cvs3d);
        }
    
        document.querySelectorAll('.cvs').forEach(cvs => {
          if (cvs) {
              initializeCanvas(cvs);
          }
      });


      // about page

      document.addEventListener('DOMContentLoaded', function() {
        // Check if elements exist before proceeding
        const sections = document.querySelectorAll('[id]');
        const navLinks = document.querySelectorAll('.map-link .stroke');
        const mapLinks = document.querySelectorAll('.map-link');
    
        // Only run if required elements exist
        if (sections.length > 0 && navLinks.length > 0 && mapLinks.length >= 3) {
            
            function activateStroke() {
                let currentSection = '';
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    const offski = 200;
                    
                    if (window.scrollY >= (sectionTop - sectionHeight / 3 - offski)) {
                        currentSection = section.id;
                    }
                });
                
                navLinks.forEach(link => {
                    link.classList.remove('active-stroke');
                });
                
                if (currentSection) {
                    const activeLink = document.querySelector(`.map-link[data-section="${currentSection}"] .stroke`);
                    if (activeLink) {
                        activeLink.classList.add('active-stroke');
                    }
                }
            }
            
            // Safely set data-section attributes
            mapLinks[0]?.setAttribute('data-section', 'summary');
            mapLinks[1]?.setAttribute('data-section', 'principles');
            mapLinks[2]?.setAttribute('data-section', 'experience');
    
            // Initialize and set scroll listener
            activateStroke();
            window.addEventListener('scroll', activateStroke);
        } else {
            console.warn("Missing required elements for navigation highlighting");
        }
    });


//safari-respond

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || 
                 /iPhone|iPad|iPod/i.test(navigator.userAgent);

if (isSafari) {
  document.documentElement.classList.add('is-safari');
}


