export const log = (lvl, msg, extra = null) => {
    let t = new Date().toISOString();
    let prefix = `[${t}] [${lvl.toUpperCase()}]`;
    
    if (extra) {
        console.info(`${prefix} ${msg}`, extra);
    } else {
        console.info(`${prefix} ${msg}`);
    }
};
