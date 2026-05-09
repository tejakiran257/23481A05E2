const { log } = require('../logging_middleware/logger');

// Priority Weights: Placement (3) > Result (2) > Event (1)
const getWeight = (type) => {
    switch (type) {
        case 'Placement': return 3;
        case 'Result': return 2;
        case 'Event': return 1;
        default: return 0;
    }
};

async function getTopNotifications(n = 10) {
    try {
        log('INFO', 'Fetching notifications from API...');
        
        // We use fetch which is built-in to newer Node.js versions (v18+)
        const response = await fetch('http://4.224.186.213/evaluation-service/notifications');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const notifications = data.notifications || [];

        log('INFO', `Fetched ${notifications.length} notifications. Sorting...`);

        // Sort by weight (descending) and then recency (descending)
        notifications.sort((a, b) => {
            const weightA = getWeight(a.Type);
            const weightB = getWeight(b.Type);

            if (weightA !== weightB) {
                // Higher weight comes first
                return weightB - weightA;
            }
            
            // If weights are equal, sort by Timestamp (newer comes first)
            const timeA = new Date(a.Timestamp).getTime();
            const timeB = new Date(b.Timestamp).getTime();
            return timeB - timeA;
        });

        const topN = notifications.slice(0, n);
        
        log('INFO', `Top ${n} Notifications:`);
        topN.forEach((notif, index) => {
            log('INFO', `${index + 1}. [${notif.Type}] ${notif.Message} (${notif.Timestamp})`);
        });

        return topN;
    } catch (error) {
        log('ERROR', `Failed to fetch or process notifications: ${error.message}`);
    }
}

// Execute
getTopNotifications(10);
