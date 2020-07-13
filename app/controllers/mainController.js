const mongoose = require('mongoose');
const base62x = require('base62x');
const assert = require("assert");

const  url_reg = /^http(s?):\/\/(?:[A-za-z0-9-]+\.)+[A-za-z]{2,4}(?:[\/\?#][\/=\?%\-&~`@[\]\':+!\.#\w]*)?$/;

exports.example = () => 'hello world';

/**
 * 源链接存储短链接
 * @date 2020-07-13
 * @param {any} req { originalUrl: 原链接 }
 * @param {any} res
 * @returns {any}
 */
exports.loadShortUrl = async function (req, res) {
  const Link = mongoose.model('Link');
  const { originalUrl } = req.body;

  try {
    const isUrl = url_reg.test(originalUrl);
    assert(isUrl, '不合法连接');
    
    const urlInfo = await Link.findOneLink({originalUrl: originalUrl});
    if (urlInfo) {
      res.status(200).send({code: 200, shortUrl: urlInfo._id});
      return;
    }
    const encoded = base62x.encode(originalUrl);
    const shortUrl = encoded.substr(encoded.length - 6, encoded.length);

    await Link.createLink({ _id: shortUrl, originalUrl });
    res.status(200).send({code: 200, shortUrl});
  } catch (error) {
    console.log('loadShortUrl error', error);
    res.status(500).send({code: 500, msg: error.message});
  }
}

/**
 * 短链接转换长链接
 * @date 2020-07-13
 * @param {any} req { shortUrl: 短链接 } 
 * @param {any} res
 * @returns {any}
 */
exports.searchOriginalUrl = async function (req, res) {
  const Link = mongoose.model('Link');
  const { shortUrl } = req.params;

  try {
    const urlInfo = await Link.findOneLink({_id: shortUrl})
    if (urlInfo) {
      res.status(200).send({code: 200, originalUrl: urlInfo.originalUrl});
    } else {
      assert(!!urlInfo, '未找到短连接存储信息');
    }
  } catch (error) {
    console.log('loadShortUrl error', error);
    res.status(500).send({code: 500, msg: error.message});
  }
}
