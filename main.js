 // Navbar toggle
        const hamburger = document.getElementById("hamburger");
        const mobileMenu = document.getElementById("mobileMenu");
        const overlay = document.getElementById("overlay");
        hamburger.onclick = () => { hamburger.classList.toggle("active"); mobileMenu.classList.toggle("open"); overlay.classList.toggle("active"); };
        overlay.onclick = () => { hamburger.classList.remove("active"); mobileMenu.classList.remove("open"); overlay.classList.remove("active"); };

        // Robust chat + whatsapp + back-to-top behavior
document.addEventListener('DOMContentLoaded', () => {
  // --- helpers ---
  const q = selector => document.querySelector(selector);
  const exists = (el, name) => { if (!el) console.warn(`[chat.js] missing: ${name}`); return !!el; };
  const isVisible = el => !!el && getComputedStyle(el).display !== 'none';
  const showEl = (el, display = 'flex') => { if (!el) return; el.style.display = display; };
  const hideEl = el => { if (!el) return; el.style.display = 'none'; };
  const scrollToBottom = el => { if (!el) return; el.scrollTop = el.scrollHeight; };

  // --- find elements (robust: try multiple selectors) ---
  const backToTop = document.getElementById('backToTop') || q('.back-to-top') || q('#backBtn');
  const chatBtn = q('.chat-btn') || document.getElementById('chatbotBtn') || q('#chatBtn');
  const whatsappBtn = q('.whatsapp-btn') || document.getElementById('whatsappBtn') || q('#waBtn');

  const chatBox = document.getElementById('chatBox') || document.getElementById('chatWindow') || q('.chat-window');
  const whatsappBox = document.getElementById('whatsappBox') || document.getElementById('whatsappWindow') || q('.whatsapp-window') || q('.chat-window.whatsapp');

  // chat close buttons inside boxes (try several possibilities)
  const closeChat = document.getElementById('closeChat') || (chatBox && chatBox.querySelector('.chat-close')) || (chatBox && chatBox.querySelector('.close-btn'));
  const closeWhatsApp = document.getElementById('closeWhatsApp') || (whatsappBox && whatsappBox.querySelector('.chat-close')) || (whatsappBox && whatsappBox.querySelector('.close-btn'));

  // chat send/input elements
  const sendMsg = document.getElementById('sendMsg') || (chatBox && chatBox.querySelector('#sendBtn')) || (chatBox && chatBox.querySelector('button[type="submit"]')) || (chatBox && chatBox.querySelector('button'));
  const chatInput = document.getElementById('chatInput') || (chatBox && chatBox.querySelector('input[type="text"]'));
  const chatBody = document.getElementById('chatBody') || (chatBox && chatBox.querySelector('.chat-body'));

  // whatsapp send/input elements (robust)
  const whatsappSend = document.getElementById('whatsappSend') || (whatsappBox && whatsappBox.querySelector('#whatsappSend')) || (whatsappBox && whatsappBox.querySelector('button'));
  const whatsappInput = document.getElementById('whatsappInput') || (whatsappBox && whatsappBox.querySelector('input[type="text"]'));
  const whatsappBody = document.getElementById('whatsappBody') || (whatsappBox && whatsappBox.querySelector('.chat-body'));

  // --- basic checks (log helpful hints) ---
  exists(backToTop, 'backToTop button');
  exists(chatBtn, 'chat toggle button (.chat-btn or #chatbotBtn)');
  exists(whatsappBtn, 'whatsapp toggle button (.whatsapp-btn or #whatsappBtn)');
  exists(chatBox, 'chatBox element (#chatBox or .chat-window)');
  exists(whatsappBox, 'whatsappBox element (#whatsappBox or .whatsapp-window)');
  exists(sendMsg, 'chat send button (#sendMsg or inside chat box)');
  exists(chatInput, 'chat input (#chatInput or inside chat box)');
  exists(chatBody, 'chat body (#chatBody or .chat-body)');
  exists(whatsappSend, 'whatsapp send button (#whatsappSend or inside whatsapp box)');
  exists(whatsappInput, 'whatsapp input (#whatsappInput or inside whatsapp box)');
  exists(whatsappBody, 'whatsapp body (#whatsappBody or .chat-body inside whatsapp box)');

  // --- back to top ---
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // --- toggle helpers that auto-close the other box ---
  function toggleChatBox() {
    if (!chatBox) return;
    const willShow = !isVisible(chatBox);
    // close other
    if (whatsappBox && isVisible(whatsappBox)) hideEl(whatsappBox);
    // toggle this one
    if (willShow) showEl(chatBox, 'flex'); else hideEl(chatBox);
  }
  function toggleWhatsappBox() {
    if (!whatsappBox) return;
    const willShow = !isVisible(whatsappBox);
    // close other
    if (chatBox && isVisible(chatBox)) hideEl(chatBox);
    // toggle this one
    if (willShow) showEl(whatsappBox, 'flex'); else hideEl(whatsappBox);
  }

  // --- wire toggle buttons ---
  if (chatBtn) chatBtn.addEventListener('click', toggleChatBox);
  if (whatsappBtn) whatsappBtn.addEventListener('click', toggleWhatsappBox);

  // --- wire close buttons inside boxes ---
  if (closeChat) closeChat.addEventListener('click', () => hideEl(chatBox));
  if (closeWhatsApp) closeWhatsApp.addEventListener('click', () => hideEl(whatsappBox));

  // --- Chat send handler & Enter key ---
  if (sendMsg && chatInput && chatBody) {
    sendMsg.addEventListener('click', () => {
      const text = chatInput.value.trim();
      if (!text) return;
      // append user message
      const userP = document.createElement('p');
      userP.innerHTML = `<b>You:</b> ${escapeHtml(text)}`;
      chatBody.appendChild(userP);
      chatInput.value = '';
      scrollToBottom(chatBody);
      // bot reply (simple)
      setTimeout(() => {
        const botP = document.createElement('p');
        botP.innerHTML = `<b>Bot:</b> ${getBotReply(text)}`;
        chatBody.appendChild(botP);
        scrollToBottom(chatBody);
      }, 500);
    });

    chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMsg.click(); });
  }

  // --- WhatsApp send handler & Enter key ---
  if (whatsappSend && whatsappInput && whatsappBody) {
    whatsappSend.addEventListener('click', () => {
      const text = whatsappInput.value.trim();
      if (!text) return;
      const userP = document.createElement('p');
      userP.innerHTML = `<b>You:</b> ${escapeHtml(text)}`;
      whatsappBody.appendChild(userP);
      whatsappInput.value = '';
      scrollToBottom(whatsappBody);
      setTimeout(() => {
        const resp = document.createElement('p');
        resp.innerHTML = `<b>Agent:</b> Thanks! We'll get back to you shortly.`;
        whatsappBody.appendChild(resp);
        scrollToBottom(whatsappBody);
      }, 600);
    });

    whatsappInput.addEventListener('keydown', e => { if (e.key === 'Enter') whatsappSend.click(); });
  }

  // --- utility: basic bot replies (same as earlier) ---
  function getBotReply(msg) {
    const key = msg.trim().toLowerCase().split(' ')[0];
    const map = {
      hi: "Hello there! 👋 How can I assist you today?",
      hello: "Hi! 😊 Welcome to CONTROL PLUS.",
      website: "Our website showcases innovative IT solutions.",
      services: "We offer cloud computing, cybersecurity, AI, and app development.",
      contact: "You can reach us at info@controlplus.com or +1 234 567 890.",
      quote: "We'll prepare a quote based on your project requirements.",
      help: "Commands: hi, website, services, contact, quote, help."
    };
    return map[key] || "Sorry, I didn’t get that. Type 'help' to see available commands.";
  }

  // --- small HTML escape to avoid accidental HTML injection in appended text ---
  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (s) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  }
});


// Main Service Section
  
    document.addEventListener("DOMContentLoaded", () => {
      const counters = document.querySelectorAll(".counter");
      const animateCounter = (counter) => {
        const target = +counter.getAttribute("data-target");
        const duration = 2000;
        const startTime = performance.now();

        const update = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          counter.innerText = Math.floor(progress * target);
          if (progress < 1) requestAnimationFrame(update);
          else counter.innerText = target;
        };
        requestAnimationFrame(update);
      };

      const section = document.querySelector(".stats-cta");
      const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          counters.forEach(animateCounter);
          observer.disconnect();
        }
      }, { threshold: 0.3 });

      observer.observe(section);
    });



    // Main About (abouth) Section

    const revealEls = document.querySelectorAll('.abouth-text, .abouth-image, .abouth-card');
    const revealOnScroll = () => {
      revealEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }
      });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();



    

// Main Project section

     (function(){
      const root = document;
      const filterBtns = Array.from(root.querySelectorAll('.filter-btn'));
      const grid = root.getElementById('projectsGrid');
      const items = Array.from(root.querySelectorAll('.proj-card'));
      const countEl = root.getElementById('projCount');

      // animate counters for visible items
      function setCount(n){
        let start = 0;
        const dur = 450;
        const step = Math.max(1, Math.round(n / (dur / 15)));
        const iv = setInterval(()=>{
          start += step;
          if(start >= n){ start = n; clearInterval(iv); }
          countEl.textContent = start;
        }, 15);
      }

      // initial count
      setCount(items.length);

      function applyFilter(filter){
        const f = filter.trim().toLowerCase();
        let visible = 0;
        items.forEach((it, idx)=>{
          const cats = it.getAttribute('data-category') || '';
          const matches = (f === 'all') || cats.split(/\s+/).indexOf(f) !== -1;
          if(matches){
            // show
            it.classList.remove('hidden');
            // trigger appear animation with small stagger
            const inner = it.querySelector('.appear');
            if(inner){ inner.style.animationDelay = (idx * 30) + 'ms'; }
            visible++;
          } else {
            // hide
            it.classList.add('hidden');
          }
        });
        setCount(visible);
      }

      // wire buttons
      filterBtns.forEach(btn=>{
        btn.addEventListener('click', ()=>{
          filterBtns.forEach(b=>{ b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
          btn.classList.add('active');
          btn.setAttribute('aria-pressed','true');
          const filter = btn.dataset.filter || 'all';
          applyFilter(filter);
        });

        // keyboard: Enter & Space works
        btn.addEventListener('keydown', (e)=>{
          if(e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            btn.click();
          }
        });
      });

      // Accessibility: allow focusing cards and toggling details with Enter
      items.forEach(card=>{
        card.addEventListener('keydown', (e)=>{
          if(e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            // toggle a class so back appears for keyboard users
            const inner = card.querySelector('.proj-inner .back');
            if(inner){
              const visible = inner.style.visibility === 'visible';
              if(visible){
                inner.style.visibility = ''; inner.style.opacity = ''; inner.style.transform = '';
              } else {
                inner.style.visibility = 'visible';
                inner.style.opacity = '1';
                inner.style.transform = 'rotateY(0deg)';
              }
            }
          }
        });
      });

      // initial show all
      applyFilter('all');
    })();