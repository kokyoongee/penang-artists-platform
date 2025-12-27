'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function AdminTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Reset animation on route change
    setIsVisible(false);

    // Small delay to ensure CSS transition triggers
    const timer = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => cancelAnimationFrame(timer);
  }, [pathname]);

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-2'
      }`}
    >
      {children}
    </div>
  );
}
