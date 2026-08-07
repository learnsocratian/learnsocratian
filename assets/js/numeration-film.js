/**
 * Full-viewport, click-to-play film used only on the Numeration topic page.
 * Audio begins only after the learner activates the play button.
 */

function initializeNumerationFilm() {
  const film = document.querySelector("[data-numeration-film]");
  const video = film?.querySelector("[data-numeration-film-video]");
  const playButton = film?.querySelector("[data-numeration-film-play]");
  const playLabel = film?.querySelector("[data-numeration-film-play-label]");

  if (
    !(film instanceof HTMLElement) ||
    !(video instanceof HTMLVideoElement) ||
    !(playButton instanceof HTMLButtonElement)
  ) {
    return;
  }

  const showReplayButton = () => {
    film.classList.remove("is-started");
    playButton.setAttribute("aria-label", "Play the Learn Socratian Numeration film again");

    if (playLabel instanceof HTMLElement) {
      playLabel.textContent = "Play again";
    }
  };

  const markAsStarted = () => {
    film.classList.add("is-started");
  };

  playButton.addEventListener("click", async () => {
    if (video.ended) {
      video.currentTime = 0;
    }

    try {
      await video.play();
    } catch {
      film.classList.remove("is-started");
    }
  });

  video.addEventListener("play", markAsStarted);
  video.addEventListener("ended", showReplayButton);
  video.addEventListener("error", () => {
    playButton.hidden = true;
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeNumerationFilm, { once: true });
} else {
  initializeNumerationFilm();
}
