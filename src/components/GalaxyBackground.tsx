import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  reset: () => void;
  update: () => void;
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number, mouseX: number, mouseY: number) => void;
}

export default function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    const createStar = (): Star => {
      const star = {
        x: 0,
        y: 0,
        z: 0,
        reset() {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.z = Math.random() * 1000;
        },
        update() {
          this.z -= 1.5;
          if (this.z <= 0) {
            this.reset();
            this.z = 1000;
          }
        },
        draw(ctx: CanvasRenderingContext2D, w: number, h: number, mouseX: number, mouseY: number) {
          const k = 128 / this.z;
          const px = (this.x - w / 2) * k + w / 2;
          const py = (this.y - h / 2) * k + h / 2;

          if (px < 0 || px > w || py < 0 || py > h) return;

          const size = (1 - this.z / 1000) * 1.5;
          const opacity = (1 - this.z / 1000) * 0.8;

          const dx = px - mouseX;
          const dy = py - mouseY;
          const dist = dx * dx + dy * dy;

          if (dist < 22500) {
            const influence = 1 - Math.sqrt(dist) / 150;
            ctx.fillStyle = `rgba(103, 232, 249, ${opacity * (0.4 + influence * 0.6)})`;
            ctx.fillRect(
              px - size * (1 + influence),
              py - size * (1 + influence),
              size * 2 * (1 + influence),
              size * 2 * (1 + influence)
            );
          } else {
            ctx.fillStyle = `rgba(34, 211, 238, ${opacity * 0.5})`;
            ctx.fillRect(px - size, py - size, size * 2, size * 2);
          }
        }
      };
      star.reset();
      return star;
    };

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;

      starsRef.current = [];
      for (let i = 0; i < 200; i++) {
        starsRef.current.push(createStar());
      }
    };

    const animate = () => {
      ctx.fillStyle = '#070911';
      ctx.fillRect(0, 0, width, height);

      starsRef.current.forEach(star => {
        star.update();
        star.draw(ctx, width, height, mouseRef.current.x, mouseRef.current.y);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    const handleScroll = () => {
      const heroSection = document.getElementById('hero');
      if (!heroSection || !canvas) return;

      const heroRect = heroSection.getBoundingClientRect();
      const heroHeight = heroRect.height;
      const scrollProgress = Math.max(0, Math.min(1, -heroRect.top / heroHeight));

      canvas.style.opacity = String(1 - scrollProgress * 0.7);
      canvas.style.transform = `scale(${1 + scrollProgress * 0.1})`;
    };

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 250);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    resize();
    animate();
    handleScroll();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="galaxyCanvas"
      className="absolute inset-0 w-full h-full transition-all duration-300 ease-out"
    />
  );
}
