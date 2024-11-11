import Stone from './Stone';

type BoardProps = {
  size: number;
  grid: number[][];
  onIntersectionClick: (x: number, y: number) => void;
};

export default function Board({ size, grid, onIntersectionClick }: BoardProps) {
  const cellSize = 30;

  return (
    <svg
      width={(size + 2) * cellSize}
      height={(size + 2) * cellSize}
      className='bg-amber-300 rounded-lg'
    >
      {/* Grid lines */}
      {Array.from({ length: size }).map((_, i) => (
        <g key={`line-${i}`}>
          <line
            x1={cellSize * (i + 1)}
            y1={cellSize}
            x2={cellSize * (i + 1)}
            y2={(size + 1) * cellSize}
            stroke='black'
            strokeWidth='1'
          />
          <line
            x1={cellSize}
            y1={cellSize * (i + 1)}
            x2={(size + 1) * cellSize}
            y2={cellSize * (i + 1)}
            stroke='black'
            strokeWidth='1'
          />
        </g>
      ))}

      <line
        x1={cellSize}
        y1={(size + 1) * cellSize}
        x2={(size + 1) * cellSize}
        y2={(size + 1) * cellSize}
        stroke='black'
        strokeWidth='1'
      />
      <line
        x1={(size + 1) * cellSize}
        y1={cellSize}
        x2={(size + 1) * cellSize}
        y2={(size + 1) * cellSize}
        stroke='black'
        strokeWidth='1'
      />

      {/* Star points */}
      {[3, 9, 15].map((x) =>
        [3, 9, 15].map((y) => (
          <circle
            key={`star-${x}-${y}`}
            cx={cellSize * (x + 1)}
            cy={cellSize * (y + 1)}
            r='4'
            fill='black'
          />
        ))
      )}

      {/* Stones */}
      {grid.map((row, y) =>
        row.map((cell, x) => {
          if (cell === 0) return null; // Empty cell
          const color = cell === 1 ? 'black' : 'white';

          return (
            <g
              key={`stone-${x}-${y}`}
              transform={`translate(${cellSize * (x + 1)}, ${
                cellSize * (y + 1)
              })`}
              onClick={() => onIntersectionClick(x, y)}
              className='cursor-pointer'
            >
              <Stone color={color} size={cellSize * 0.9} />
            </g>
          );
        })
      )}

      {/* Clickable intersections */}
      {grid.map((row, y) =>
        row.map((_, x) => (
          <rect
            key={`rect-${x}-${y}`}
            x={cellSize * (x + 0.5)}
            y={cellSize * (y + 0.5)}
            width={cellSize}
            height={cellSize}
            fill='transparent'
            className='cursor-pointer'
            onClick={() => onIntersectionClick(x, y)}
          />
        ))
      )}
    </svg>
  );
}
