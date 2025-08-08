import React, { useCallback, useEffect, useRef, useState } from 'react';

import MappingLines from '@/components/MappingLines';
import SourceTable from '@/components/SourceTable';
import TargetTable from '@/components/TargetTable';
import { Button } from '@/components/ui/button';
import { useMappings, useTargetFields } from '@/contexts';
import { type TableMappingProps } from '@/types/table-mapping';
import { SvgLineExtractor } from '@/utils';

function TableMapping({
  sources = [],
  targets = [],
  initialMappings = [],
  sourceColumns = [],
  targetColumns = [],
  lineType = 'straight',
  lineColor = '#009bff',
  lineWidth = 1.5,
  containerMinHeight = 400,
  containerHeight = 400,
  hoverLineColor = '#e3f3ff',
  onMappingChange,
}: TableMappingProps) {
  const { mappings, sameNameMapping, sameLineMapping, clearMappings, addMapping, removeMapping, updateMappings } =
    useMappings();

  const { targetFields } = useTargetFields();

  const svgRef = useRef<SVGSVGElement>(null);

  /**
   * hovering mapping id
   */
  const [hoveredMapping, setHoveredMapping] = useState<string | null>(null);

  /**
   * dragging state
   */
  const [dragging, setDragging] = useState<{
    active: boolean;
    sourceId: string;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  }>({
    active: false,
    sourceId: '',
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
  });

  const [forceUpdate, setForceUpdate] = useState(0);

  const handleResize = () => {
    setForceUpdate((prev) => prev + 1);
  };

  /**
   * start dragging from source connector
   */
  const handleDragStart = (e: React.MouseEvent, sourceId: string) => {
    // calculate connector position
    const sourceEl = document.getElementById(`connector-${sourceId}`);
    if (!sourceEl) return;

    const rect = sourceEl.getBoundingClientRect();
    const containerRect = document.querySelector('.mapping-container')?.getBoundingClientRect();

    if (!containerRect) return;

    // calculate relative position based on container
    const startX = rect.right - containerRect.left;
    const startY = rect.top + rect.height / 2 - containerRect.top;

    setDragging({
      active: true,
      sourceId,
      startX,
      startY,
      currentX: startX,
      currentY: startY,
    });

    e.preventDefault();
    e.stopPropagation();
  };

  /**
   * dragging
   */
  const handleDrag = (e: React.MouseEvent) => {
    if (!dragging.active) return;

    const svgRect = svgRef.current?.getBoundingClientRect();
    if (!svgRect) return;

    const currentX = e.clientX - svgRect.left;
    const currentY = e.clientY - svgRect.top;

    setDragging({
      ...dragging,
      currentX,
      currentY,
    });

    e.preventDefault();
    e.stopPropagation();
  };

  /**
   * end dragging
   */
  const handleDragEnd = (e: React.MouseEvent) => {
    if (!dragging.active) return;

    const svgRect = svgRef.current?.getBoundingClientRect();
    if (!svgRect) {
      setDragging({ ...dragging, active: false });
      return;
    }

    const currentX = e.clientX - svgRect.left;
    const currentY = e.clientY - svgRect.top;

    for (const targetField of targetFields) {
      const targetEl = document.getElementById(`connector-${targetField.id}`);
      if (!targetEl) continue;

      const rect = targetEl.getBoundingClientRect();
      const targetX = rect.left - svgRect.left;
      const targetY = rect.top + rect.height / 2 - svgRect.top;

      // check if mouse is on connector (15px radius)
      const distance = Math.sqrt(Math.pow(currentX - targetX, 2) + Math.pow(currentY - targetY, 2));

      if (distance <= 15) {
        const existingMapping = mappings.find((m) => m.source === dragging.sourceId && m.target === targetField.id);

        if (!existingMapping) {
          addMapping(dragging.sourceId, targetField.id);
        }

        break;
      }
    }

    setDragging({ ...dragging, active: false });

    e.preventDefault();
    e.stopPropagation();
  };

  /**
   * create path based on line type
   */
  const createPath = useCallback(
    (sourceId: string, targetId: string) => {
      const sourceEl = document.getElementById(`connector-${sourceId}`);
      const targetEl = document.getElementById(`connector-${targetId}`);

      if (!sourceEl || !targetEl || !svgRef.current) return null;

      const sourceRect = sourceEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      const containerRect = document.querySelector('.mapping-container')?.getBoundingClientRect();

      if (!containerRect) return null;

      // 컨테이너를 기준으로 한 상대적 위치 계산
      const startX = sourceRect.right - containerRect.left;
      const startY = sourceRect.top + sourceRect.height / 2 - containerRect.top;
      const endX = targetRect.left - containerRect.left;
      const endY = targetRect.top + targetRect.height / 2 - containerRect.top;

      const path = SvgLineExtractor({ type: lineType, startX, startY, endX, endY });

      return {
        path,
        startX,
        startY,
        endX,
        endY,
        midX: startX + (endX - startX) / 2,
        midY: startY + (endY - startY) / 2,
      };
    },
    [lineType],
  );

  useEffect(() => {
    if (onMappingChange) {
      onMappingChange(mappings);
    }
  }, [mappings, onMappingChange]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  /**
   * initial mappings
   */
  useEffect(() => {
    if (initialMappings.length > 0) {
      const renderTimer = setTimeout(() => {
        updateMappings(initialMappings);

        setForceUpdate((prev) => prev + 1);
      }, 100);

      return () => clearTimeout(renderTimer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMappings]);

  return (
    <div className="react-table-mapping p-5 w-full h-full">
      <div
        className="mapping-container relative flex justify-between h-full rounded-sm bg-[var(--color-bg-mapping-primary)] overflow-auto"
        style={{
          height: `${containerHeight}px`,
          minHeight: `${containerMinHeight}px`,
        }}
      >
        {/* source table */}
        <SourceTable sources={sources} sourceColumns={sourceColumns} handleDragStart={handleDragStart} />

        {/* SVG mapping line - add key property to force re-render when resizing */}
        <svg
          ref={svgRef}
          className="mapping-svg flex-1 w-full  absolute top-0 left-0 right-0"
          style={{ height: `${containerHeight}px`, minHeight: `${containerMinHeight}px` }}
          onMouseMove={handleDrag}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          {/* mapping line */}
          <MappingLines
            mappings={mappings}
            createPath={(sourceId, targetId) => createPath(sourceId, targetId) ?? { path: '', midX: 0, midY: 0 }}
            lineColor={lineColor}
            lineWidth={lineWidth}
            hoverLineColor={hoverLineColor}
            removeMapping={removeMapping}
            forceUpdate={forceUpdate}
            hoveredMapping={hoveredMapping}
            setHoveredMapping={setHoveredMapping}
            isDragging={dragging?.active}
          />

          {/* dragging line */}
          {dragging.active && (
            <path
              d={
                lineType === 'straight'
                  ? `M ${dragging.startX} ${dragging.startY} L ${dragging.currentX} ${dragging.currentY}`
                  : lineType === 'step'
                    ? `M ${dragging.startX} ${dragging.startY} L ${dragging.startX + (dragging.currentX - dragging.startX) / 2} ${dragging.startY} L ${dragging.startX + (dragging.currentX - dragging.startX) / 2} ${dragging.currentY} L ${dragging.currentX} ${dragging.currentY}`
                    : `M ${dragging.startX} ${dragging.startY} C ${dragging.startX} ${dragging.startY}, ${dragging.currentX - 100} ${dragging.currentY}, ${dragging.currentX} ${dragging.currentY}`
              }
              stroke={lineColor}
              strokeWidth={lineWidth}
              strokeDasharray="5,5"
              fill="none"
            />
          )}

          {/* define arrow marker */}
          <defs>
            {/* normal arrow */}
            <marker
              id="arrowhead-normal"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="4"
              markerHeight="4"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10" fill="none" stroke={lineColor || '#3b82f6'} strokeWidth="1.5" />
            </marker>

            {/* hover arrow */}
            <marker
              id="arrowhead-hover"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="4"
              markerHeight="4"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10" fill="none" stroke={hoverLineColor || '#60a5fa'} strokeWidth="1.5" />
            </marker>
          </defs>
        </svg>

        {/* target table */}
        <TargetTable targets={targets} targetColumns={targetColumns} />
      </div>

      <div className="flex gap-2 items-center justify-center mt-5">
        <Button onClick={sameLineMapping}>Same Line Mapping</Button>
        <Button onClick={() => sameNameMapping('name')}>Same Name Mapping [ target filed : Name]</Button>
        <Button onClick={clearMappings}>Clear Mapping</Button>
      </div>
    </div>
  );
}

export default TableMapping;
