## 图片懒加载

### 技术说明
- 采用原生js编写，能进行图片懒加载加载失败后自动处理；
- 兼容性后期会进行修复，目前在chrome上没问题，其它待测
- 暴露了图片检查的接口，通过调用返回对象的check方法，可以在下拉加载时将新加载的图片懒加载

### 例子
```javascript 
 var LazyLoad = new LazyLoader({
      parent: '.container', // 图片列表的容器，默认是body
      target: ['img', 'p'], // 图片列表的元素，默认是img，当为其它标签时，设为其背景
      errorCol: '#ff0', // 当加载图片出错时，显示的背景颜色，用于非img元素
      errorImg: './images/error1.jpg', // 当加载图片出错时，显示的默认加载图片
      defaultImg: './images/loading.gif' // 图片开始加载到加载出来临时显示的图片
  });
```
### 备注
  - 可以通过LazyLoad.check检查图片列表，具体用法可查看test中的index.html
  - [demo](https://maxycode.github.io/ImgLazyLoad/test/)

