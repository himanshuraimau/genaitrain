// Slide engine: one slide at a time, arrows / space / swipe, #hash deep links.
(function () {
  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  if (!slides.length) return;

  var prevBtn = document.getElementById("prev");
  var nextBtn = document.getElementById("next");
  var counter = document.getElementById("counter");
  var bar = document.getElementById("bar");
  var nextChapter = document.body.getAttribute("data-next");
  var prevChapter = document.body.getAttribute("data-prev");
  var i = 0;

  function show(n, push) {
    i = Math.max(0, Math.min(slides.length - 1, n));
    slides.forEach(function (s, k) { s.classList.toggle("active", k === i); });
    slides[i].scrollTop = 0;
    counter.textContent = i + 1 + " / " + slides.length;
    bar.style.width = ((i + 1) / slides.length) * 100 + "%";
    prevBtn.disabled = i === 0 && !prevChapter;
    nextBtn.disabled = i === slides.length - 1 && !nextChapter;
    prevBtn.textContent = i === 0 && prevChapter ? "← Prev chapter" : "← Back";
    nextBtn.textContent = i === slides.length - 1 && nextChapter ? "Next chapter →" : "Next →";
    if (push !== false) history.replaceState(null, "", "#" + (i + 1));
  }

  function next() {
    if (i < slides.length - 1) show(i + 1);
    else if (nextChapter) location.href = nextChapter;
  }
  function prev() {
    if (i > 0) show(i - 1);
    else if (prevChapter) location.href = prevChapter + "#end";
  }

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  document.addEventListener("keydown", function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    var k = e.key;
    if (k === "ArrowRight" || k === "PageDown" || k === " ") { e.preventDefault(); next(); }
    else if (k === "ArrowLeft" || k === "PageUp") { e.preventDefault(); prev(); }
    else if (k === "Home") { show(0); }
    else if (k === "End") { show(slides.length - 1); }
  });

  var x0 = null;
  document.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  document.addEventListener("touchend", function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 70) { dx < 0 ? next() : prev(); }
  });

  var h = location.hash.replace("#", "");
  if (h === "end") show(slides.length - 1, false);
  else show(parseInt(h, 10) ? parseInt(h, 10) - 1 : 0, false);
  window.addEventListener("hashchange", function () {
    var n = parseInt(location.hash.replace("#", ""), 10);
    if (n) show(n - 1, false);
  });
})();
