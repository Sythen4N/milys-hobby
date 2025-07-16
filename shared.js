document.addEventListener('DOMContentLoaded', function() {
 function initLoadingScreen() {
  const loadingScreen = document.getElementById('loadingScreen');
  const mainContent = document.getElementById('mainContent');
  const mTrigger = document.getElementById('mTrigger');
  const loadingBar = document.getElementById('loadingBar');
  const loadingPercent = document.getElementById('loadingPercent');
  if (sessionStorage.getItem('loadingComplete')) {
    if (loadingScreen) loadingScreen.style.display = 'none';
    if (mainContent) {
      mainContent.style.display = 'block';
      mainContent.style.opacity = '1';
    }
    return;
  }

  if (loadingScreen && mainContent) {
    let isCounting = false;
    mainContent.style.display = 'none';

    function startLoading() {
      if (isCounting || !mTrigger) return;
      isCounting = true;
      
      mTrigger.style.transform = 'scale(1.2)';
      
      let percent = 0;
      const interval = setInterval(() => {
        percent += 1;
        if (loadingBar) loadingBar.style.width = percent + '%';
        if (loadingPercent) loadingPercent.textContent = percent + '%';
        
        if (percent >= 100) {
          clearInterval(interval);
          finishLoading();
        }
      }, 30);
    }

    function finishLoading() {
      sessionStorage.setItem('loadingComplete', 'true');
      loadingScreen.style.opacity = '0';
      
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        mainContent.style.display = 'block';
        void mainContent.offsetWidth;
        mainContent.style.opacity = '1';
      }, 800);
    }

    if (mTrigger) mTrigger.addEventListener('click', startLoading);
    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'm') startLoading();
    });

    if (window.location.pathname.endsWith('index.html') || 
        window.location.pathname.endsWith('/')) {
      setTimeout(startLoading, 10000);
    }
  }
}
  function initCarousel() {
    const items = document.querySelectorAll('.carousel-item');
    if (items.length === 0) return;

    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    let currentIndex = 0;
    const totalItems = items.length;
    let isAnimating = false;

    function initCarousel() {
      items.forEach((item, index) => {
        item.classList.remove('active', 'left', 'right', 'hidden');
        
        if (index === currentIndex) {
          item.classList.add('active');
        } else if (index === (currentIndex - 1 + totalItems) % totalItems) {
          item.classList.add('left');
        } else if (index === (currentIndex + 1) % totalItems) {
          item.classList.add('right');
        } else {
          item.classList.add('hidden');
        }
      });
      updateDots();
    }

    function updateCarousel() {
      if (isAnimating) return;
      isAnimating = true;
      
      items.forEach(item => {
        item.classList.remove('active', 'left', 'right', 'hidden');
      });
      
      items[currentIndex].classList.add('active');
      items[(currentIndex - 1 + totalItems) % totalItems].classList.add('left');
      items[(currentIndex + 1) % totalItems].classList.add('right');
      
      items.forEach((item, index) => {
        if (!item.classList.contains('active') && 
            !item.classList.contains('left') && 
            !item.classList.contains('right')) {
          item.classList.add('hidden');
        }
      });
      
      updateDots();
      
      setTimeout(() => {
        isAnimating = false;
      }, 800);
    }

    function updateDots() {
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }

    function moveToIndex(newIndex) {
      currentIndex = (newIndex + totalItems) % totalItems;
      updateCarousel();
    }

    if (prevBtn) prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      moveToIndex(currentIndex - 1);
    });

    if (nextBtn) nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      moveToIndex(currentIndex + 1);
    });

    dots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        const index = parseInt(dot.getAttribute('data-index'));
        if (index !== currentIndex) {
          moveToIndex(index);
        }
      });
    });

    initCarousel();
  }
  function initCommonEffects() {
    // Bubble Effect
    const bubble = document.getElementById('bubble');
    if (bubble) {
      let mouseX = window.innerWidth / 2;
      let mouseY = window.innerHeight / 2;
      let currentX = mouseX;
      let currentY = mouseY;
      
      document.addEventListener('mousemove', (e) => {
        mouseX = e.pageX;
        mouseY = e.pageY;
      });
      
      function animateBubble() {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;
        bubble.style.left = `${currentX}px`;
        bubble.style.top = `${currentY}px`;
        requestAnimationFrame(animateBubble);
      }
      
      animateBubble();
    }
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      const header = document.querySelector('.sticky-header');
      
      if (header) {
        if (currentScroll > 0) {
          header.classList.add('scrolled');
        } else if (currentScroll === 0) {
          header.classList.remove('scrolled');
        }
      }
      
      lastScroll = currentScroll;
    }, {passive: true});
    
    // Update Current Year
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
    const stats = document.querySelectorAll('.stat');
    if (stats.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-pop');
          }
        });
      }, { threshold: 0.5 });
      
      stats.forEach(stat => observer.observe(stat));
    }
  }
  function initNavigation() {
    // Home link handler
    const homeLink = document.querySelector('li#HOME a');
    if (homeLink) {
      homeLink.addEventListener('click', function(e) {
        const currentPage = window.location.pathname;
        const targetPage = this.getAttribute('href');
        
        if (currentPage.endsWith(targetPage)) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          // When navigating to home from another page
          sessionStorage.setItem('loadingComplete', 'true');
        }
      });
    }
    const aboutLink = document.querySelector('li#ABOUT ME a');
    if (aboutLink) {
      aboutLink.addEventListener('click', function(e) {
        const currentPage = window.location.pathname;
        const targetPage = this.getAttribute('href');
        
        if (currentPage.endsWith(targetPage)) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }
  }
  function initVideoHover() {
    const highlightBoxes = document.querySelectorAll('.highlight-box');
    
    highlightBoxes.forEach(box => {
      const video = box.querySelector('.game-clip');
      if (!video) return;
      
      box.addEventListener('mouseenter', () => {
        video.play().catch(e => console.log("Video play failed:", e));
      });
      
      box.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
      });
    });
  }
  function initFormEffects() {
    const form = document.querySelector('.cyber-form');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = document.querySelector('.transmit-btn');
        if (!btn) return;
        
        btn.innerHTML = '<i class="fas fa-check"></i> TRANSMISSION SENT';
        btn.classList.add('success');
        setTimeout(() => {
          btn.innerHTML = '<i class="fas fa-paper-plane"></i> TRANSMIT';
          btn.classList.remove('success');
        }, 2000);
      });
    }
  }
  function initImageGallery() {
    const mainImage = document.querySelector('.main-image img');
    const thumbnails = document.querySelectorAll('.thumbnail img');
    if (!mainImage || thumbnails.length === 0) return;

    let currentIndex = 0;
    let autoRotateInterval;
    const imageSources = Array.from(thumbnails).map(thumb => thumb.src);
    
    if (!imageSources.includes(mainImage.src)) {
      imageSources.unshift(mainImage.src);
    }

    function changeMainImage(newSrc, index) {
      mainImage.style.opacity = 0;
      
      setTimeout(() => {
        mainImage.src = newSrc;
        mainImage.style.opacity = 1;
        currentIndex = index;
        
        thumbnails.forEach(thumb => thumb.parentElement.classList.remove('active'));
        if (index > 0) {
          thumbnails[index - 1].parentElement.classList.add('active');
        }
      }, 300);
    }

    thumbnails.forEach((thumb, index) => {
      thumb.parentElement.addEventListener('click', function() {
        changeMainImage(thumb.src, index + 1);
        resetAutoRotate();
      });
    });

    function autoRotate() {
      currentIndex = (currentIndex + 1) % imageSources.length;
      changeMainImage(imageSources[currentIndex], currentIndex);
    }

    function startAutoRotate() {
      autoRotateInterval = setInterval(autoRotate, 5000);
    }

    function resetAutoRotate() {
      clearInterval(autoRotateInterval);
      startAutoRotate();
    }

    thumbnails.forEach((thumb, index) => {
      if (thumb.src === mainImage.src) {
        thumb.parentElement.classList.add('active');
        currentIndex = index + 1;
      }
    });

    startAutoRotate();
  }
  initLoadingScreen();
  initCarousel();
  initCommonEffects();
  initNavigation();
  initVideoHover();
  initFormEffects();
  initImageGallery();
});