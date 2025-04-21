const lenis = new Lenis();

lenis.on("scroll", (e) => {
  console.log(e);
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

let magnets = document.querySelectorAll(".magnetic-area");
let strength = 75;

magnets.forEach((magnet) => {
  magnet.addEventListener("mousemove", moveMagnet);
  magnet.addEventListener("mouseout", function (event) {
    TweenMax.to(event.currentTarget, 1, { x: 0, y: 0, ease: Power4.easeOut });
  });
});

function moveMagnet(event) {
  let magnetButton = event.currentTarget;
  let bounding = magnetButton.getBoundingClientRect();

  TweenMax.to(magnetButton, 1, {
    x:
      ((event.clientX - bounding.left) / magnetButton.offsetWidth - 0.5) *
      strength,
    y:
      ((event.clientY - bounding.top) / magnetButton.offsetHeight - 0.5) *
      strength,
    ease: Power4.easeOut,
  });
}


function animateH2OnScroll() {
  const h2Elements = document.querySelectorAll("h2");

  h2Elements.forEach((h2) => {
    gsap.fromTo(
      h2,
      {
        x: "100%", // Starte außerhalb des rechten Bildschirmrands
        opacity: 0,
      },
      {
        x: "0%", // Ende an der ursprünglichen Position
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: h2,
          start: "top 90%", // Animation startet, wenn der obere Rand des Elements 90% des Viewports erreicht
          end: "bottom 20%", // Animation endet, wenn der untere Rand des Elements 20% des Viewports erreicht
          toggleActions: "play none none reverse", // Aktionen beim Erreichen und Verlassen des Triggerbereichs
          markers: false, // Zum Debuggen kannst du hier "true" setzen, um die Triggerpunkte zu sehen
        },
      }
    );
  });
}

document.addEventListener("DOMContentLoaded", () => {
  animateH2OnScroll();
});


document.addEventListener("DOMContentLoaded", () => {
  // Navigation laden
  fetch("/components/nav.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("nav-placeholder").innerHTML = data;

      const currentPath = window.location.pathname;
      document.querySelectorAll(".menu-item a").forEach(link => {
        const linkHref = link.getAttribute("href");

       
        if (
          linkHref === currentPath ||                           
          linkHref === currentPath.replace(/^\/+/, "") ||      
          "/" + linkHref === currentPath                        
        ) {
          link.parentElement.id = "active";
        }
      });

      // Menü-Animation initialisieren
      initMenuAnimation();
    });

  // Footer laden
  fetch("/components/footer.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("footer-placeholder").innerHTML = data;
    });
});



function initMenuAnimation() {
  let activeItemIndicator = CSSRulePlugin.getRule(".menu-item p#active a::after");
  const toggleButton = document.querySelector(".burger");
  let isOpen = false;

  gsap.set(".menu-item p", { y: 225 });

  const timeline = gsap.timeline({ paused: true });

  timeline.to(".overlay", {
    duration: 1.5,
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    ease: "power4.inOut"
  });

  timeline.to(".menu-item p", {
    duration: 1.5,
    y: 0,
    stagger: 0.2,
    ease: "power4.out"
  }, "-=1");

  timeline.to(activeItemIndicator, {
    width: "100%",
    duration: 1,
    ease: "power4.out",
    delay: 0.5
  }, "<");

  timeline.to(".sub-nav", {
    bottom: "10%",
    opacity: 1,
    duration: 0.5,
    delay: 0.5
  }, "<");

  toggleButton.addEventListener("click", function () {
    if (isOpen) {
      timeline.reverse();
    } else {
      timeline.play();
    }
    isOpen = !isOpen;
  });
}
