import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SvgLineExtractor, generateSourceFields, generateTargetFields } from './utils';
import useTableMapping from './hooks/useTableMapping';

function TableMapping({
  sources = [],
  targets = [],
  initialMappings = [],
  sourceColumns = [],
  targetColumns = [],
  lineType = 'step',
  lineColor = '#2196F3',
  lineWidth = 2,
  hoverLineColor = '#ff5722',
  sourceTableStyle = {},
  targetTableStyle = {},
  tableHeaderStyle = {},
  tableCellStyle = {},
  connectorStyle = {},
  onMappingChange,
}: TableMappingProps) {
  const {
    getSourceFields,
    getTargetFields,
    getMappings,
    sameNameMapping,
    sameLineMapping,
    clearMappings,
    addMapping,
    removeMapping,
    updateSourceFields,
    updateTargetFields,
    updateMappings,
  } = useTableMapping();
  const svgRef = useRef<SVGSVGElement>(null);

  const sourceFields = getSourceFields();
  const targetFields = getTargetFields();
  const mappings = getMappings();

  // 현재 호버 중인 매핑 ID
  const [hoveredMapping, setHoveredMapping] = useState<string | null>(null);

  // 드래그 관련 상태
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
  // const [windowSize, setWindowSize] = useState({
  //   width: window.innerWidth,
  //   height: window.innerHeight,
  // });

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

  const handleResize = useCallback(() => {
    // setWindowSize({
    //   width: window.innerWidth,
    //   height: window.innerHeight,
    // });
    updateTableHeight();

    setForceUpdate((prev) => prev + 1);
  }, []);

  // 소스 연결점에서 드래그 시작
  const handleDragStart = (e: React.MouseEvent, sourceId: string) => {
    // 연결점 위치 계산
    const sourceEl = document.getElementById(`connector-${sourceId}`);
    if (!sourceEl) return;

    const rect = sourceEl.getBoundingClientRect();
    const containerRect = document.querySelector('.mapping-container')?.getBoundingClientRect();

    if (!containerRect) return;

    // 컨테이너를 기준으로 한 상대적 위치 계산
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

  // 드래그 진행 중
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

  // 드래그 종료
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

      // 연결점 위에 마우스가 있는지 확인 (15픽셀 반경 내)
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

  // 연결선 경로 생성 (선 타입에 따라 다르게 구현)
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
  }, []); // 필드 데이터가 변경될 때도 업데이트

  useEffect(() => {
    console.log(sourceFields, targetFields);
    updateSourceFields(generateSourceFields({ sources }));
    updateTargetFields(generateTargetFields({ targets }));
    updateMappings(initialMappings);
  }, []);

  console.log(sourceFields, targetFields);

  return (
    <div className="react-table-mapping">
      <div className="mapping-container">
        {/* 소스 테이블 */}
        <div className="table source-table" style={sourceTableStyle}>
          <div className="table-header" style={tableHeaderStyle}>
            {sourceColumns.map((column) => (
              <div key={column.key} className="header-cell">
                {column.title}
              </div>
            ))}
          </div>
          <div className="table-body">
            {sourceFields.map((field) => {
              const { id, key, ...rest } = field;

              return (
                <div key={id || key} className="table-row">
                  {Object.values(rest ?? {}).map((value) => (
                    <div className="cell" style={tableCellStyle}>
                      {value}
                    </div>
                  ))}

                  <div
                    id={`connector-${field.id}`}
                    className="connector source-connector"
                    style={connectorStyle}
                    onMouseDown={(e) => handleDragStart(e, field.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* SVG 매핑 선 - 리사이즈 시 강제 리렌더링하기 위해 key 속성 추가 */}
        <svg
          ref={svgRef}
          className="mapping-svg"
          style={{ height: `${tableHeight}px` }}
          onMouseMove={handleDrag}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          key={`svg-${forceUpdate}`}
        >
          {/* 매핑 연결선 */}
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
                    width="24"
                    height="24"
                    x={pathData.midX - 12}
                    y={pathData.midY - 12}
                    style={{ overflow: 'visible' }}
                  >
                    <svg xmlns="http://www.w3.org/1999/xhtml" className="delete-btn-circle">
                      ✕
                    </svg>
                  </foreignObject>
                )}
              </g>
            ) : null;
          })}

          {/* 드래그 중인 선 */}
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

          {/* 화살표 마커 정의 */}
          <defs>
            <marker id="arrowhead-normal" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill={lineColor} />
            </marker>
            <marker id="arrowhead-hover" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill={hoverLineColor} />
            </marker>
          </defs>
        </svg>

        {/* 타겟 테이블 */}
        <div className="table target-table" style={targetTableStyle}>
          <div className="table-header" style={tableHeaderStyle}>
            {targetColumns.map((column) => (
              <div key={column.key} className="header-cell">
                {column.title}
              </div>
            ))}
          </div>
          <div className="table-body">
            {targetFields.map((field) => {
              const { id, key, ...rest } = field;

              return (
                <div key={id || key} className="table-row">
                  {Object.values(rest ?? {}).map((value) => (
                    <div className="cell" style={tableCellStyle}>
                      {value}
                    </div>
                  ))}

                  <div id={`connector-${field.id}`} className="connector target-connector" style={connectorStyle}></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="button-container">
        <button onClick={sameLineMapping}>같은 행 연결하기</button>
        <button onClick={sameNameMapping}>같은 이름 연결하기</button>
        <button onClick={clearMappings}>연결 취소하기</button>
      </div>
    </div>
  );
}

export default TableMapping;
