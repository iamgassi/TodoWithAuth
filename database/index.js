require('dotenv').config();
const {MONGO_URI}=process.env
module.exports.init=function()
{
  const mongoose = require('mongoose');
  mongoose.connect(MONGO_URI)


.then(function()            
{
  console.log("Mongo is connected ")
})
.catch(function(err)
{
  console.log(err+"error ocuured")
})
}

