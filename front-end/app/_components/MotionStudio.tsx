"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";

const REVEAL_SELECTORS = [
  "main > *",
  "main section",
  "main form",
  "main [class*='rounded-2xl'][class*='border']",
  "main [class*='rounded-3xl'][class*='border']",
  ".motion-reveal-target",
  "[data-motion-reveal='true']"
];

function collectRevealTargets(): HTMLElement[] {
  const seen = new Set<HTMLElement>();
  REVEAL_SELECTORS.forEach((selector) => {
    document.querySelectorAll<HTMLElement>(selector).forEach((node) => {
      if (seen.has(node)) return;
      if (node.closest("[data-no-motion='true']")) return;
      if (node.classList.contains("motion-ornament")) return;

      const explicitTarget =
        node.matches("main > *") ||
        node.matches("main section") ||
        node.matches("main form") ||
        node.classList.contains("motion-reveal-target") ||
        node.dataset.motionReveal === "true";
      if (!explicitTarget && node.clientHeight < 56 && node.clientWidth < 200) return;

      seen.add(node);
    });
  });
  return Array.from(seen);
}

function shouldAnimateLink(target: HTMLElement): boolean {
  if (target.tagName !== "A") return false;
  const className = target.className;
  if (typeof className !== "string") return false;
  return (
    className.includes("rounded") ||
    className.includes("inline-flex") ||
    className.includes("px-") ||
    className.includes("py-")
  );
}

export default function MotionStudio({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hostRef = useRef<HTMLDivElement>(null);
  const routeLayerRef = useRef<HTMLDivElement>(null);

  const routeKey = useMemo(() => pathname || "/", [pathname]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    host.dataset.motion = reduceMotion ? "reduced" : "full";
    if (reduceMotion) return;

    let animationFrame = 0;

    const updateScrollMotion = () => {
      const doc = document.documentElement;
      const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      host.style.setProperty("--scroll-progress", progress.toFixed(4));
      host.style.setProperty("--scroll-shift", `${(progress * 64).toFixed(2)}px`);
      animationFrame = 0;
    };

    const requestScrollMotion = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateScrollMotion);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const x = event.clientX;
      const y = event.clientY;
      const xShift = (x / window.innerWidth - 0.5) * 30;
      const yShift = (y / window.innerHeight - 0.5) * 20;
      host.style.setProperty("--pointer-x", `${x}px`);
      host.style.setProperty("--pointer-y", `${y}px`);
      host.style.setProperty("--pointer-shift-x", `${xShift.toFixed(2)}px`);
      host.style.setProperty("--pointer-shift-y", `${yShift.toFixed(2)}px`);
    };

    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      host.classList.add("motion-touching");
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      const deltaX = Math.max(-96, Math.min(96, touch.clientX - touchStartX));
      const deltaY = Math.max(-54, Math.min(54, touch.clientY - touchStartY));
      host.style.setProperty("--touch-swipe-x", `${deltaX.toFixed(2)}px`);
      host.style.setProperty("--touch-swipe-y", `${deltaY.toFixed(2)}px`);
    };

    const resetTouchMotion = () => {
      host.classList.remove("motion-touching");
      host.style.setProperty("--touch-swipe-x", "0px");
      host.style.setProperty("--touch-swipe-y", "0px");
    };

    window.addEventListener("scroll", requestScrollMotion, { passive: true });
    window.addEventListener("resize", requestScrollMotion);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", resetTouchMotion, { passive: true });
    window.addEventListener("touchcancel", resetTouchMotion, { passive: true });

    updateScrollMotion();

    return () => {
      window.removeEventListener("scroll", requestScrollMotion);
      window.removeEventListener("resize", requestScrollMotion);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", resetTouchMotion);
      window.removeEventListener("touchcancel", resetTouchMotion);
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (host.dataset.motion === "reduced") return;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -10% 0px"
      }
    );

    const bindRevealTargets = () => {
      const targets = collectRevealTargets();
      targets.forEach((target, index) => {
        if (!target.classList.contains("motion-reveal")) {
          const delay = Math.min(index * 46, 460);
          target.style.setProperty("--motion-delay", `${delay}ms`);
          target.classList.add("motion-reveal");
        }
        revealObserver.observe(target);
      });

      document.querySelectorAll<HTMLElement>("button, a").forEach((target) => {
        if (target.closest("[data-no-motion='true']")) return;
        const shouldAnimate = target.tagName === "BUTTON" || shouldAnimateLink(target);
        if (!shouldAnimate) return;
        target.classList.add("motion-button");
        if (target.closest("nav")) {
          target.classList.add("motion-nav-item");
        }
      });

      document.querySelectorAll<HTMLElement>(".overflow-x-auto, .overflow-y-auto").forEach((target) => {
        if (target.closest("[data-no-motion='true']")) return;
        target.classList.add("motion-swipe-track");
      });
    };

    let frame = 0;
    const mutationObserver = new MutationObserver(() => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        bindRevealTargets();
      });
    });

    bindRevealTargets();
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      mutationObserver.disconnect();
      revealObserver.disconnect();
    };
  }, [routeKey]);

  useEffect(() => {
    const host = hostRef.current;
    const routeLayer = routeLayerRef.current;
    if (!host || !routeLayer) return;
    if (host.dataset.motion === "reduced") return;

    routeLayer.classList.remove("motion-route-enter-active");
    void routeLayer.offsetWidth;
    routeLayer.classList.add("motion-route-enter-active");
  }, [routeKey]);

  return (
    <div ref={hostRef} className="motion-studio" data-route={routeKey}>
      <div className="motion-progress" aria-hidden="true">
        <span className="motion-progress-bar" />
      </div>
      <div className="motion-aurora motion-ornament motion-aurora-a" aria-hidden="true" />
      <div className="motion-aurora motion-ornament motion-aurora-b" aria-hidden="true" />
      <div className="motion-orb motion-ornament motion-orb-a" aria-hidden="true" />
      <div className="motion-orb motion-ornament motion-orb-b" aria-hidden="true" />
      <div className="motion-orb motion-ornament motion-orb-c" aria-hidden="true" />
      <div ref={routeLayerRef} className="motion-route-enter motion-route-enter-active">
        {children}
      </div>
    </div>
  );
}
