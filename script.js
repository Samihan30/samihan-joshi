document.addEventListener("DOMContentLoaded", () => {
    // Current year
    document.getElementById("year").textContent = new Date().getFullYear();

    // Mobile navigation
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("open");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
            document.body.classList.toggle("menu-open", isOpen);
        });
    }

    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks?.classList.remove("open");
            menuToggle?.setAttribute("aria-expanded", "false");
            document.body.classList.remove("menu-open");
        });
    });

    // Reveal animations
    const revealItems = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealItems.forEach(item => revealObserver.observe(item));
    } else {
        revealItems.forEach(item => item.classList.add("visible"));
    }

    // Project filters
    const filters = document.querySelectorAll(".filter");
    const projects = document.querySelectorAll(".project-card");

    filters.forEach(filter => {
        filter.addEventListener("click", () => {
            filters.forEach(btn => btn.classList.remove("active"));
            filter.classList.add("active");

            const selected = filter.dataset.filter;

            projects.forEach(project => {
                const matches = selected === "all" || project.dataset.category === selected;
                project.classList.toggle("hidden", !matches);
            });
        });
    });

    // Project videos: play on hover, pause + reset on leave
    document.querySelectorAll(".project-video").forEach(video => {
        const card = video.closest(".project-card");
        if (!card) return;

        card.addEventListener("mouseenter", () => {
            video.play().catch(() => {});
        });

        card.addEventListener("mouseleave", () => {
            video.pause();
            try { video.currentTime = 0; } catch (_) {}
        });
    });

    // Project modal
    const modal = document.getElementById("projectModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalType = document.getElementById("modalType");
    const modalVisual = document.querySelector(".modal-visual");
    const modalVideo = document.querySelector(".modal-video");

    const closeModal = () => {
        if (!modal || !modalVideo || !modalVisual) return;

        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("menu-open");
        modalVideo.pause();
        modalVideo.removeAttribute("src");
        modalVideo.load();
        modalVisual.classList.remove("has-video");
    };

    document.querySelectorAll(".view-project, .project-play").forEach(button => {
        button.addEventListener("click", () => {
            if (!modal || !modalVideo || !modalVisual) return;

            const card = button.closest(".project-card");
            if (!card) return;

            modalTitle.textContent = card.dataset.title || "";
            modalType.textContent = card.dataset.type || "";

            const videoSrc = card.dataset.video;
            if (videoSrc && videoSrc !== "put your video here") {
                modalVideo.src = videoSrc;
                modalVisual.classList.add("has-video");
                modal.classList.add("open");
                modal.setAttribute("aria-hidden", "false");
                modalVideo.load();
                modalVideo.play().catch(() => {});
            } else {
                modalVisual.classList.remove("has-video");
                modal.classList.add("open");
                modal.setAttribute("aria-hidden", "false");
            }
        });
    });

    document.querySelector(".modal-close")?.addEventListener("click", closeModal);
    document.querySelector(".modal-backdrop")?.addEventListener("click", closeModal);

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeModal();
    });

    document.querySelector(".modal-contact")?.addEventListener("click", closeModal);

    // Showreel
    const showreelVideo = document.getElementById("showreelVideo");
    const videoFrame = document.querySelector(".video-frame");
    const showreelPlayButton = document.getElementById("showreelPlayButton");

    if (showreelVideo && videoFrame) {
        showreelVideo.addEventListener("loadedmetadata", () => {
            videoFrame.classList.add("has-video");
            videoFrame.classList.remove("video-error");
        });

        showreelVideo.addEventListener("error", () => {
            videoFrame.classList.remove("has-video");
            videoFrame.classList.add("video-error");
        });

        if (showreelVideo.readyState >= 1) {
            videoFrame.classList.add("has-video");
        }

        if (showreelPlayButton) {
            showreelPlayButton.addEventListener("click", () => {
                showreelVideo.play().catch(() => {});
            });

            showreelVideo.addEventListener("play", () => {
                showreelPlayButton.classList.add("hidden");
            });

            showreelVideo.addEventListener("pause", () => {
                showreelPlayButton.classList.remove("hidden");
            });
        }
    }

    // Hero video play button. The button hides after the user starts the video.
    // Double-clicking the video opens it in fullscreen without changing the card design.
    const heroVideo = document.getElementById("heroVideo");
    const heroPlayButton = document.getElementById("heroPlayButton");

    if (heroVideo && heroPlayButton) {
        heroPlayButton.addEventListener("click", () => {
            if (heroVideo.paused) {
                heroVideo.muted = false;
                heroVideo.volume = 1;
                heroVideo.play().then(() => {
                    heroPlayButton.classList.add("hidden");
                }).catch(() => {
                    heroVideo.muted = true;
                    heroVideo.play().then(() => {
                        heroPlayButton.classList.add("hidden");
                    }).catch(() => {});
                });
            } else {
                heroVideo.pause();
                heroPlayButton.classList.remove("hidden");
            }
        });

        // If the playing video is clicked, pause it and bring the play button back.
        heroVideo.addEventListener("click", () => {
            if (!heroVideo.paused) {
                heroVideo.pause();
                heroPlayButton.classList.remove("hidden");
            }
        });

        // Fullscreen is available without adding another button to the original design.
        heroVideo.addEventListener("dblclick", async () => {
            try {
                if (document.fullscreenElement) {
                    await document.exitFullscreen();
                } else if (heroVideo.requestFullscreen) {
                    await heroVideo.requestFullscreen();
                } else if (heroVideo.webkitEnterFullscreen) {
                    heroVideo.webkitEnterFullscreen();
                }
            } catch (_) {}
        });
    }

    // Custom cursor for desktop
    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");

    if (window.matchMedia("(pointer: fine)").matches && dot && ring) {
        let mouseX = 0;
        let mouseY = 0;
        let ringX = 0;
        let ringY = 0;

        window.addEventListener("mousemove", event => {
            mouseX = event.clientX;
            mouseY = event.clientY;
            dot.style.left = `${mouseX}px`;
            dot.style.top = `${mouseY}px`;
        });

        const animateCursor = () => {
            ringX += (mouseX - ringX) * 0.16;
            ringY += (mouseY - ringY) * 0.16;
            ring.style.left = `${ringX}px`;
            ring.style.top = `${ringY}px`;
            requestAnimationFrame(animateCursor);
        };

        animateCursor();

        document.querySelectorAll("a, button, .project-media").forEach(element => {
            element.addEventListener("mouseenter", () => ring.classList.add("hover"));
            element.addEventListener("mouseleave", () => ring.classList.remove("hover"));
        });
    }
});
