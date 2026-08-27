import { useMemo } from 'react';
import useOrderStore from '../store/orderStore';

// Chair size / font size by guest count band (from Table Concept Spec 4.4)
const CHAIR_BANDS = [
  { max: 6, size: 34, font: 13 },
  { max: 10, size: 30, font: 12 },
  { max: 16, size: 26, font: 11 },
  { max: 24, size: 22, font: 10 },
  { max: Infinity, size: 18, font: 10 },
];

function getChairBand(n) {
  return CHAIR_BANDS.find((band) => n <= band.max);
}

function initials(name) {
  if (!name) return '';
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/**
 * TableRing — draws the table + chairs SVG for the Table Concept.
 *
 * Props:
 *  - guestCount: number (falls back to orderStore.guestCount, min 1)
 *  - members: optional array of { name, role } aligned to seat index.
 *             role "host" renders solid ink chair. Omit to preview with
 *             seat 0 as "You" (host) and the rest empty — this is the
 *             Phase 1 placeholder until Phase 6 wires the real roster.
 */
export default function TableRing({ guestCount, members }) {
  const storeGuestCount = useOrderStore((s) => s.guestCount);
  const n = Math.max(1, guestCount ?? storeGuestCount ?? 1);

  const seats = useMemo(() => {
    const list = new Array(n).fill(null);
    if (members) {
      members.slice(0, n).forEach((m, i) => {
        list[i] = m;
      });
    } else {
      list[0] = { name: 'You', role: 'host' };
    }
    return list;
  }, [n, members]);

  const chairBand = getChairBand(n);
  const pad = 86;
  const depth = 108;
  const isRound = n <= 6;
  const showFullName = n <= 10;

  let width;
  let height;
  let tableShape;
  const chairs = [];
  const plates = [];

  if (isRound) {
    const rx = 78 + n * 10;
    const ry = 74;
    const cx = rx + 26 + chairBand.size / 2 + pad;
    const cy = ry + 26 + chairBand.size / 2 + pad;
    width = cx * 2;
    height = cy * 2;
    tableShape = { type: 'round', rx, ry, cx, cy };

    for (let i = 0; i < n; i += 1) {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      const x = cx + (rx + 26) * Math.cos(a);
      const y = cy + (ry + 26) * Math.sin(a);
      const rotateDeg = a * (180 / Math.PI) + 90;
      chairs.push({ x, y, rotateDeg, seat: seats[i] });
    }

    const plateCount = n <= 2 ? 1 : n <= 4 ? 2 : 3;
    for (let i = 0; i < plateCount; i += 1) {
      const spread = 28;
      plates.push({ x: cx + (i - (plateCount - 1) / 2) * spread, y: cy });
    }
  } else {
    const length = Math.min(860, 60 + n * 24);
    const cy = depth / 2 + 26 + chairBand.size / 2 + pad;
    const cx = length / 2 + pad;
    width = cx * 2;
    height = cy * 2;
    tableShape = { type: 'banquet', length, depth, cx, cy };

    const top = Math.ceil(n / 2);
    const bottom = n - top;
    const margin = depth / 2 + 30;
    const usableStart = cx - length / 2 + margin;
    const usableEnd = cx + length / 2 - margin;
    const usableLen = Math.max(usableEnd - usableStart, 1);

    for (let i = 0; i < top; i += 1) {
      const t = top === 1 ? 0.5 : i / (top - 1);
      chairs.push({
        x: usableStart + t * usableLen,
        y: cy - depth / 2 - 26,
        rotateDeg: 0,
        seat: seats[i],
      });
    }
    for (let i = 0; i < bottom; i += 1) {
      const t = bottom === 1 ? 0.5 : i / (bottom - 1);
      chairs.push({
        x: usableStart + t * usableLen,
        y: cy + depth / 2 + 26,
        rotateDeg: 180,
        seat: seats[top + i],
      });
    }

    const plateCount = Math.max(2, Math.min(8, Math.round(length / 90)));
    for (let i = 0; i < plateCount; i += 1) {
      const t = plateCount === 1 ? 0.5 : i / (plateCount - 1);
      plates.push({ x: cx - length / 2 + 40 + t * (length - 80), y: cy });
    }
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      style={{ maxWidth: '640px', display: 'block', margin: '0 auto' }}
    >
      {/* table shape — double-stroke wobble for the hand-drawn look */}
      {tableShape.type === 'round' ? (
        <>
          <ellipse
            cx={tableShape.cx + 1.5}
            cy={tableShape.cy - 1.5}
            rx={tableShape.rx}
            ry={tableShape.ry}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="2"
            opacity="0.4"
          />
          <ellipse
            cx={tableShape.cx}
            cy={tableShape.cy}
            rx={tableShape.rx}
            ry={tableShape.ry}
            fill="var(--color-paper)"
            stroke="var(--color-ink)"
            strokeWidth="2"
          />
        </>
      ) : (
        <>
          <rect
            x={tableShape.cx - tableShape.length / 2 + 1.5}
            y={tableShape.cy - tableShape.depth / 2 - 1.5}
            width={tableShape.length}
            height={tableShape.depth}
            rx={tableShape.depth / 2}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="2"
            opacity="0.4"
          />
          <rect
            x={tableShape.cx - tableShape.length / 2}
            y={tableShape.cy - tableShape.depth / 2}
            width={tableShape.length}
            height={tableShape.depth}
            rx={tableShape.depth / 2}
            fill="var(--color-paper)"
            stroke="var(--color-ink)"
            strokeWidth="2"
          />
        </>
      )}

      {/* decorative plates */}
      {plates.map((p, i) => (
        <circle
          key={`plate-${i}`}
          cx={p.x}
          cy={p.y}
          r="10"
          fill="none"
          stroke="var(--color-pencil)"
          strokeWidth="1.5"
          opacity="0.5"
        />
      ))}

      {/* chairs */}
      {chairs.map((c, i) => {
        const isEmpty = !c.seat;
        const isHost = c.seat?.role === 'host';
        const label = isEmpty ? '+' : showFullName ? c.seat.name : initials(c.seat.name);
        const backrestOffset = -(chairBand.size / 2 + 2);

        return (
          <g key={`chair-${i}`} transform={`translate(${c.x}, ${c.y}) rotate(${c.rotateDeg})`}>
            {/* backrest — points away from the table */}
            <rect
              x={-(chairBand.size * 0.6) / 2}
              y={backrestOffset - 7}
              width={chairBand.size * 0.6}
              height="7"
              rx="2.5"
              fill={isEmpty ? 'none' : isHost ? 'var(--color-ink)' : 'var(--color-paper)'}
              stroke={isEmpty ? 'var(--color-pencil)' : 'var(--color-ink)'}
              strokeWidth="1.5"
              strokeDasharray={isEmpty ? '3 3' : 'none'}
            />
            {/* seat */}
            <rect
              x={-chairBand.size / 2}
              y={-chairBand.size / 2}
              width={chairBand.size}
              height={chairBand.size}
              rx="6"
              fill={isEmpty ? 'var(--color-paper)' : isHost ? 'var(--color-ink)' : 'var(--color-paper)'}
              stroke={isEmpty ? 'var(--color-pencil)' : 'var(--color-ink)'}
              strokeWidth="2"
              strokeDasharray={isEmpty ? '4 3' : 'none'}
            />
            {/* label — counter-rotated so text always reads upright */}
            <text
              x="0"
              y="0"
              transform={`rotate(${-c.rotateDeg})`}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="var(--font-body)"
              fontSize={chairBand.font}
              fill={isEmpty ? 'var(--color-pencil)' : isHost ? 'var(--color-paper)' : 'var(--color-ink)'}
            >
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
