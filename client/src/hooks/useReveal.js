import { useEffect, useRef } from 'react';

// Adds the 'reveal visible' class to child elements when they scroll into view.
export default function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const els = el.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((e) => obs.observe(e));
    return () => obs.disconnect();
  }, []);

  return ref;
}
