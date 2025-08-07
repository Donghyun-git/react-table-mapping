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
  isDragging: boolean;
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
    isDragging,
  }: MappingLinesProps) => {
    const effectiveHoveredMapping = isDragging ? null : hoveredMapping;

    const normalMappings = mappings.filter((mapping) => mapping.id !== effectiveHoveredMapping);
    const hoveredMappingData = mappings.find((mapping) => mapping.id === effectiveHoveredMapping);

    return (
      <>
        {normalMappings.map((mapping) => {
          const pathData = createPath(mapping.source, mapping.target);

          return pathData ? (
            <g
              key={`${mapping.id}-${forceUpdate}`}
              className="mapping-line-group"
              onMouseEnter={() => !isDragging && setHoveredMapping(mapping.id)}
              onMouseLeave={() => !isDragging && setHoveredMapping(null)}
            >
              <path
                d={pathData.path}
                stroke={lineColor}
                strokeWidth={lineWidth}
                fill="none"
                markerEnd={`url(#arrowhead-${effectiveHoveredMapping === mapping.id ? 'hover' : 'normal'})`}
                className={isDragging ? '' : 'hover:stroke-2 hover:filter-drop-shadow-0-0-3px-rgba-33-150-243-0-5'}
              />

              <path
                d={pathData.path}
                stroke="transparent"
                strokeWidth="20"
                fill="none"
                className={isDragging ? '' : 'cursor-pointer'}
                onClick={() => !isDragging && removeMapping(mapping.id)}
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
                onMouseEnter={() => !isDragging && setHoveredMapping(hoveredMappingData.id)}
                onMouseLeave={() => !isDragging && setHoveredMapping(null)}
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
                  style={{ cursor: isDragging ? 'default' : 'pointer' }}
                  onClick={() => !isDragging && removeMapping(hoveredMappingData.id)}
                />

                <foreignObject
                  width="18"
                  height="18"
                  x={pathData.midX - 9}
                  y={pathData.midY - 9}
                  style={{ overflow: 'visible' }}
                  onClick={() => !isDragging && removeMapping(hoveredMappingData.id)}
                >
                  <div
                    className={`
                      w-4 h-4 border border-[var(--color-border-danger)] 
                      flex items-center justify-center bg-[var(--color-bg-mapping-primary)] 
                      rounded-full text-[var(--color-icon-danger)] shadow-sm 
                      transition-all duration-150
                      ${isDragging ? 'cursor-default opacity-50' : 'hover:shadow-md hover:scale-110 cursor-pointer'}
                    `}
                  >
                    <X
                      className={`
                      transition-all duration-150
                      ${isDragging ? 'w-2.5 h-2.5' : 'w-2.5 h-2.5 group-hover:w-3 group-hover:h-3'}
                    `}
                    />
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
