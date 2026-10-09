import React, { useRef, useState, useEffect, useMemo } from 'react';
import { SCREEN_RECTS } from '../data/screensLayout';
import MonitorScreen from './screens/MonitorScreen';
import PaperScreen from './screens/PaperScreen';
import PhoneScreen from './screens/PhoneScreen';

const SCREEN_COMPONENTS = {
  PC: MonitorScreen,
  Paper: PaperScreen,
  Phone: PhoneScreen,
};

const MARGIN = 14; // jarak aman dari tepi viewport (px)

/**
 * Hotspot interaktif yang menempel persis di atas "layar" objek:
 * monitor PC, kertas notepad, dan smartphone.
 *
 * Frame statis memakai object-cover pada kanvas 16:9, jadi pada layar yang
 * lebih lebar dari 16:9 gambarnya terpotong vertikal. Wrapper ini mereproduksi
 * kotak render gambar tersebut supaya preview selalu presisi di atas objeknya.
 * Bila objek tidak muat di viewport (mis. HP portrait), panel otomatis
 * dilepas dari objek, dikecilkan, dan dipusatkan agar tetap bisa diklik.
 */
export default function ObjectScreen({ currentObject, onOpenDetail }) {
  const hostRef = useRef(null);
  const [box, setBox] = useState(null);
  const [viewport, setViewport] = useState(() => ({
    w: window.innerWidth,
    h: window.innerHeight,
  }));

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const update = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w > 0 && h > 0) {
        const imageWidth = Math.max(w, (h * 16) / 9);
        const imageHeight = (imageWidth * 9) / 16;
        const hostRect = el.getBoundingClientRect();
        setBox({
          hostLeft: hostRect.left,
          hostTop: hostRect.top,
          left: (w - imageWidth) / 2,
          top: (h - imageHeight) / 2,
          width: imageWidth,
          height: imageHeight,
        });
      }
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  const Screen = SCREEN_COMPONENTS[currentObject];
  const rect = SCREEN_RECTS[currentObject];

  const layout = useMemo(() => {
    if (!box || !Screen || !rect) return null;
    return computeLayout(rect, box, viewport);
  }, [currentObject, box, viewport, Screen, rect]);

  if (!Screen) return null;

  // Host-nya harus selalu dirender agar ResizeObserver bisa mengukur kotak kanvas.
  return (
    <div ref={hostRef} className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {layout &&
        (layout.floating ? (
          <div
            className="pointer-events-auto absolute animate-fade-in no-scrollbar overflow-y-auto rounded-2xl shadow-[0_24px_70px_rgba(0,0,0,0.65)] ring-1 ring-white/15"
            style={{ ...layout.style, containerType: 'inline-size' }}
          >
            <Screen onOpenDetail={onOpenDetail} floating />
          </div>
        ) : (
          // Kotak render gambar (object-cover 16:9) direproduksi murni via CSS:
          // lebar = host, tinggi = lebar x 9/16, dipusatkan vertikal — sama persis
          // dengan cara <img object-cover> membingkai gambar. Karena % murni CSS,
          // panel ikut terekam seketika saat kanvas/viewport berubah ukuran,
          // tanpa menunggu ResizeObserver / render ulang React.
          <div
            className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 aspect-[16/9]"
          >
            <div
              className="pointer-events-auto absolute animate-fade-in no-scrollbar"
              style={{
                left: `${rect.left}%`,
                top: `${rect.top}%`,
                width: `${rect.width}%`,
                height: `${rect.height}%`,
                containerType: 'inline-size',
              }}
            >
              <Screen onOpenDetail={onOpenDetail} floating={false} />
            </div>
          </div>
        ))}
    </div>
  );
}

function computeLayout(rect, box, viewport) {
  if (!rect) return null;

  const x = (rect.left / 100) * box.width;
  const y = (rect.top / 100) * box.height;
  const w = (rect.width / 100) * box.width;
  const h = (rect.height / 100) * box.height;

  // Asal koordinat gambar di dalam viewport (kanvas bisa lebih lebar dari layar)
  const originX = box.hostLeft + box.left;
  const originY = box.hostTop + box.top;

  // Kotak viewport dalam koordinat gambar
  const viewX = -originX;
  const viewY = -originY;
  const viewW = viewport.w;
  const viewH = viewport.h;

  const fits =
    x >= viewX + MARGIN &&
    y >= viewY + MARGIN &&
    x + w <= viewX + viewW - MARGIN &&
    y + h <= viewY + viewH - MARGIN;

  if (fits) {
    return { floating: false, style: { left: x, top: y, width: w, height: h } };
  }

  // Mode "terlepas": jaga lebar minimal yang nyaman, lalu pusatkan di viewport.
  const preferred = Math.min(Math.max(w, Math.min(viewW * 0.62, 520)), viewW - MARGIN * 2);
  const width = Math.max(170, preferred);
  const maxHeight = Math.max(220, viewH - 150);

  return {
    floating: true,
    style: {
      width,
      left: viewX + viewW / 2 - width / 2,
      top: viewY + viewH / 2,
      transform: 'translateY(-50%)',
      maxHeight,
    },
  };
}
