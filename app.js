// App State & Data
let currentPage = 1;
let mediaList = [
  {
    id: 1,
    title: "Golden Hour memorable Walk",
    date: "A Day I realise...I can't live without you",
    type: "photo",
    src: "sunset.jpg"
  },
  {
    id: 2,
    title: "Laughing Over luch together",
    date: "Pure passion over you",
    type: "photo",
    src: "stargazing.jpg"
  },
  {
    id: 3,
    title: "Under the person I loved the most",
    date: "Time",
    type: "photo",
    src: "cafe.jpg"
  },
  {
    id: 4,
    title: "Our Unforgettable Moments",
    date: "Every Second With You",
    type: "video",
    src: "VID_20240503_212542_368.mp4"
  }
];

// Load saved custom memories from localStorage if present
const savedMedia = localStorage.getItem("apology_custom_media");
if (savedMedia) {
  try {
    const parsed = JSON.parse(savedMedia);
    if (Array.isArray(parsed) && parsed.length > 0) {
      mediaList = [...parsed, ...mediaList];
    }
  } catch (e) {
    console.error("Error loading custom media", e);
  }
}

// -------------------------------------------------------------
// 1. PAGE NAVIGATION LOGIC
// -------------------------------------------------------------
function switchPage(pageNumber) {
  if (pageNumber < 1 || pageNumber > 4) return;

  const currentEl = document.getElementById(`page-${currentPage}`);
  const nextEl = document.getElementById(`page-${pageNumber}`);

  if (currentEl) {
    currentEl.classList.remove("active");
  }

  currentPage = pageNumber;

  setTimeout(() => {
    if (nextEl) {
      nextEl.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, 100);

  // Update navbar step indicators
  document.querySelectorAll(".nav-dot-btn").forEach((btn) => {
    const btnPage = parseInt(btn.getAttribute("data-page"));
    if (btnPage === currentPage) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

// Add click listeners to navigation buttons
document.querySelectorAll(".nav-dot-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetPage = parseInt(btn.getAttribute("data-page"));
    switchPage(targetPage);
  });
});

// -------------------------------------------------------------
// 2. CANVAS FLOATING ROSE PETALS & HEARTS ENGINE
// -------------------------------------------------------------
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

let particles = [];
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class PetalHeartParticle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * 100;
    this.size = Math.random() * 12 + 8;
    this.speedY = Math.random() * 1.2 + 0.5;
    this.speedX = Math.random() * 0.8 - 0.4;
    this.opacity = Math.random() * 0.5 + 0.3;
    this.rotation = Math.random() * 360;
    this.rotSpeed = (Math.random() - 0.5) * 1.5;
    this.isHeart = Math.random() > 0.4; // 60% hearts, 40% petals
  }

  update() {
    this.y -= this.speedY;
    this.x += Math.sin(this.y * 0.01) + this.speedX;
    this.rotation += this.rotSpeed;

    if (this.y < -30) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = this.opacity;

    if (this.isHeart) {
      // Draw glowing heart
      ctx.fillStyle = "#ff4d79";
      ctx.beginPath();
      const d = this.size;
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-d / 2, -d / 2, -d, d / 3, 0, d);
      ctx.bezierCurveTo(d, d / 3, d / 2, -d / 2, 0, 0);
      ctx.fill();
    } else {
      // Draw rose petal
      ctx.fillStyle = "#ff85a2";
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size / 2, this.size, Math.PI / 4, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.restore();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(Math.floor(window.innerWidth / 25), 45);
  for (let i = 0; i < count; i++) {
    particles.push(new PetalHeartParticle());
  }
}
initParticles();

function animateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateCanvas);
}
animateCanvas();

// -------------------------------------------------------------
// 3. BACKGROUND MUSIC: SLANDER - LOVE IS GONE (ACOUSTIC)
// -------------------------------------------------------------
let isAudioPlaying = false;

function toggleAudio() {
  if (!isAudioPlaying) {
    playMusic();
  } else {
    pauseMusic();
  }
}

function playMusic() {
  const localAudio = document.getElementById("localBgAudio");
  const ytFrame = document.getElementById("ytMusicFrame");

  // Attempt playing local MP3 file if present in assets/
  let localPlayed = false;
  if (localAudio && localAudio.currentSrc) {
    const playPromise = localAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          localPlayed = true;
          isAudioPlaying = true;
          updateAudioUI(true);
        })
        .catch(() => {
          // If local audio cannot play, stream official Acoustic version via YouTube
          startYouTubeStream(ytFrame);
        });
      return;
    }
  }

  if (!localPlayed) {
    startYouTubeStream(ytFrame);
  }
}

function startYouTubeStream(ytFrame) {
  if (!ytFrame) ytFrame = document.getElementById("ytMusicFrame");
  if (ytFrame) {
    const streamUrl = "https://www.youtube.com/embed/hCrtcVDgCGw?autoplay=1&enablejsapi=1&loop=1&playlist=hCrtcVDgCGw";
    if (!ytFrame.src || ytFrame.src === "" || ytFrame.src === "about:blank") {
      ytFrame.src = streamUrl;
    } else {
      try {
        ytFrame.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      } catch (e) {
        ytFrame.src = streamUrl;
      }
    }
  }
  isAudioPlaying = true;
  updateAudioUI(true);
}

function pauseMusic() {
  const localAudio = document.getElementById("localBgAudio");
  const ytFrame = document.getElementById("ytMusicFrame");

  if (localAudio && !localAudio.paused) {
    try {
      localAudio.pause();
    } catch (e) { }
  }

  if (ytFrame) {
    try {
      ytFrame.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    } catch (e) { }
    ytFrame.src = "";
  }

  isAudioPlaying = false;
  updateAudioUI(false);
}

function updateAudioUI(playing) {
  const btnText = document.getElementById("audioText");
  const btnIcon = document.getElementById("audioIcon");
  const btn = document.getElementById("audioBtn");

  if (playing) {
    if (btnText) btnText.textContent = "Love Is Gone \u266A";
    if (btnIcon) btnIcon.textContent = "\uD83D\uDD0A";
    if (btn) btn.classList.add("playing");
  } else {
    if (btnText) btnText.textContent = "Play Music";
    if (btnIcon) btnIcon.textContent = "\uD83C\uDFB5";
    if (btn) btn.classList.remove("playing");
  }
}

const audioToggleBtn = document.getElementById("audioBtn");
if (audioToggleBtn) {
  audioToggleBtn.addEventListener("click", toggleAudio);
}

// -------------------------------------------------------------
// 4. MEMORY GALLERY & LIGHTBOX LOGIC
// -------------------------------------------------------------
function renderGallery() {
  const container = document.getElementById("mediaGrid");
  if (!container) return;

  container.innerHTML = mediaList.map((item) => {
    if (item.type === "video") {
      return `
        <div class="media-item" onclick="openLightbox(${item.id})">
          <span class="badge-video">▶ Video</span>
          <video src="${item.src}" muted preload="metadata"></video>
          <div class="media-overlay">
            <div class="media-title">${escapeHtml(item.title)}</div>
            <div class="media-date">${escapeHtml(item.date)}</div>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="media-item" onclick="openLightbox(${item.id})">
          <img src="${item.src}" alt="${escapeHtml(item.title)}" loading="lazy" />
          <div class="media-overlay">
            <div class="media-title">${escapeHtml(item.title)}</div>
            <div class="media-date">${escapeHtml(item.date)}</div>
          </div>
        </div>
      `;
    }
  }).join("");
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
  });
}

function openLightbox(id) {
  const item = mediaList.find((m) => m.id === id);
  if (!item) return;

  const container = document.getElementById("lightboxContainer");
  const caption = document.getElementById("lightboxCaption");
  const modal = document.getElementById("lightboxModal");

  caption.textContent = `${item.title} — ${item.date}`;

  if (item.type === "video") {
    container.innerHTML = `<video src="${item.src}" controls autoplay style="max-width:100%; max-height:75vh;"></video>`;
  } else {
    container.innerHTML = `<img src="${item.src}" alt="${escapeHtml(item.title)}" style="max-width:100%; max-height:75vh; object-fit:contain;" />`;
  }

  modal.classList.add("active");
}

function closeLightbox() {
  const modal = document.getElementById("lightboxModal");
  const container = document.getElementById("lightboxContainer");
  modal.classList.remove("active");
  container.innerHTML = "";
}

// -------------------------------------------------------------
// 5. CUSTOM MEDIA UPLOADER MODAL
// -------------------------------------------------------------
function openUploadModal() {
  document.getElementById("uploadModal").classList.add("active");
}

function closeUploadModal() {
  document.getElementById("uploadModal").classList.remove("active");
}

function toggleMediaTypeInput() {
  const type = document.getElementById("mediaType").value;
  const fileInput = document.getElementById("mediaFileInput");
  if (type === "video") {
    fileInput.accept = "video/*";
  } else {
    fileInput.accept = "image/*";
  }
}

function handleMediaUpload(event) {
  event.preventDefault();
  const title = document.getElementById("mediaTitle").value.trim();
  const date = document.getElementById("mediaDate").value.trim() || "Cherished Moment";
  const type = document.getElementById("mediaType").value;
  const fileInput = document.getElementById("mediaFileInput");
  const urlInput = document.getElementById("mediaUrlInput").value.trim();

  let mediaSrc = urlInput;

  if (fileInput.files && fileInput.files[0]) {
    const file = fileInput.files[0];
    mediaSrc = URL.createObjectURL(file);
  }

  if (!mediaSrc) {
    alert("Please select a file or provide a valid media URL!");
    return;
  }

  const newMedia = {
    id: Date.now(),
    title,
    date,
    type,
    src: mediaSrc
  };

  mediaList.unshift(newMedia);
  renderGallery();

  // Try saving to localstorage if URL string
  if (urlInput) {
    const customOnly = mediaList.filter((m) => typeof m.id === "number" && m.id > 100);
    localStorage.setItem("apology_custom_media", JSON.stringify(customOnly));
  }

  closeUploadModal();
  document.getElementById("uploadForm").reset();
}

// -------------------------------------------------------------
// 6. FORGIVENESS & TALK MODAL CELEBRATION
// -------------------------------------------------------------
function triggerForgiveness() {
  // Launch heart & confetti explosion
  createHeartBurst();

  // Play gentle happy chord sound
  try {
    const chimeCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = chimeCtx.createOscillator();
    const gain = chimeCtx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(523.25, chimeCtx.currentTime);
    gain.gain.setValueAtTime(0.1, chimeCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, chimeCtx.currentTime + 1.5);
    osc.connect(gain);
    gain.connect(chimeCtx.destination);
    osc.start();
    osc.stop(chimeCtx.currentTime + 1.5);
  } catch (e) { }

  document.getElementById("celebrationModal").classList.add("active");
}

function createHeartBurst() {
  for (let i = 0; i < 35; i++) {
    const p = new PetalHeartParticle();
    p.x = canvas.width / 2 + (Math.random() * 200 - 100);
    p.y = canvas.height / 2 + (Math.random() * 200 - 100);
    p.speedY = Math.random() * 4 + 2;
    p.opacity = 1;
    particles.push(p);
  }
}

function closeCelebrationModal() {
  document.getElementById("celebrationModal").classList.remove("active");
}

function openTalkModal() {
  document.getElementById("talkModal").classList.add("active");
}

function closeTalkModal() {
  document.getElementById("talkModal").classList.remove("active");
}

function openWhatsApp() {
  window.open(
    "https://wa.me/919020954455?text=I%20saw%20your%20apology%20website...%20let's%20talk.",
    "_blank"
  );
}
// Initialize Gallery on Load
document.addEventListener("DOMContentLoaded", () => {
  renderGallery();
});
renderGallery();
