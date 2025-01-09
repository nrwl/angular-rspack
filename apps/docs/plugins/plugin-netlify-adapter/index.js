const { dirname, resolve, join } = require('path/posix');
const { cpSync } = require('fs');

module.exports = {
  onPostBuild: ({ constants }) => {
    console.log('onPostBuild - moving browser assets', constants);
    const browserDistFolder = resolve(constants.PUBLISH_DIR, 'browser');
    const destination = join(
      dirname(constants.INTERNAL_FUNCTIONS_SRC),
      'browser'
    );
    console.log(
      'onPostBuild - browserDist, destination, function dist',
      browserDistFolder,
      destination,
      constants.FUNCTIONS_DIST,
      constants.FUNCTIONS_SRC
    );
    cpSync(browserDistFolder, destination, {
      recursive: true,
    });
    console.log('onPostBuild - finished moving browser assets');
  },
};
