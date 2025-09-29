(() => {
  const dot = document.getElementById("gold-cursor-dot");
  const ring = document.getElementById("gold-cursor-ring");
  if (!dot || !ring) return;

  let x = window.innerWidth / 2,
    y = window.innerHeight / 2; // target
  let rx = x,
    ry = y; // ring pos (smoothed)
  const ease = 0.16; // follow smoothness

  let visible = false;
  let rafId;

  const show = () => {
    if (!visible) {
      visible = true;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    }
  };

  const hide = () => {
    visible = false;
    dot.style.opacity = "0";
    ring.style.opacity = "0";
  };

  const onMove = (e) => {
    x = e.clientX;
    y = e.clientY;
    show();
    if (!rafId) raf();
  };

  const raf = () => {
    rx += (x - rx) * ease;
    ry += (y - ry) * ease;

    // dot snaps to cursor; ring trails smoothly
    dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;

    rafId = requestAnimationFrame(raf);
  };

  // Click feedback
  const onDown = () => {
    dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(0.9)`;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(0.85)`;
  };
  const onUp = () => {
    dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(1)`;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(1)`;
  };

  // Hover amplification for interactive elements
  const isInteractive = (el) => {
    if (!el) return false;
    const tag = el.tagName?.toLowerCase();
    return (
      el.closest('a, button, [role="button"], input, textarea, select') ||
      tag === "a" ||
      tag === "button" ||
      ["input", "textarea", "select"].includes(tag)
    );
  };

  document.addEventListener("mousemove", onMove, { passive: true });
  document.addEventListener("mouseenter", show);
  document.addEventListener("mouseleave", hide);
  document.addEventListener("mousedown", onDown);
  document.addEventListener("mouseup", onUp);

  // Subtle grow/shimmer when hovering interactive elements
  document.addEventListener(
    "mousemove",
    (e) => {
      const hover = isInteractive(e.target);
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(${
        hover ? 1.35 : 1
      })`;
      ring.style.borderColor = hover
        ? "rgba(255, 240, 150, 0.95)"
        : "rgba(255, 215, 0, 0.9)";
    },
    { passive: true }
  );

  // Auto-hide if idle
  let idleTimer;
  const bump = () => {
    clearTimeout(idleTimer);
    show();
    idleTimer = setTimeout(hide, 1800);
  };
  document.addEventListener("mousemove", bump, { passive: true });
})();
