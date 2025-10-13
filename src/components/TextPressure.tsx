import { useRef, useState, useCallback, useEffect } from 'react';

interface TextPressureProps {
  text: string;
}

export default function TextPressure({ text }: TextPressureProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const [letterPositions, setLetterPositions] = useState<Array<{ x: number; y: number }>>([]);

  const letters = Array.from(text);

  useEffect(() => {
    if (!containerRef.current) return;

    const updatePositions = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const positions = Array.from(containerRef.current.children).map((child) => {
        const letterRect = child.getBoundingClientRect();
        return {
          x: letterRect.left + letterRect.width / 2 - rect.left,
          y: letterRect.top + letterRect.height / 2 - rect.top
        };
      });
      setLetterPositions(positions);
    };

    updatePositions();
    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <span
      ref={containerRef}
      className="relative inline-block cursor-default select-none font-compress"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        fontVariationSettings: "'wdth' 100, 'wght' 700",
        wordBreak: 'keep-all',
        overflowWrap: 'break-word',
        hyphens: 'none',
        whiteSpace: 'nowrap'
      }}
    >
      {letters.map((char, index) => {
        const letterPos = letterPositions[index];
        if (!letterPos) {
          return (
            <span key={index} style={{ display: 'inline-block' }}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          );
        }

        const distanceX = mousePos.x - letterPos.x;
        const distanceY = mousePos.y - letterPos.y;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        const maxDistance = 100;
        const influence = Math.max(0, 1 - distance / maxDistance);

        const pushStrength = isHovered ? influence * 20 : 0;
        const pushX = distanceX !== 0 ? (distanceX / distance) * pushStrength * -1 : 0;
        const pushY = distanceY !== 0 ? (distanceY / distance) * pushStrength * -1 : 0;

        const scale = 1 + influence * 0.3;
        const brightness = 1 + influence * 0.8;

        return (
          <span
            key={index}
            style={{
              display: 'inline-block',
              transform: `translate(${pushX}px, ${pushY}px) scale(${scale})`,
              filter: `brightness(${brightness})`,
              transition: isHovered ? 'all 0.1s ease-out' : 'all 0.3s ease-out',
              transformOrigin: 'center',
              willChange: 'transform, filter',
              textShadow: isHovered && influence > 0
                ? `0 0 ${influence * 20}px rgba(103, 232, 249, ${influence * 0.5}), 0 0 ${influence * 40}px rgba(103, 232, 249, ${influence * 0.3})`
                : 'none'
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      })}
    </span>
  );
}
