import { X } from 'lucide-react';
import { memo } from 'react';

import type { Mapping } from '@/types/table-mapping';

export interface MappingLinesProps {
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
              {/* actual view line */}
              <path
                d={pathData.path}
                stroke={lineColor}
                strokeWidth={lineWidth}
                fill="none"
                markerEnd={`url(#arrowhead-${effectiveHoveredMapping === mapping.id ? 'hover' : 'normal'})`}
                className="line-base"
              />

              {/* hover area */}
              <path
                d={pathData.path}
                strokeWidth={lineWidth + 4}
                className={`hover-area ${isDragging ? 'dragging' : ''}`}
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
              >
                {/* actual view line */}
                <path
                  d={pathData.path}
                  stroke={hoverLineColor}
                  strokeWidth={lineWidth + 0.5}
                  fill="none"
                  markerEnd="url(#arrowhead-hover)"
                  className="line-base"
                />

                {/* hover area */}
                <path
                  d={pathData.path}
                  strokeWidth={lineWidth + 4.5}
                  className={`hover-area ${isDragging ? 'dragging' : ''}`}
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
                  <div className={`mapping-delete-button ${isDragging ? 'dragging' : ''}`}>
                    <X className="mapping-delete-icon" />
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
