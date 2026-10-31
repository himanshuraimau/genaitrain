// Copy buttons: clipboard API where available, textarea fallback for file:// pages.
document.querySelectorAll(".copybtn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    btn.blur();
    var text = document.getElementById(btn.dataset.target).textContent;
    function done() { btn.textContent = "Copied!"; setTimeout(function () { btn.textContent = "Copy"; }, 1800); }
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (e) { btn.textContent = "Select + Ctrl/Cmd+C"; }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
  });
});
