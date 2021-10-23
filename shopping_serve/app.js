const express = require('express');
const app = express();

const compression = require('compression'); // gzip安装包

app.use(compression()); // 一定要写在 静态资源前面    
app.use(express.static('./dist')); // 托管静态目录 


app.listen(80, () => {
  console.log('server running at http://127.0.0.1');
})