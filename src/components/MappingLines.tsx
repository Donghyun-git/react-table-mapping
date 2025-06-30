import { memo } from 'react';

interface MappingLinesProps {
  mappings: Mapping[];
  createPath: (sourceId: string, targetId: string) => { path: string; midX: number; midY: number };
  lineColor: string;
  lineWidth: number;
  hoverLineColor: string;
  removeMapping: (mappingId: string) => void;
  forceUpdate: number;
  hoveredMapping: string | null;
  setHoveredMapping: (id: string | null) => void;
}

const MappingLines = memo(
  ({
    mappings,
    createPath,
    lineColor,
    lineWidth,
    hoverLineColor,
    removeMapping,
    forceUpdate,
    hoveredMapping,
    setHoveredMapping,
  }: MappingLinesProps) => {
    return (
      <>
        {mappings.map((mapping) => {
          const pathData = createPath(mapping.source, mapping.target);

          return pathData ? (
            <g
              key={`${mapping.id}-${forceUpdate}`}
              onMouseEnter={() => setHoveredMapping(mapping.id)}
              onMouseLeave={() => setHoveredMapping(null)}
            >
              {/* 실제 연결선 */}
              <path
                d={pathData.path}
                stroke={hoveredMapping === mapping.id ? hoverLineColor : lineColor}
                strokeWidth={lineWidth}
                fill="none"
                markerEnd={`url(#arrowhead-${hoveredMapping === mapping.id ? 'hover' : 'normal'})`}
                className="path-line"
              />

              {/* 선 위에 마우스를 올렸을 때 더 넓은 영역의 투명한 선 (클릭/호버 감지용) */}
              <path
                d={pathData.path}
                stroke="transparent"
                strokeWidth="20"
                fill="none"
                style={{ cursor: 'pointer' }}
                onClick={() => removeMapping(mapping.id)}
              />

              {/* 중앙 삭제 버튼 - 호버 시에만 표시 */}
              {hoveredMapping === mapping.id && (
                <foreignObject
                  width="12"
                  height="12"
                  x={pathData.midX - 12}
                  y={pathData.midY - 12}
                  style={{ overflow: 'visible' }}
                  onClick={() => removeMapping(mapping.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="delete-btn-circle"
                    viewBox="0 0 24 24"
                    width="12"
                    height="12"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="8"
                      fill="white"
                      stroke="#ff6b6b"
                      strokeWidth="0.3"
                      style={{ stroke: '#cccccc', strokeWidth: '0.3' }}
                    />
                    <line x1="9" y1="9" x2="15" y2="15" stroke="#ff6b6b" strokeWidth="0.6" strokeLinecap="round" />
                    <line x1="15" y1="9" x2="9" y2="15" stroke="#ff6b6b" strokeWidth="0.6" strokeLinecap="round" />
                  </svg>
                </foreignObject>
              )}
            </g>
          ) : null;
        })}
      </>
    );
  },
);

export default MappingLines;
