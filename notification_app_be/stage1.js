const { log } = require('../logging_middleware/logger');

const getWeight = (t) => {
    if(t === 'Placement') return 3;
    if(t === 'Result') return 2;
    if(t === 'Event') return 1;
    return 0;
};

async function getTopNotifications(n = 10) {
    try {
        log('info', 'starting to fetch from api...');
        
        let res = await fetch('http://4.224.186.213/evaluation-service/notifications');
        
        if (!res.ok) {
            throw new Error(`got error code: ${res.status}`);
        }
        
        let data = await res.json();
        let notifs = data.notifications;
        if(!notifs) notifs = [];

        log('info', `we got ${notifs.length} items. sorting them now...`);

        notifs.sort((x, y) => {
            let wx = getWeight(x.Type);
            let wy = getWeight(y.Type);

            if (wx !== wy) {
                return wy - wx; 
            }
            
            let tx = new Date(x.Timestamp).getTime();
            let ty = new Date(y.Timestamp).getTime();
            return ty - tx;
        });

        let finalNotifs = notifs.slice(0, n);
        
        log('info', `Here are the top ${n}:`);
        finalNotifs.forEach((item, i) => {
            log('info', `${i + 1}. [${item.Type}] ${item.Message} - ${item.Timestamp}`);
        });

        return finalNotifs;
    } catch (err) {
        log('error', `fetch failed: ${err.message}`);
    }
}

getTopNotifications(10);
