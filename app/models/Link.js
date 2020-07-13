/*
* 链接表
* */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LinkSchema = new Schema({
  _id: {type: String}, // 短域名做主键，有索引有唯一
  originalUrl: {type: String, index: true}, //源域名只做索引用
});

LinkSchema.static({
  /**
   * 添加短域名和源域名文档
   * @date 2020-07-13
   * @param {
   *  _id: String 短域名
   *  originalUrl: String 源域名
   * } 
   * @returns {any} 创建好的文档
  */
  createLink: function (data) {
    const Link = mongoose.model('Link');

    return new Promise((resolve, reject) => {
      Link.create(data, function (err, createRes) {
        if (err) {
          reject(err);
          return;
        }
        resolve(createRes);
      })
    })
  },  

  /**
   * 描述
   * @date 2020-07-13 查询单个文档方法
   * @param {any} filterObj={} 文档过滤条件
   * @param {any} selectString='' 文档需求字段
   * @returns {any} 文档内容
   */
  findOneLink: function (filterObj = {}, selectString = '') {
    const Link = mongoose.model('Link');

    return new Promise((resolve, reject) => {
      Link.findOne(filterObj)
        .select(selectString)
        .exec(function (err, infos) {
            if (err) {
              reject(err);
              return;
            }
            resolve(infos);
        })
    })
  },
})

mongoose.model('Link', LinkSchema);
