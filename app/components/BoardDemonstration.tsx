import React from 'react';

interface BoardDemonstrationProps {
  mode: 'classic' | 'advanced' | 'ai';
  width?: number;
  height?: number;
}

const BoardDemonstration: React.FC<BoardDemonstrationProps> = ({ mode, width = 300, height = 300 }) => {
  const strokeWidth = width * 0.02;
  const cellSize = width / 3;
  const padding = width * 0.1;
  const symbolSize = cellSize * 0.6;

  const renderGrid = () => (
    <g>
      {/* Vertical lines */}
      <line x1={cellSize} y1={padding} x2={cellSize} y2={height - padding} stroke="white" strokeWidth={strokeWidth} />
      <line x1={cellSize * 2} y1={padding} x2={cellSize * 2} y2={height - padding} stroke="white" strokeWidth={strokeWidth} />
      {/* Horizontal lines */}
      <line x1={padding} y1={cellSize} x2={width - padding} y2={cellSize} stroke="white" strokeWidth={strokeWidth} />
      <line x1={padding} y1={cellSize * 2} x2={width - padding} y2={cellSize * 2} stroke="white" strokeWidth={strokeWidth} />
    </g>
  );

  const renderX = (x: number, y: number, isOldest = false) => (
    <g transform={`translate(${x * cellSize + cellSize/2}, ${y * cellSize + cellSize/2})`}>
      <line 
        x1={-symbolSize/2} y1={-symbolSize/2} 
        x2={symbolSize/2} y2={symbolSize/2} 
        stroke={isOldest ? "#FF6B6B" : "url(#xGradient)"} 
        strokeWidth={strokeWidth * 1.5} 
        strokeLinecap="round"
      />
      <line 
        x1={symbolSize/2} y1={-symbolSize/2} 
        x2={-symbolSize/2} y2={symbolSize/2} 
        stroke={isOldest ? "#FF6B6B" : "url(#xGradient)"} 
        strokeWidth={strokeWidth * 1.5} 
        strokeLinecap="round"
      />
    </g>
  );

  const renderO = (x: number, y: number, isOldest = false) => (
    <circle
      cx={x * cellSize + cellSize/2}
      cy={y * cellSize + cellSize/2}
      r={symbolSize/2}
      stroke={isOldest ? "#4A9EFF" : "url(#oGradient)"}
      strokeWidth={strokeWidth * 1.5}
      fill="none"
    />
  );

  const renderClassicBoard = () => (
    <>
      {renderX(0, 0)}
      {renderO(1, 0)}
      {renderX(2, 0)}
      {renderO(1, 1)}
      {renderX(1, 2)}
    </>
  );

  const renderAdvancedBoard = () => (
    <>
      {renderX(0, 0, true)}
      {renderO(1, 0)}
      {renderX(2, 0)}
      {renderO(1, 1)}
      {renderX(2, 2)}
      <g className="moveArrow">
        <path
          d="M 50,150 L 250,150"
          stroke="#FFD700"
          strokeWidth={strokeWidth}
          strokeDasharray="10,10"
          markerEnd="url(#arrowhead)"
        />
      </g>
    </>
  );

  const renderAIBoard = () => (
    <>
      {renderX(0, 0)}
      {renderO(1, 1)}
      <g className="thinking">
        <circle
          cx={2 * cellSize + cellSize/2}
          cy={2 * cellSize + cellSize/2}
          r={symbolSize/4}
          fill="#4A9EFF"
          opacity={0.5}
        >
          <animate
            attributeName="opacity"
            values="0.5;1;0.5"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </>
  );

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id="xGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF4D4D" />
          <stop offset="100%" stopColor="#FF8C00" />
        </linearGradient>
        <linearGradient id="oGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A9EFF" />
          <stop offset="100%" stopColor="#00E5FF" />
        </linearGradient>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#FFD700" />
        </marker>
      </defs>
      <rect width={width} height={height} fill="#1a1a1a" rx="10" />
      {renderGrid()}
      {mode === 'classic' && renderClassicBoard()}
      {mode === 'advanced' && renderAdvancedBoard()}
      {mode === 'ai' && renderAIBoard()}
    </svg>
  );
};

export default BoardDemonstration; 