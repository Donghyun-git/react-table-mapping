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
    const normalMappings = mappings.filter((mapping) => mapping.id !== hoveredMapping);
    const hoveredMappingData = mappings.find((mapping) => mapping.id === hoveredMapping);

    return (
      <>
        {normalMappings.map((mapping) => {
          const pathData = createPath(mapping.source, mapping.target);

          return pathData ? (
            <g
              key={`${mapping.id}-${forceUpdate}`}
              className="mapping-line-group"
              onMouseEnter={() => setHoveredMapping(mapping.id)}
              onMouseLeave={() => setHoveredMapping(null)}
            >
              <path
                d={pathData.path}
                stroke={lineColor}
                strokeWidth={lineWidth}
                fill="none"
                markerEnd="url(#arrowhead-normal)"
                className="path-line"
              />

              <path
                d={pathData.path}
                stroke="transparent"
                strokeWidth="20"
                fill="none"
                style={{ cursor: 'pointer' }}
                onClick={() => removeMapping(mapping.id)}
              />
            </g>
          ) : null;
        })}

        {hoveredMappingData &&
          (() => {
            const pathData = createPath(hoveredMappingData.source, hoveredMappingData.target);

            return pathData ? (
              <g
                key={`${hoveredMappingData.id}-${forceUpdate}-hovered`}
                className="mapping-line-group hovered"
                onMouseEnter={() => setHoveredMapping(hoveredMappingData.id)}
                onMouseLeave={() => setHoveredMapping(null)}
                style={{ zIndex: 1000 }}
              >
                <path
                  d={pathData.path}
                  stroke={hoverLineColor}
                  strokeWidth={lineWidth + 0.5}
                  fill="none"
                  markerEnd="url(#arrowhead-hover)"
                  className="path-line path-line-hovered"
                  style={{ filter: 'drop-shadow(0 0 3px rgba(255, 87, 34, 0.5))' }}
                />

                <path
                  d={pathData.path}
                  stroke="transparent"
                  strokeWidth="20"
                  fill="none"
                  style={{ cursor: 'pointer' }}
                  onClick={() => removeMapping(hoveredMappingData.id)}
                />

                {/* 중앙 삭제 버튼 */}
                <foreignObject
                  width="20"
                  height="20"
                  x={pathData.midX - 10}
                  y={pathData.midY - 8}
                  style={{ overflow: 'visible' }}
                  onClick={() => removeMapping(hoveredMappingData.id)}
                >
                  <div
                    className="delete-btn-modern"
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      background: 'white',
                      boxShadow: '0 2px 8px rgba(255, 71, 87, 0.3)',
                      border: '2px solid #ff4757',
                      position: 'relative',
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M18 6L6 18M6 6L18 18"
                        stroke="#ff4757"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </foreignObject>
              </g>
            ) : null;
          })()}
      </>
    );
  },
);

export default MappingLines;
