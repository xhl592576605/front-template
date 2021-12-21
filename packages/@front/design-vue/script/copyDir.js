const childProcess = require('child_process');

const copyDir = (src, dist) => {
  // eslint-disable-next-line no-sparse-arrays
  childProcess.spawn('cp', ['-r', , src, dist]);
};

copyDir('./components', './docs');
