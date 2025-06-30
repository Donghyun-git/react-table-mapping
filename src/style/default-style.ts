// 소스 테이블 기본 스타일
export const defaultSourceTableStyle = {
  minWidth: '400px',
  maxWidth: '600px',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  zIndex: 1,
  margin: '0 50px 0 0',
};

// 타겟 테이블 기본 스타일
export const defaultTargetTableStyle = {
  minWidth: '400px',
  maxWidth: '600px',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  zIndex: 1,
  margin: '0 0 0 50px',
};

// 테이블 헤더 기본 스타일
export const defaultTableHeaderStyle = {
  display: 'flex',
  backgroundColor: '#f5f5f5',
  borderBottom: '1px solid #e0e0e0',
  borderRadius: '8px 8px 0 0',
};

// 테이블 셀 기본 스타일
export const defaultTableCellStyle = {
  padding: '12px',
  fontSize: '14px',
  color: '#333',
};

// 커넥터 기본 스타일
export const defaultConnectorStyle = {
  position: 'absolute' as const,
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  backgroundColor: '#2196F3',
  border: '2px solid white',
  zIndex: 9999,
  cursor: 'pointer',
  boxShadow: '0 0 4px rgba(0, 0, 0, 0.2)',
  transition: 'all 0.2s ease',
};

// 버튼 컨테이너 스타일
export const buttonContainerStyle = {
  marginTop: '20px',
  display: 'flex',
  gap: '10px',
  justifyContent: 'center',
};

// 버튼 스타일
export const buttonStyle = {
  padding: '8px 16px',
  backgroundColor: '#4285f4',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: '500',
  fontSize: '14px',
  transition: 'background-color 0.2s',
};

// 버튼 호버 스타일
export const buttonHoverStyle = {
  backgroundColor: '#3367d6',
};

// 삭제 버튼 스타일
export const deleteBtnCircleStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '20px',
  height: '20px',
  backgroundColor: '#ff5252',
  color: 'white',
  borderRadius: '50%',
  margin: '3px',
  fontSize: '12px',
  cursor: 'pointer',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
  border: '2px solid white',
  transition: 'transform 0.2s, background-color 0.2s',
};
