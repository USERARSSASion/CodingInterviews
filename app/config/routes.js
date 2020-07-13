const cors = require('cors');
const mainController = require('../controllers/mainController');

module.exports = function (app) {
  app.use(cors());

  app.get('/', function (req, res) {
    console.log('Hello world');
    res.status(200).send('success')
  });

  app.post('/loadShortUrl', mainController.loadShortUrl);
  app.get('/:shortUrl', mainController.searchOriginalUrl);
}
