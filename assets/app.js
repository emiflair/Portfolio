/* UI Enhancements: scroll reveal, parallax, active nav highlighting, lazy video, reduced motion safety */
(function(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------- Scroll Reveal -------- */
  const revealEls = [].slice.call(document.querySelectorAll('.reveal'));
  const animEls = [].slice.call(document.querySelectorAll('[data-anim]'));
  if(!prefersReduced && 'IntersectionObserver' in window){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.classList.add('visible');
          e.target.classList.add('anim-in');
          const delay = e.target.getAttribute('data-anim-delay');
          if(delay){ e.target.style.transitionDelay = delay; }
          io.unobserve(e.target);
        }
      });
    }, {threshold:.2});
    [...revealEls, ...animEls].forEach(el=>io.observe(el));
  } else {
    [...revealEls, ...animEls].forEach(el=>{el.classList.add('visible');el.classList.add('anim-in');});
  }

  /* -------- Active Nav Highlight -------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  const navMap = {};
  navLinks.forEach(l=>{const h=l.getAttribute('href');if(h && h.startsWith('#')) navMap[h.slice(1)]=l;});
  let ticking=false;
  function onScroll(){
    if(ticking) return; ticking=true; requestAnimationFrame(()=>{ticking=false; updateActive();});
  }
  function updateActive(){
    let currentId=null; const scrollPos = window.scrollY + 120; // offset for sticky header
    sections.forEach(sec=>{
      const rect = sec.getBoundingClientRect();
      const top = rect.top + window.scrollY; const bottom = top + rect.height;
      if(scrollPos >= top && scrollPos < bottom) currentId = sec.id;
    });
    navLinks.forEach(l=>l.classList.remove('active'));
    if(currentId && navMap[currentId]) navMap[currentId].classList.add('active');
  }
  document.addEventListener('scroll', onScroll, {passive:true});
  // Immediate active feedback on click
  navLinks.forEach(l=>{
    l.addEventListener('click', ()=>{
      navLinks.forEach(n=>n.classList.remove('active'));
      l.classList.add('active');
    });
  });
  updateActive();

  /* -------- Parallax Hero -------- */
  const hero = document.querySelector('.hero');
  const heroVisual = document.querySelector('.hero-visual');
  if(hero && heroVisual && !prefersReduced){
    hero.setAttribute('data-parallax','');
    window.addEventListener('scroll', ()=>{
      const y = window.scrollY * 0.15; // parallax factor
      heroVisual.style.transform = `translateY(${y}px)`;
    }, {passive:true});
  }

  /* -------- Lazy Video Autoplay Fallback (ensure plays when visible) -------- */
  const vids = document.querySelectorAll('.work video');
  if('IntersectionObserver' in window){
    const vio = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          if(e.target.paused) {e.target.play().catch(()=>{});} // ignore failures
        } else {
          if(!e.target.paused) e.target.pause();
        }
      });
    }, {threshold:.25});
    vids.forEach(v=>vio.observe(v));
  }

  /* -------- Keyboard focus outline helper for nav -------- */
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Tab') document.documentElement.classList.add('user-tabbing');
  });
})();
