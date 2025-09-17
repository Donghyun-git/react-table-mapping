import { X } from 'lucide-react';
import { memo } from 'react';

import { useMappings } from '@/contexts';

export interface MappingLinesProps {
  lineColor: string;
  lineWidth: number;
  hoverLineColor: string;
  forceUpdate: number;
  hoveredMapping: string | null;
  isDragging: boolean;
  disabled: boolean;
  createPath: (sourceId: string, targetId: string) => { path: string; midX: number; midY: number };
  removeMapping: (mappingId: string) => void;
  setHoveredMapping: (id: string | null) => void;
  onBeforeMappingLineRemove?: (removeMappingId: string) => void | boolean;
  onAfterMappingLineRemove?: (removeMappingId: string) => void;
}

const MappingLines = memo(
  ({
    lineColor,
    lineWidth,
    hoverLineColor,
    forceUpdate,
    hoveredMapping,
    isDragging,
    disabled,
    createPath,
    removeMapping,
    setHoveredMapping,
    onBeforeMappingLineRemove,
    onAfterMappingLineRemove,
  }: MappingLinesProps) => {
    const { mappings } = useMappings();

    const effectiveHoveredMapping = isDragging ? null : hoveredMapping;

    const normalMappings = mappings.filter((mapping) => mapping.id !== effectiveHoveredMapping);
    const hoveredMappingData = mappings.find((mapping) => mapping.id === effectiveHoveredMapping);

    const handleMappingLineRemove = (mappingId: string) => {
      if (!isDragging && !disabled) {
        const shouldRemove = onBeforeMappingLineRemove?.(mappingId);

        if (shouldRemove === false) return;

        removeMapping(mappingId);

        onAfterMappingLineRemove?.(mappingId);
      }
    };
    return (
      <>
        {normalMappings.map((mapping) => {
          const pathData = createPath(mapping.source, mapping.target);

          return pathData ? (
            <g
              key={`${mapping.id}-${forceUpdate}`}
              style={{ pointerEvents: disabled ? 'none' : 'auto' }}
              className="mapping-line-group"
              data-testid={`mapping-line-${mapping.id}`}
              onMouseEnter={() => !isDragging && !disabled && setHoveredMapping(mapping.id)}
              onMouseLeave={() => !isDragging && !disabled && setHoveredMapping(null)}
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
                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                strokeWidth={lineWidth + 4}
                className={`hover-area ${isDragging && !disabled ? 'dragging' : ''}`}
                onClick={() => handleMappingLineRemove(mapping.id)}
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
                data-testid={`mapping-line-${hoveredMappingData.id}`}
                onMouseEnter={() => !isDragging && !disabled && setHoveredMapping(hoveredMappingData.id)}
                onMouseLeave={() => !isDragging && !disabled && setHoveredMapping(null)}
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
                  className={`hover-area ${isDragging && !disabled ? 'dragging' : ''}`}
                  onClick={() => handleMappingLineRemove(hoveredMappingData.id)}
                />

                <foreignObject
                  width="18"
                  height="18"
                  x={pathData.midX - 9}
                  y={pathData.midY - 9}
                  style={{ overflow: 'visible' }}
                  onClick={() => handleMappingLineRemove(hoveredMappingData.id)}
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
