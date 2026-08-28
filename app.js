/**
 * Personal AI Agent & Automation Builder - Interactive Site Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroNodeCanvas();
  initExampleBuildModals();
  initContactForm();
  initMobileNav();
  initEmailCopy();
  initScrollSpy();
  initScrollReveal();
});

/* ==========================================================================
   1. Hero Interactive Workflow Node Animation Canvas
   ========================================================================== */
function initHeroNodeCanvas() {
  const canvasContainer = document.getElementById('diagramCanvas');
  if (!canvasContainer) return;

  let isPlaying = true;
  let animFrameId = null;

  // Node definitions with coordinates in SVG 1060x500 viewport space
  const nodes = [
    {
      id: 'node-lead',
      title: '1. Lead Capture',
      sub: 'Inbound Webform / API',
      x: 80,
      y: 220,
      w: 180,
      h: 75,
      type: 'trigger',
      iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
      payload: {
        event: 'lead.created',
        source: 'Website Contact Form',
        data: { name: 'Alex Johnson', company: 'Apex Logistics', email: 'alex@apexlogistics.io', intent: 'High' }
      }
    },
    {
      id: 'node-ai',
      title: '2. AI Qualifier Agent',
      sub: 'LLM Logic & Guardrails',
      x: 330,
      y: 220,
      w: 190,
      h: 75,
      type: 'agent',
      iconPath: 'M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z',
      payload: {
        agent: 'Qualifier-v2',
        status: 'QUALIFIED',
        score: 94,
        matchCriteria: ['Budget > $5k', 'Immediate Need', 'Decision Maker'],
        action: 'trigger_booking'
      }
    },
    {
      id: 'node-calendar',
      title: '3. Calendar Booker',
      sub: 'Voice / Cal.com API',
      x: 590,
      y: 220,
      w: 180,
      h: 75,
      type: 'action',
      iconPath: 'M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z',
      payload: {
        service: 'Voice Phone Screener',
        meetingSlot: 'Thursday @ 2:30 PM EST',
        confirmationSent: true,
        calendarEventId: 'evt_983172'
      }
    },
    {
      id: 'node-crm',
      title: '4. CRM Sync',
      sub: 'HubSpot / PostgreSQL',
      x: 840,
      y: 220,
      w: 150,
      h: 75,
      type: 'destination',
      iconPath: 'M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4m0 5c0 2.21 3.58 4 8 4s8-1.79 8-4',
      payload: {
        crmStatus: 'Deal Created',
        pipelineStage: 'Qualified - Discovery Call',
        owner: 'Automated Agent',
        timestamp: new Date().toISOString()
      }
    }
  ];

  // SVG element generation
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 1060 500');
  svg.setAttribute('class', 'flow-svg');

  // Defs for Glow Filter
  const defs = document.createElementNS(svgNS, 'defs');
  defs.innerHTML = `
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  `;
  svg.appendChild(defs);

  // Connection Paths
  const paths = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 3 }
  ];

  const pathElements = [];

  paths.forEach((p, idx) => {
    const startNode = nodes[p.from];
    const endNode = nodes[p.to];

    const x1 = startNode.x + startNode.w;
    const y1 = startNode.y + startNode.h / 2;
    const x2 = endNode.x;
    const y2 = endNode.y + endNode.h / 2;

    const dx = (x2 - x1) / 2;
    const pathD = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

    // Base background line
    const bgLine = document.createElementNS(svgNS, 'path');
    bgLine.setAttribute('d', pathD);
    bgLine.setAttribute('class', 'flow-path');
    svg.appendChild(bgLine);

    // Active glowing line
    const activeLine = document.createElementNS(svgNS, 'path');
    activeLine.setAttribute('d', pathD);
    activeLine.setAttribute('class', 'flow-path-active');
    svg.appendChild(activeLine);

    // Pulse dot element
    const pulseDot = document.createElementNS(svgNS, 'circle');
    pulseDot.setAttribute('r', '6');
    pulseDot.setAttribute('class', 'flow-pulse-dot');
    svg.appendChild(pulseDot);

    pathElements.push({
      pathD,
      activeLine,
      pulseDot,
      length: activeLine.getTotalLength(),
      progress: idx * 0.33
    });
  });

  // Render Nodes
  nodes.forEach((node) => {
    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('class', 'node-group');
    g.setAttribute('id', node.id);
    g.setAttribute('tabindex', '0');
    g.setAttribute('role', 'button');
    g.setAttribute('aria-label', `View node telemetry for ${node.title}`);

    // Node Box
    const rect = document.createElementNS(svgNS, 'rect');
    rect.setAttribute('x', node.x);
    rect.setAttribute('y', node.y);
    rect.setAttribute('width', node.w);
    rect.setAttribute('height', node.h);
    rect.setAttribute('class', 'node-rect');
    g.appendChild(rect);

    // Icon Circle Background
    const iconBg = document.createElementNS(svgNS, 'circle');
    iconBg.setAttribute('cx', node.x + 28);
    iconBg.setAttribute('cy', node.y + node.h / 2);
    iconBg.setAttribute('r', '16');
    iconBg.setAttribute('fill', 'rgba(0, 242, 254, 0.1)');
    iconBg.setAttribute('stroke', 'rgba(0, 242, 254, 0.3)');
    g.appendChild(iconBg);

    // Node Title Text
    const titleText = document.createElementNS(svgNS, 'text');
    titleText.setAttribute('x', node.x + 54);
    titleText.setAttribute('y', node.y + 34);
    titleText.setAttribute('class', 'node-title');
    titleText.textContent = node.title;
    g.appendChild(titleText);

    // Node Subtitle Text
    const subText = document.createElementNS(svgNS, 'text');
    subText.setAttribute('x', node.x + 54);
    subText.setAttribute('y', node.y + 52);
    subText.setAttribute('class', 'node-subtitle');
    subText.textContent = node.sub;
    g.appendChild(subText);

    // Click & Keyboard listener for live payload display
    const showPayload = () => displayNodePayload(node);
    g.addEventListener('click', showPayload);
    g.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showPayload();
      }
    });

    svg.appendChild(g);
  });

  canvasContainer.appendChild(svg);

  // Animation Loop for Pulses
  let startTime = performance.now();
  function animate(currentTime) {
    if (!isPlaying) return;

    const delta = (currentTime - startTime) * 0.0004;

    pathElements.forEach((p) => {
      p.progress = (p.progress + delta) % 1;
      const point = p.activeLine.getPointAtLength(p.progress * p.length);
      p.pulseDot.setAttribute('cx', point.x);
      p.pulseDot.setAttribute('cy', point.y);
    });

    startTime = currentTime;
    animFrameId = requestAnimationFrame(animate);
  }

  animFrameId = requestAnimationFrame(animate);

  // Sim Button Controller
  const toggleBtn = document.getElementById('toggleSimBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      toggleBtn.textContent = isPlaying ? 'Pause Simulation' : 'Play Simulation';
      if (isPlaying) {
        startTime = performance.now();
        animFrameId = requestAnimationFrame(animate);
      } else if (animFrameId) {
        cancelAnimationFrame(animFrameId);
      }
    });
  }
}

function displayNodePayload(node) {
  const telemetryDisplay = document.getElementById('nodeTelemetryOutput');
  if (telemetryDisplay) {
    telemetryDisplay.textContent = `// TELEMETRY SNAPSHOT [${node.title}]\n` + JSON.stringify(node.payload, null, 2);
  }
}

/* ==========================================================================
   2. Example Builds Architectural Drawer / Modal
   ========================================================================== */
const buildSpecs = {
  'lead-gen': {
    title: 'Lead Qualification & CRM Router Spec',
    tech: ['n8n', 'OpenAI GPT-4o', 'HubSpot API', 'Slack Webhooks'],
    spec: `[SYSTEM ARCHITECTURE SPECIFICATION]
Trigger: Inbound Webhook (Typeform / Webflow / Custom Form)
├── Node 1: Webhook Payload Parser & Sanitizer
├── Node 2: OpenAI Lead Scorer & Intent Classifier
│   ├── Prompt: "Evaluate lead intent, budget range, and urgency."
│   └── Output: JSON { intentScore: 94, budgetStatus: 'qualified' }
├── Node 3: Router Branch
│   ├── IF Qualified: Update HubSpot CRM + Dispatch Instant Calendar SMS
│   └── IF Unqualified: Log to Nurture Email Sequence
└── Node 4: Slack Real-time Alert Notification`
  },
  'call-agent': {
    title: 'Voice AI Appointment Screener & Booker Spec',
    tech: ['Vapi.ai', 'Cal.com API', 'n8n', 'Twilio'],
    spec: `[SYSTEM ARCHITECTURE SPECIFICATION]
Trigger: Inbound Call / Form Callback Request
├── Node 1: Voice AI Telephony Initialization (Vapi)
│   ├── Persona: Conversational Assistant
│   ├── Screening Protocol: Qualify project scope & budget
│   └── Tool Calling: Query Live Cal.com Available Slots
├── Node 2: Real-time Slot Reservation
├── Node 3: Call Transcript & Sentiment Analysis
│   └── Model: Summarizes call transcript into structured key takeaways
└── Node 4: Calendar Invitation Dispatch + CRM Record Sync`
  },
  'workflow-sync': {
    title: 'Omnichannel Ops & Onboarding Sync Spec',
    tech: ['n8n Cloud', 'Stripe Webhooks', 'Google Workspace', 'Notion API'],
    spec: `[SYSTEM ARCHITECTURE SPECIFICATION]
Trigger: Stripe Customer Checkout Completed
├── Node 1: Stripe Event Signature Verification
├── Node 2: Database / Workspace Record Provisioning (Notion / Postgres)
├── Node 3: Automated Client Onboarding Kit Generation
│   ├── Creates Shared Google Drive Folder Structure
│   ├── Generates Client Access Portal Link
│   └── Sends Welcome Email via Resend / Postmark API
└── Node 4: Operations Channel Notification with Client Summary`
  }
};

function initExampleBuildModals() {
  const modalOverlay = document.getElementById('specModalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalSpecBlock = document.getElementById('modalSpecBlock');
  const closeModalBtn = document.getElementById('closeModalBtn');

  if (!modalOverlay) return;

  document.querySelectorAll('[data-build-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const buildId = btn.getAttribute('data-build-id');
      const data = buildSpecs[buildId];
      if (data) {
        modalTitle.textContent = data.title;
        modalSpecBlock.textContent = data.spec;
        modalOverlay.classList.add('active');
        modalOverlay.setAttribute('aria-hidden', 'false');
      }
    });
  });

  const closeModal = () => {
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
  };

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   3. Accessible Contact Form Handler
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('agencyContactForm');
  if (!contactForm) return;
}

/* ==========================================================================
   4. Mobile Navigation Menu Toggle
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('mobile-open');
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close menu when clicking links
  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('mobile-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   5. Email Copy-to-Clipboard
   ========================================================================== */
function initEmailCopy() {
  const copyBtn = document.getElementById('copyEmailBtn');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const emailText = document.getElementById('agencyEmailText').textContent.trim();
    navigator.clipboard.writeText(emailText).then(() => {
      const originalHtml = copyBtn.innerHTML;
      copyBtn.innerHTML = '✓ Copied!';
      setTimeout(() => {
        copyBtn.innerHTML = originalHtml;
      }, 2000);
    }).catch(() => {
      alert(`Email address: ${emailText}`);
    });
  });
}

/* ==========================================================================
   6. ScrollSpy Active Link Highlight
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   7. Scroll Reveal Animation Trigger (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => observer.observe(el));
}
