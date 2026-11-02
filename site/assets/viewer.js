// Picture viewer: opens a plate on top of the slide, with zoom, pan and keyboard control.
// Without JavaScript the link still opens the picture in a new tab.
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll("a.plate"));
  if (!links.length) return;

  var root, stage, img, zoomLabel, closeBtn, titleEl, openLink;
  var lastFocus = null;
  var st = { s: 1, fit: 1, x: 0, y: 0, nw: 0, nh: 0, open: false, moved: false };
  var pointers = {}, pinch = null, drag = null;

  function el(tag, cls, attrs) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    for (var k in attrs || {}) n.setAttribute(k, attrs[k]);
    return n;
  }
  function btn(label, text, fn) {
    var b = el("button", "vbtn", { type: "button", "aria-label": label, title: label });
    b.textContent = text;
    b.addEventListener("click", fn);
    return b;
  }

  function build() {
    root = el("div", "viewer", { role: "dialog", "aria-modal": "true", "aria-label": "Picture viewer", hidden: "" });
    var bar = el("div", "viewer-bar");
    titleEl = el("span", "viewer-title");
    zoomLabel = el("span", "viewer-zoom", { "aria-live": "polite" });
    openLink = el("a", "vbtn", { target: "_blank", rel: "noopener", title: "Open the picture in a new tab" });
    openLink.textContent = "New tab ↗";
    closeBtn = btn("Close the viewer (Esc)", "Close ✕", close);
    bar.appendChild(titleEl);
    bar.appendChild(btn("Zoom out (-)", "−", function () { zoomBy(1 / 1.4); }));
    bar.appendChild(zoomLabel);
    bar.appendChild(btn("Zoom in (+)", "+", function () { zoomBy(1.4); }));
    bar.appendChild(btn("Fit to screen (0)", "Fit", reset));
    bar.appendChild(openLink);
    bar.appendChild(closeBtn);

    stage = el("div", "viewer-stage");
    img = el("img", "viewer-img", { alt: "", draggable: "false" });
    stage.appendChild(img);
    stage.appendChild(el("div", "viewer-hint")).textContent = "scroll or pinch to zoom · drag to move · double-click to zoom · Esc to close";
    root.appendChild(bar);
    root.appendChild(stage);
    document.body.appendChild(root);

    // Keep the slide deck from seeing swipes and taps made inside the viewer.
    ["touchstart", "touchend", "touchmove"].forEach(function (t) { root.addEventListener(t, function (e) { e.stopPropagation(); }, { passive: true }); });

    stage.addEventListener("wheel", function (e) {
      e.preventDefault();
      var r = stage.getBoundingClientRect();
      zoomAt(Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015)), e.clientX - r.left, e.clientY - r.top);
    }, { passive: false });
    stage.addEventListener("dblclick", function (e) {
      var r = stage.getBoundingClientRect();
      if (st.s > st.fit * 1.05) reset();
      else zoomAt(2.5, e.clientX - r.left, e.clientY - r.top);
    });
    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onUp);
    stage.addEventListener("click", function (e) {
      // A click on the dark background (not the picture) closes the viewer.
      if (e.target === stage && !st.moved) close();
    });
    window.addEventListener("resize", function () { if (st.open) layout(true); });
  }

  function size() { var r = stage.getBoundingClientRect(); return { w: r.width, h: r.height }; }

  function clamp() {
    var z = size(), w = st.nw * st.s, h = st.nh * st.s;
    st.x = w <= z.w ? (z.w - w) / 2 : Math.min(0, Math.max(z.w - w, st.x));
    st.y = h <= z.h ? (z.h - h) / 2 : Math.min(0, Math.max(z.h - h, st.y));
  }
  function apply() {
    clamp();
    img.style.transform = "translate(" + st.x + "px," + st.y + "px) scale(" + st.s + ")";
    zoomLabel.textContent = Math.round((st.s / st.fit) * 100) + "%";
    stage.classList.toggle("zoomed", st.s > st.fit * 1.01);
  }
  function layout(keepZoom) {
    var z = size(), ratio = st.s / st.fit;
    st.fit = Math.min(z.w / st.nw, z.h / st.nh, 1) * 0.98;
    st.s = keepZoom ? st.fit * ratio : st.fit;
    if (!keepZoom) { st.x = 0; st.y = 0; }
    apply();
  }
  function reset() { layout(false); }
  function maxScale() { return Math.max(st.fit * 6, 2); }
  function zoomAt(factor, cx, cy) {
    var s2 = Math.min(maxScale(), Math.max(st.fit, st.s * factor)), k = s2 / st.s;
    st.x = cx - (cx - st.x) * k;
    st.y = cy - (cy - st.y) * k;
    st.s = s2;
    apply();
  }
  function zoomBy(f) { var z = size(); zoomAt(f, z.w / 2, z.h / 2); }

  function onDown(e) {
    if (e.target.closest && e.target.closest(".viewer-hint")) return;
    st.moved = false;
    pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
    try { stage.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    var ids = Object.keys(pointers);
    if (ids.length === 2) {
      var a = pointers[ids[0]], b = pointers[ids[1]];
      pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), s: st.s };
      drag = null;
    } else {
      drag = { x: e.clientX, y: e.clientY, ox: st.x, oy: st.y };
    }
  }
  function onMove(e) {
    if (!pointers[e.pointerId]) return;
    pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
    var ids = Object.keys(pointers), r = stage.getBoundingClientRect();
    if (ids.length === 2 && pinch) {
      var a = pointers[ids[0]], b = pointers[ids[1]], d = Math.hypot(a.x - b.x, a.y - b.y);
      st.moved = true;
      zoomAt((pinch.s * (d / pinch.d)) / st.s, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
    } else if (drag) {
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) st.moved = true;
      if (st.s > st.fit * 1.01) { st.x = drag.ox + dx; st.y = drag.oy + dy; stage.classList.add("dragging"); apply(); }
    }
  }
  function onUp(e) {
    delete pointers[e.pointerId];
    if (Object.keys(pointers).length < 2) pinch = null;
    if (!Object.keys(pointers).length) { drag = null; stage.classList.remove("dragging"); setTimeout(function () { st.moved = false; }, 0); }
  }

  function open(link) {
    if (!root) build();
    var pic = link.querySelector("img"), slide = link.closest(".slide"), kicker = slide && slide.querySelector(".kicker");
    lastFocus = document.activeElement;
    titleEl.textContent = kicker ? kicker.textContent.replace(/\s+/g, " ").trim() : "Picture";
    openLink.href = link.href;
    img.alt = pic ? pic.alt : "";
    root.hidden = false;
    document.documentElement.classList.add("viewer-open");
    st.open = true;
    img.style.visibility = "hidden";
    var show = function () {
      st.nw = img.naturalWidth || 2048; st.nh = img.naturalHeight || 2048;
      img.style.width = st.nw + "px"; img.style.height = st.nh + "px";
      layout(false);
      img.style.visibility = "visible";
    };
    img.onload = show;
    img.src = link.href;
    if (img.complete && img.naturalWidth) show();
    closeBtn.focus();
  }
  function close() {
    if (!st.open) return;
    st.open = false;
    root.hidden = true;
    document.documentElement.classList.remove("viewer-open");
    pointers = {}; pinch = null; drag = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  links.forEach(function (a) {
    a.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; // let "open in new tab" shortcuts work
      e.preventDefault();
      open(a);
    });
  });

  // Capture keys before the slide deck sees them, and keep them while the viewer is open.
  window.addEventListener("keydown", function (e) {
    if (!st.open) return;
    e.stopPropagation();
    var k = e.key, onControl = document.activeElement && /^(BUTTON|A)$/.test(document.activeElement.tagName);
    if (k === "Escape") { e.preventDefault(); close(); }
    else if (k === "+" || k === "=") { e.preventDefault(); zoomBy(1.4); }
    else if (k === "-" || k === "_") { e.preventDefault(); zoomBy(1 / 1.4); }
    else if (k === "0") { e.preventDefault(); reset(); }
    else if (k === "ArrowLeft" || k === "ArrowRight" || k === "ArrowUp" || k === "ArrowDown") {
      e.preventDefault();
      var step = 60;
      if (k === "ArrowLeft") st.x += step; else if (k === "ArrowRight") st.x -= step; else if (k === "ArrowUp") st.y += step; else st.y -= step;
      apply();
    } else if (k === "Tab") {
      var f = Array.prototype.slice.call(root.querySelectorAll("button, a[href]"));
      var i = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    } else if ((k === " " || k === "Enter") && !onControl) { e.preventDefault(); }
    else if (k === "PageUp" || k === "PageDown" || k === "Home" || k === "End") { e.preventDefault(); }
  }, true);
})();
