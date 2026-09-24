type Variant =
  | "frame"
  | "grid"
  | "truss"
  | "nodes"
  | "list"
  | "cube"
  | "stick"
  | "skeleton"
  | "schedule"
  | "convert"
  | "layers";

const ACCENT = "#E67E00";

// Original brand-styled line-art illustrations (no stock imagery) used to
// give each SEO landing page a distinct visual without licensing risk.
export function WireframeArt({
  variant,
  className = "",
  dark = false,
}: {
  variant: Variant;
  className?: string;
  dark?: boolean;
}) {
  const line = dark ? "#71717a" : "#cbd5e1";
  const dim = dark ? "#a1a1aa" : "#94a3b8";

  return (
    <div
      className={`w-full aspect-[16/9] flex items-center justify-center rounded-sm ${
        dark ? "bg-zinc-900 border border-zinc-800" : "bg-slate-50 border border-slate-200"
      } ${className}`}
    >
      <svg viewBox="0 0 400 240" className="w-4/5 h-4/5" fill="none">
        {variant === "frame" && <FrameArt line={line} />}
        {variant === "grid" && <GridArt line={line} dim={dim} />}
        {variant === "truss" && <TrussArt line={line} />}
        {variant === "nodes" && <NodesArt line={line} dim={dim} />}
        {variant === "list" && <ListArt line={line} dim={dim} />}
        {variant === "cube" && <CubeArt line={line} />}
        {variant === "stick" && <StickArt line={line} dim={dim} />}
        {variant === "skeleton" && <SkeletonArt line={line} />}
        {variant === "schedule" && <ScheduleArt line={line} dim={dim} />}
        {variant === "convert" && <ConvertArt line={line} dim={dim} />}
        {variant === "layers" && <LayersArt line={line} dim={dim} />}
      </svg>
    </div>
  );
}

// Portal frame with bracing — structural steel detailing
function FrameArt({ line }: { line: string }) {
  return (
    <g strokeWidth="2">
      <path d="M80 200V60M320 200V60M80 60H320" stroke={ACCENT} strokeLinecap="round" />
      <path d="M80 200V220M320 200V220" stroke={line} strokeLinecap="round" />
      <path d="M80 200H320" stroke={line} strokeDasharray="6 6" />
      <path d="M80 140L150 60M320 140L250 60" stroke={line} />
      {[80, 150, 220, 320].map((x) => (
        <circle key={x} cx={x} cy={x === 150 || x === 220 ? 60 : 200} r="4" fill={ACCENT} />
      ))}
      <circle cx="80" cy="60" r="4" fill={ACCENT} />
      <circle cx="320" cy="60" r="4" fill={ACCENT} />
    </g>
  );
}

// Multi-bay, multi-storey grid — BIM modeling services
function GridArt({ line, dim }: { line: string; dim: string }) {
  const xs = [70, 150, 230, 310];
  const ys = [50, 110, 170];
  return (
    <g strokeWidth="1.6">
      {ys.map((y) => (
        <line key={`h${y}`} x1={xs[0]} y1={y} x2={xs[xs.length - 1]} y2={y} stroke={dim} />
      ))}
      {xs.map((x) => (
        <line key={`v${x}`} x1={x} y1={ys[0]} x2={x} y2={ys[ys.length - 1]} stroke={dim} />
      ))}
      <path d="M70 170L70 210M150 170L150 210M230 170L230 210M310 170L310 210" stroke={ACCENT} strokeWidth="2" />
      {xs.map((x) =>
        ys.map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" fill={line} />),
      )}
    </g>
  );
}

// Triangulated truss — steel takeoff
function TrussArt({ line }: { line: string }) {
  return (
    <g strokeWidth="2">
      <path d="M50 170H350" stroke={ACCENT} strokeLinecap="round" />
      <path
        d="M50 170L130 90L210 170L290 90L350 170M130 90V170M290 90V170"
        stroke={line}
      />
      {[50, 130, 210, 290, 350].map((x) => (
        <circle key={x} cx={x} cy={170} r="4" fill={ACCENT} />
      ))}
      <circle cx="130" cy="90" r="4" fill={line} />
      <circle cx="290" cy="90" r="4" fill={line} />
    </g>
  );
}

// Node network with quantity tags — material takeoff (MTO)
function NodesArt({ line, dim }: { line: string; dim: string }) {
  return (
    <g strokeWidth="1.8">
      <path d="M60 180L140 100L220 140L300 60M140 100L140 180M220 140L220 190" stroke={line} />
      {[
        [60, 180],
        [140, 100],
        [220, 140],
        [300, 60],
        [140, 180],
        [220, 190],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill={ACCENT} />
      ))}
      <rect x="250" y="30" width="70" height="20" rx="2" stroke={dim} strokeWidth="1.2" />
      <line x1="260" y1="40" x2="310" y2="40" stroke={dim} strokeWidth="1.2" />
    </g>
  );
}

// Schedule / bill-of-materials list beside a small frame — BOM
function ListArt({ line, dim }: { line: string; dim: string }) {
  return (
    <g>
      <g strokeWidth="2">
        <path d="M60 200V80H140V200" stroke={ACCENT} strokeLinecap="round" />
        <path d="M60 140H140" stroke={line} />
      </g>
      <g strokeWidth="1.4" stroke={dim}>
        {[70, 95, 120, 145, 170].map((y) => (
          <line key={y} x1="180" y1={y} x2="340" y2={y} />
        ))}
        {[70, 95, 120, 145, 170].map((y) => (
          <line key={`d${y}`} x1="180" y1={y} x2="200" y2={y} stroke={ACCENT} strokeWidth="2" />
        ))}
      </g>
    </g>
  );
}

// Open wireframe cube — "what is a wireframe" glossary page
function CubeArt({ line }: { line: string }) {
  return (
    <g strokeWidth="2">
      <path
        d="M110 70H290V170H110V70ZM150 40H330V140M290 70L330 40M290 170L330 140M110 170L150 140M150 40V140"
        stroke={ACCENT}
      />
      <path d="M330 140V40" stroke={line} />
      {[
        [110, 70],
        [290, 70],
        [290, 170],
        [110, 170],
        [150, 40],
        [330, 40],
        [330, 140],
        [150, 140],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" fill={line} />
      ))}
    </g>
  );
}

// Centroidal "stick" skeleton — "what is a stick model" glossary page
function StickArt({ line, dim }: { line: string; dim: string }) {
  return (
    <g strokeWidth="2.2">
      <path d="M90 200V50M90 50H310M310 200V50M90 125H310" stroke={ACCENT} strokeLinecap="round" />
      <path d="M90 200H60M310 200H340" stroke={dim} strokeDasharray="4 5" />
      {[
        [90, 50],
        [310, 50],
        [90, 125],
        [310, 125],
        [90, 200],
        [310, 200],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill={line} />
      ))}
    </g>
  );
}

// Multi-storey building elevation skeleton — wireframe models service page
function SkeletonArt({ line }: { line: string }) {
  const cols = [100, 165, 230, 295];
  const rows = [200, 155, 110, 65];
  return (
    <g strokeWidth="2">
      {cols.map((x) => (
        <line key={`c${x}`} x1={x} y1={rows[0]} x2={x} y2={rows[rows.length - 1]} stroke={ACCENT} strokeLinecap="round" />
      ))}
      {rows.map((y) => (
        <line key={`r${y}`} x1={cols[0]} y1={y} x2={cols[cols.length - 1]} y2={y} stroke={line} />
      ))}
      {cols.map((x) =>
        rows.map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" fill={line} />),
      )}
    </g>
  );
}

// Member schedule beside a small line model — estimation models service page
function ScheduleArt({ line, dim }: { line: string; dim: string }) {
  return (
    <g>
      <g strokeWidth="2" stroke={ACCENT}>
        <path d="M60 190L60 110L120 70L120 190" strokeLinecap="round" />
        <path d="M60 150H120" stroke={line} />
      </g>
      <g strokeWidth="1.4" stroke={dim}>
        {[70, 95, 120, 145, 170].map((y, i) => (
          <g key={y}>
            <line x1="160" y1={y} x2={160 + 40 + i * 25} y2={y} stroke={ACCENT} strokeWidth="3" />
            <line x1={160 + 55 + i * 25} y1={y} x2="340" y2={y} strokeDasharray="2 4" />
          </g>
        ))}
      </g>
    </g>
  );
}

// 2D plan morphing into a 3D frame — 2D-to-3D conversion service page
function ConvertArt({ line, dim }: { line: string; dim: string }) {
  return (
    <g strokeWidth="2">
      <rect x="40" y="70" width="110" height="100" stroke={dim} />
      <path d="M60 90H130M60 110H130M60 130H130M60 150H130" stroke={dim} strokeWidth="1.2" />
      <path d="M170 120H210" stroke={ACCENT} strokeLinecap="round" markerEnd="url(#arrow)" />
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0 0L8 4L0 8Z" fill={ACCENT} />
        </marker>
      </defs>
      <path
        d="M240 170V90H320V170ZM240 90L260 70H340L320 90M320 90V170M320 170L340 150V70"
        stroke={ACCENT}
      />
      {[
        [240, 90],
        [320, 90],
        [240, 170],
        [320, 170],
        [260, 70],
        [340, 70],
        [340, 150],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" fill={line} />
      ))}
    </g>
  );
}

// Stacked, connected platform layers — BIM/Tekla PowerFab integration page
function LayersArt({ line, dim }: { line: string; dim: string }) {
  const layers = [
    { y: 70, w: 220, active: true },
    { y: 120, w: 190, active: false },
    { y: 170, w: 160, active: false },
  ];
  return (
    <g strokeWidth="2">
      {layers.map((l, i) => (
        <g key={i}>
          <path
            d={`M${200 - l.w / 2} ${l.y}L${200 + l.w / 2} ${l.y}L${200 + l.w / 2 - 20} ${l.y + 20}L${200 - l.w / 2 + 20} ${l.y + 20}Z`}
            stroke={l.active ? ACCENT : dim}
            strokeWidth={l.active ? 2.2 : 1.4}
          />
        </g>
      ))}
      <path d="M200 90V170" stroke={line} strokeDasharray="3 5" />
    </g>
  );
}
