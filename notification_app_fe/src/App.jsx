import { useState, useEffect } from 'react';
import { Container, Button, Box, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import NotificationList from './components/NotificationList';
import { log } from './logger';

function App() {
  const [page, setPage] = useState('all');
  const [data, setData] = useState([]);
  const [seen, setSeen] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [topN, setTopN] = useState(10);
  const [typeFilter, setTypeFilter] = useState('All');

  const loadData = async () => {
    setIsLoading(true);
    log('info', 'fetching from api...', { page, topN, typeFilter });
    
    try {
      let endpoint = 'http://4.224.186.213/evaluation-service/notifications';
      if (page === 'priority') {
        let p = new URLSearchParams();
        if (topN) p.append('limit', topN);
        if (typeFilter !== 'All') p.append('notification_type', typeFilter);
        endpoint += `?${p.toString()}`;
      }
      
      let res = await fetch(endpoint);
      if (!res.ok) throw new Error('api issue');
      let json = await res.json();
      
      let items = json.notifications || [];
      
      if (page === 'priority') {
        items.sort((a, b) => {
            let getW = (t) => t === 'Placement' ? 3 : (t === 'Result' ? 2 : 1);
            let wa = getW(a.Type);
            let wb = getW(b.Type);
            if (wa !== wb) return wb - wa;
            return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
        });
        
        if (typeFilter !== 'All') items = items.filter(x => x.Type === typeFilter);
        if (topN) items = items.slice(0, Number(topN));
      } else {
          items.sort((a,b) => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime());
      }
      
      setData(items);
      log('info', 'got the data', { count: items.length });
    } catch (err) {
      log('error', 'couldnt fetch, using fake data', { msg: err.message });
      let fakeData = [
        { "ID": "a1", "Type": "Result", "Message": "mid-sem", "Timestamp": "2026-04-22 17:51:30" },
        { "ID": "a2", "Type": "Placement", "Message": "CSX Corporation hiring", "Timestamp": "2026-04-22 17:51:18" },
        { "ID": "a3", "Type": "Event", "Message": "farewell", "Timestamp": "2026-04-22 17:51:06" }
      ];
      
      if (page === 'priority') {
         fakeData.sort((a, b) => {
            let getW = (t) => t === 'Placement' ? 3 : (t === 'Result' ? 2 : 1);
            let wa = getW(a.Type);
            let wb = getW(b.Type);
            if (wa !== wb) return wb - wa;
            return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
        });
        if (typeFilter !== 'All') fakeData = fakeData.filter(x => x.Type === typeFilter);
        if (topN) fakeData = fakeData.slice(0, Number(topN));
      }
      setData(fakeData);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [page, topN, typeFilter]);

  const handleView = (id) => {
    if(!seen.includes(id)) {
        setSeen([...seen, id]);
        log('info', `clicked notif ${id}`);
    }
  };

  return (
    <div>
      {/* custom header instead of mui appbar */}
      <div style={{ backgroundColor: '#1976d2', padding: '15px 20px', color: 'white', display: 'flex', alignItems: 'center' }}>
        <h2 style={{ margin: 0, flexGrow: 1, fontSize: '1.2rem' }}>Campus Alerts</h2>
        <div>
          <Button style={{ color: 'white' }} onClick={() => setPage('all')}>All</Button>
          <Button style={{ color: 'white' }} onClick={() => setPage('priority')}>Priority</Button>
        </div>
      </div>

      <Container sx={{ marginTop: '30px', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '24px', color: '#333' }}>
          {page === 'all' ? 'All Alerts' : 'Priority Inbox'}
        </h1>

        {page === 'priority' && (
          <Box sx={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
            <TextField 
              label="Show top" 
              type="number" 
              size="small"
              value={topN} 
              onChange={(e) => setTopN(e.target.value)} 
              sx={{ width: '100px' }}
            />
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Filter by</InputLabel>
              <Select
                value={typeFilter}
                label="Filter by"
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="All">Everything</MenuItem>
                <MenuItem value="Event">Event</MenuItem>
                <MenuItem value="Result">Result</MenuItem>
                <MenuItem value="Placement">Placement</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}

        {isLoading ? (
          <div style={{ marginTop: '20px', color: '#666' }}>loading...</div>
        ) : (
          <NotificationList 
            items={data} 
            seenList={seen} 
            onClickNotif={handleView} 
          />
        )}
      </Container>
    </div>
  );
}

export default App;
