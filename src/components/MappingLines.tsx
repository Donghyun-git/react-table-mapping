import { X } from 'lucide-react';
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
                markerEnd={`url(#arrowhead-${hoveredMapping === mapping.id ? 'hover' : 'normal'})`}
                className="hover:stroke-2 hover:filter-drop-shadow-0-0-3px-rgba-33-150-243-0-5"
              />

              <path
                d={pathData.path}
                stroke="transparent"
                strokeWidth="20"
                fill="none"
                className="cursor-pointer"
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
                  width="18"
                  height="18"
                  x={pathData.midX - 9}
                  y={pathData.midY - 9}
                  style={{ overflow: 'visible' }}
                  onClick={() => removeMapping(hoveredMappingData.id)}
                >
                  <div className="w-4 h-4 border border-[var(--color-border-danger)] flex items-center justify-center bg-[var(--color-bg-mapping-primary)] rounded-full text-[var(--color-icon-danger)] shadow-sm hover:shadow-md hover:scale-110 transition-all duration-150 cursor-pointer group">
                    <X className="w-2.5 h-2.5 group-hover:w-3 group-hover:h-3 transition-all duration-150" />
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
