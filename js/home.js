// Карусель активності громади. Реальні пости з групи "Ukrainians in
// Waterloo—Wellington" на Facebook (фото завантажені локально, бо fbcdn-лінки
// підписані й протухають). Оновлювати вручну, коли з'являються нові пости.

const ACTIVITY_POSTS = [
  {
    kind: "event",
    url: "https://facebook.com/events/s/ukrainian-picnic-2026/1528321775242523/",
    text: "🌻 Запрошуємо на Ukrainian Picnic 2026! Приєднуйтесь до щорічного українського пікніка.",
    date: "Подія",
  },
  {
    kind: "photo",
    url: "https://www.facebook.com/groups/ukrainian.waterloo.wellington/posts/3573550152799606/",
    image: "assets/activity/post1-katespade.jpg",
    text: "💗 Запрошуємо українську громаду Кітченера на подію Kate Spade Sip, Shop & See — неділя, 30 серпня, 13:30–17:00 в Urban Optical.",
    date: "Ukrainians in Waterloo—Wellington",
  },
  {
    kind: "photo",
    url: "https://www.facebook.com/groups/ukrainian.waterloo.wellington/posts/3573323336155621/",
    image: "assets/activity/post2-sweetatelier.jpg",
    text: "✨ Ольга Горова, Sweet Atelier by Olga Horova — з 3 вересня приймає замовлення тортів у Kitchener–Waterloo.",
    date: "Ukrainians in Waterloo—Wellington",
  },
  {
    kind: "shot",
    url: "https://www.facebook.com/groups/ukrainian.waterloo.wellington/posts/3573497332804888/",
    image: "assets/activity/post3-cleaning-help.png",
  },
  {
    kind: "shot",
    url: "https://www.facebook.com/groups/ukrainian.waterloo.wellington/posts/3573194432835178/",
    image: "assets/activity/post4-cleaner-wanted.png",
  },
];

const track = document.getElementById("activity-track");
const carousel = document.getElementById("activity-carousel");

function emptyStateCard() {
  const card = document.createElement("div");
  card.className = "activity-card activity-card-empty";
  card.innerHTML = `
    <p class="activity-empty-title">Стрічка активності скоро тут</p>
    <p>
      Останні події та фото з нашої Facebook-групи зʼявляться тут, щойно
      підключимо посилання на групу.
    </p>
  `;
  return card;
}

function renderActivity() {
  track.innerHTML = "";
  if (ACTIVITY_POSTS.length === 0) {
    track.appendChild(emptyStateCard());
    carousel.querySelector(".carousel-controls").hidden = true;
    return;
  }

  ACTIVITY_POSTS.slice(0, 5).forEach((post) => {
    const card = document.createElement("a");
    card.className =
      post.kind === "shot" ? "activity-card activity-card-shot" : "activity-card";
    card.href = post.url;
    card.target = "_blank";
    card.rel = "noopener";
    card.innerHTML =
      post.kind === "shot"
        ? `<img src="${post.image}" alt="Скріншот допису у Facebook-групі громади" loading="lazy" />`
        : `
      ${post.image ? `<img src="${post.image}" alt="" loading="lazy" />` : ''}
      <p class="activity-card-text">${post.text}</p>
      <p class="activity-card-date">${post.date}</p>
    `;
    track.appendChild(card);
  });
}

function bindCarouselControls() {
  carousel.querySelectorAll(".carousel-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dir = Number(btn.dataset.dir);
      track.scrollBy({ left: dir * track.clientWidth * 0.9, behavior: "smooth" });
    });
  });
}

renderActivity();
bindCarouselControls();

// Animations on scroll
function initScrollAnimations() {
  const elementsToAnimate = document.querySelectorAll("section");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 }
  );

  elementsToAnimate.forEach((el) => {
    el.classList.add("animate-on-scroll");
    observer.observe(el);
  });
}

initScrollAnimations();
