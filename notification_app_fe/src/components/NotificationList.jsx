const NotificationList = ({ items, seenList, onClickNotif }) => {
  if (!items || items.length === 0) {
    return <p style={{ color: '#666' }}>no alerts found right now.</p>;
  }

  const getTypeStyle = (t) => {
    let base = { padding: '3px 8px', borderRadius: '4px', fontSize: '12px', color: 'white', fontWeight: 'bold' };
    if(t === 'Placement') return { ...base, backgroundColor: '#2e7d32' };
    if(t === 'Result') return { ...base, backgroundColor: '#1976d2' };
    if(t === 'Event') return { ...base, backgroundColor: '#9c27b0' };
    return { ...base, backgroundColor: '#757575' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {items.map((item) => {
        let isRead = seenList.includes(item.ID);
        
        return (
          <div 
            key={item.ID} 
            style={{ 
              cursor: 'pointer',
              backgroundColor: isRead ? '#f0f0f0' : '#ffffff',
              border: '1px solid #e0e0e0',
              borderLeft: isRead ? '5px solid #ccc' : '5px solid #1976d2',
              marginBottom: '15px',
              padding: '15px',
              borderRadius: '6px',
              boxShadow: isRead ? 'none' : '0 2px 4px rgba(0,0,0,0.05)',
              opacity: isRead ? 0.7 : 1
            }}
            onClick={() => onClickNotif(item.ID)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '18px', fontWeight: isRead ? 'normal' : '500', color: '#222' }}>
                  {item.Message}
                </span>
                {!isRead && <span style={{ color: 'red', fontSize: '12px', marginLeft: '10px', fontWeight: 'bold' }}>New!</span>}
              </div>
              <span style={{ fontSize: '12px', color: '#888' }}>
                {item.Timestamp}
              </span>
            </div>
            
            <div style={{ marginTop: '10px' }}>
              <span style={getTypeStyle(item.Type)}>
                {item.Type}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationList;
