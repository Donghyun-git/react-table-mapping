import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SvgLineExtractor } from './utils';
import { useMappings, useTargetFields } from './contexts';

import {
  defaultSourceTableStyle,
  defaultTargetTableStyle,
  defaultTableHeaderStyle,
  defaultTableCellStyle,
  defaultConnectorStyle,
} from './style/default-style';

import SourceTable from './components/SourceTable';
import TargetTable from './components/TargetTable';
import MappingLines from './components/MappingLines';

function TableMapping({
  sources = [],
  targets = [],
  initialMappings = [],
  sourceColumns = [],
  targetColumns = [],
  lineType = 'straight',
  lineColor = '#2196F3',
  lineWidth = 1.5,
  hoverLineColor = '#ff5722',
  sourceTableStyle = defaultSourceTableStyle,
  targetTableStyle = defaultTargetTableStyle,
  tableHeaderStyle = defaultTableHeaderStyle,
  tableCellStyle = defaultTableCellStyle,
  connectorStyle = defaultConnectorStyle,
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

  const [tableHeight, setTableHeight] = useState(0);
  const [forceUpdate, setForceUpdate] = useState(0);

  const updateTableHeight = useCallback(() => {
    const sourceTable = document.querySelector('.source-table');
    const targetTable = document.querySelector('.target-table');

    if (sourceTable && targetTable) {
      const sourceHeight = sourceTable.getBoundingClientRect().height;
      const targetHeight = targetTable.getBoundingClientRect().height;
      const maxHeight = Math.max(sourceHeight, targetHeight);
      setTableHeight(maxHeight);
    }
  }, []);

  const handleResize = () => {
    updateTableHeight();
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
        // 이미 존재하는 매핑인지 확인
        const existingMapping = mappings.find((m) => m.source === dragging.sourceId && m.target === targetField.id);

        if (!existingMapping) {
          // 새 매핑 추가
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
    updateTableHeight();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // when field data is changed, update

  useEffect(() => {
    updateMappings(initialMappings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="react-table-mapping">
      <div className="mapping-container">
        {/* source table */}
        <SourceTable
          sources={sources}
          sourceColumns={sourceColumns}
          sourceTableStyle={sourceTableStyle}
          tableHeaderStyle={tableHeaderStyle}
          tableCellStyle={tableCellStyle}
          connectorStyle={connectorStyle}
          handleDragStart={handleDragStart}
        />

        {/* SVG mapping line - add key property to force re-render when resizing */}
        <svg
          ref={svgRef}
          className="mapping-svg"
          style={{ height: `${tableHeight}px` }}
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
        <TargetTable
          targets={targets}
          targetColumns={targetColumns}
          targetTableStyle={targetTableStyle}
          tableHeaderStyle={tableHeaderStyle}
          tableCellStyle={tableCellStyle}
          connectorStyle={connectorStyle}
        />
      </div>

      <div className="button-container">
        <button onClick={sameLineMapping}>같은 행 연결하기</button>
        <button onClick={() => sameNameMapping('name')}>같은 이름 연결하기</button>
        <button onClick={clearMappings}>연결 취소하기</button>
      </div>
    </div>
  );
}

export default TableMapping;
