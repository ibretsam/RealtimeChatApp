const log = (...args: any[]) => {
  Array.from(args).forEach(arg => {
    if (typeof arg === 'object') {
      console.log(JSON.stringify(arg, null, 2));
    } else {
      console.log(arg);
    }
  });
};

const logError = (...args: any[]) => {
  Array.from(args).forEach(arg => {
    if (typeof arg === 'object') {
      console.error(JSON.stringify(arg, null, 2));
    } else {
      console.error(arg);
    }
  });
};

export {log, logError};
