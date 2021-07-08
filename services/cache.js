const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");

const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);

client.hget = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || ''); 
    return this;
}

mongoose.Query.prototype.exec = async function () {
    if(!this.useCache){
        return exec.apply(this, arguments);
    }

  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );

  const cachedValue = await client.hget(this.hashKey, key);

  if (cachedValue) {
    const doc = JSON.parse(cachedValue);

    return Array.isArray(doc) ? doc.map((d) => this.model(d)) : this.model(doc);
  }

  const result = await exec.apply(this, arguments);
  console.log("FrOM Mongo");
  client.hset(this.hashKey, key, JSON.stringify(result));

  return result;
};

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey))
    }
}
/* const redis = require('redis');


const cachedBlogs = await client.get(req.user.id);

if (cachedBlogs) {
  console.log('serving from cache');
  return res.send(JSON.parse(cachedBlogs));
}

const blogs = await Blog.find({ _user: req.user.id });

client.set(req.user.id, JSON.stringify(blogs)); */
