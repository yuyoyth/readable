# 安装启动项目

先安装启动API服务器，在`api-server`文件夹下运行以下命令

* `npm install`
* `node server`

如果已有API服务器，更改`src/utils/api.js`文件如下

```
const api = '你的服务器地址'
```

在根目录下运行以下命令安装项目依赖并启动项目

* `npm install`
* `npm start`