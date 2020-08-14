const mongoose = require("mongoose");
const util = require("util");
const redis = require("redis");
const { nextTick } = require("process");
const redisUrl = "redis://127.0.0.1:";
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);




mongoose.Query.prototype.cache = function(options = {}){
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || ''); // should be number or string
  return this; // to become chainable
}




const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec =async function () {
  if(!this.useCache){
    return exec.apply(this , arguments)
  }

  const key = JSON.stringify(Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name,
  }));

  // see if we have value for key in redis
  const cacheValue = await client.hget(this.hashKey , key)
  //if we do return that
  if(cacheValue){
     const doc = JSON.parse(cacheValue)
    return Array.isArray(doc)
     ?doc.map( d => new this.model(d))
     : new this.model(doc);
  }
  //otherwise issue the query and store the result in redis

  const result = await exec.apply(this, arguments);

  //store result in redis
  client.hset(this.hashKey , key , JSON.stringify(result) , 'EX', 10);// cach for 10 socends

  return result;
};
// to use .find().cache({key:req.user.id})

module.exports = {
  clearHash(hashKey){
    client.del(JSON.stringify(hashKey));
  }
}
// to use clearHash(req.user.id);
// 
// or we can make middel were to add in post request or update to not forget this method
// 
// module.expoert = async (req , res , next) => {
//   await next();
//   clearHaxh(req.user.id)
// } 
// 
// 



