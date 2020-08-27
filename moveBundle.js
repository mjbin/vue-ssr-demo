// 剪切构建时生成的vue-ssr-server-bundle.json 文件
// 防止被覆盖
const fs = require('fs');
const path = require('path');

const resolve = file => path.resolve(__dirname, file);

// 复制和删除源文件
function handleMove(oldfile, newFile) {
  fs.copyFileSync(resolve(oldfile), newFile);
  fs.unlink(resolve(oldfile), (err) => {
    if (err) throw err;
  });
}

if (process.env.VUE_ENV === 'server') {
  // 先build服务端的时候把文件保存出来
  console.log('开始保存bundle文件');
  handleMove(resolve('./dist/vue-ssr-server-bundle.json'), './vue-ssr-server-bundle.json');
} else {
  // 把复制出来的文件迁回去
  console.log('开始迁回bundle文件');
  handleMove(resolve('./vue-ssr-server-bundle.json'), './dist/vue-ssr-server-bundle.json');
}
