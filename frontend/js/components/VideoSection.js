import Base from "../core/Base";

export class VideoSection extends Base {
  constructor() {
    super();
    this.container = document.querySelector("[data-video-container]");
    this.playButton = document.querySelector("[data-video-button]");
    this.videoElement = document.querySelector("[data-video-frame]");
    this.observer = null;

    // Elements to scale
    this.scaleElements = [this.playButton, this.videoElement].filter(Boolean);

    // Bind methods to maintain context
    this.handleScroll = this.handleScroll.bind(this);
  }

  init() {
    super.init();
    if (!this.container) return;

    // Initialize scroll handling
    window.addEventListener("scroll", this.handleScroll);
    this.handleScroll();

    // Initialize video functionality
    if (this.playButton) {
      this.initIntersectionObserver();
      this.bindEvents();
    }
  }

  handleScroll() {
    if (!this.container) return;

    const rect = this.container.getBoundingClientRect();
    const navHeight = 64; // h-16 equals 64px (4rem)
    const windowHeight = window.innerHeight;

    // Calculate progress based on element entering viewport to nav height position
    const totalDistance = windowHeight - navHeight;
    const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / totalDistance));

    // Scale from 0.3 to 1 based on progress
    const scale = 0.3 + progress * 0.7;

    this.scaleElements.forEach((element) => {
      element.style.transform = `scale(${scale})`;
    });
  }

  initIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        threshold: 0.5,
      }
    );

    const videoContainer = this.playButton.closest(".video-section");
    if (videoContainer) {
      this.observer.observe(videoContainer);
    }
  }

  handleIntersection(entries) {
    entries.forEach((entry) => {
      if (
        !entry.isIntersecting &&
        !this.playButton.classList.contains("is-hidden")
      ) {
        // If video section is not in view and play button is visible, pause the video
        if (this.videoElement.src.includes("youtube")) {
          // Send pause command to YouTube iframe
          this.videoElement.contentWindow?.postMessage(
            '{"event":"command","func":"pauseVideo","args":""}',
            "*"
          );
        } else if (this.videoElement.src.includes("vimeo")) {
          // Pause Vimeo video
          const player = new Vimeo.Player(this.videoElement);
          player.pause();
        } else if (this.videoElement.pause) {
          // Pause native video
          this.videoElement.pause();
        }
      }
    });
  }

  bindEvents() {
    this.playButton.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent default button behavior
      this.handlePlay();
    });
  }

  handlePlay() {
    this.playButton.classList.add("is-hidden");

    if (this.videoElement.src?.includes("youtube")) {
      this.handleYouTube();
    } else if (this.videoElement.src?.includes("vimeo")) {
      this.handleVimeo();
    } else {
      // Handle native video - simplified condition
      this.handleNativeVideo();
    }
  }

  handleYouTube() {
    this.videoElement.src = this.videoElement.src + "&autoplay=1&enablejsapi=1";

    this.videoElement.addEventListener("message", (event) => {
      if (event.data === 2 || event.data === 0) {
        this.playButton.classList.remove("is-hidden");
      }
    });
  }

  handleVimeo() {
    this.videoElement.src = this.videoElement.src + "?autoplay=1&api=1";

    const player = new Vimeo.Player(this.videoElement);
    player.on("pause", () => this.playButton.classList.remove("is-hidden"));
    player.on("ended", () => this.playButton.classList.remove("is-hidden"));
  }

  handleNativeVideo() {
    if (this.videoElement.querySelector("video")) {
      const video = this.videoElement.querySelector("video");
      video.play();

      video.addEventListener("pause", () =>
        this.playButton.classList.remove("is-hidden")
      );
      video.addEventListener("ended", () =>
        this.playButton.classList.remove("is-hidden")
      );
    }
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    super.destroy();
  }
}
