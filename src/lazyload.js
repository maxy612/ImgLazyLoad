/**
 * @LazyLoader {} 图片懒加载
 * @opts Object opts 配置项
 * 	1. parent 懒加载图片的父级容器
 * 	2. target 懒加载图片的元素（为IMG时，配置其src, 为其它元素时，为background-image）
 * 	3. errorImg 加载出错的默认图片
 * 	4. errorCol 加载出错的默认背景色
 * 	5. defaultImg 图片加载前的默认图片
 * 	6. throttle 图片懒加载检测滚动的时间间隔
 */

function LazyLoader (opts) {
	if (!(this instanceof LazyLoader)) {
		return new LazyLoader(opts);
	}
	this.errorImg = opts.errorImg || './images/error1.jpg';
	this.errorCol = opts.errorCol || '#f00';
	this.defaultImg = opts.defaultImg || './images/loading.gif';
	this.timer = null;
	this.opts = opts;
	this.throttle = opts.throttle || 500;
	this.init(opts);

	if (this.nodes.length > 0) {
		this.render();
	}

	var _this = this;

	this.scrollHandler = function () {
		if (_this.timer) {
			return false;
		}
		_this.timer = setTimeout(function () {
			clearTimeout(_this.timer);
			_this.timer = null;
			_this.render();
		}, _this.throttle);
	}

	if (window.addEventListener) {
		window.addEventListener('scroll', this.scrollHandler, false);
	} else {
		window.attachEvent('scroll', this.scrollHandler);
	}

	return this;
}

LazyLoader.prototype.init = function (opts) {
	this.parent = document.querySelector(opts.parent) || document.querySelector('body');
	this.nodes = [];

	if (!opts.target) {
		[].push.apply(this.nodes, this.parent.querySelectorAll('img[lazyimg]'));
	}

	switch (typeof opts.target) {
		case 'string':
			[].push.apply(this.nodes, this.parent.querySelectorAll(opts.target + '[lazyimg]') || this.parent.querySelectorAll('img[lazyimg]'));
			break;
		case 'object':
			if (Array.isArray(opts.target)) {
				if (opts.target.length > 0) {
					for (var i = 0, len = opts.target.length; i < len; i++) {
						[].push.apply(this.nodes, this.parent.querySelectorAll(opts.target[i] + '[lazyimg]'));
					}
				}
			}
			break;
	}

	return this;
}

LazyLoader.prototype.isInView = function (ele) {
	var clientHeight = document.documentElement.clientHeight,
		scrollTop = window.scrollY,
		clientWidth = document.documentElement.clientWidth,
		scrollLeft = window.scrollX,
		elePos = ele.getBoundingClientRect();

	// if (this.direction === 'row') {
	// 	return (elePos.left > 0 && elePos.left <= clientWidth) || (elePos.right > 0 && elePos.right < clientWidth);
	// } else {
	return (elePos.top > 0 && elePos.top <= clientHeight) || (elePos.bottom > 0 && elePos.bottom < clientHeight);
	// }
}

LazyLoader.prototype.render = function () {
	var imgEle = null, _this = this;
	for (var i = 0, len = this.nodes.length; i < len; i++) {
		imgEle = this.nodes[i];

		if (imgEle.getAttribute('lazyimg') && _this.defaultImg) {
			imgEle.src = _this.defaultImg;
		}
		
		(function (imgEle) {
			if (imgEle.getAttribute('lazyimg')) {
				if (_this.isInView(imgEle)) {
					var newImg = new Image();
					newImg.src = imgEle.getAttribute('lazyimg');
					newImg.onload = function () {
						if (imgEle.nodeName.toLowerCase() === 'img') {
							imgEle.src = newImg.src;
						} else {
							imgEle.style.backgroundImage = "url(" + newImg.src + ")";
						}

						newImg = null;
					};

					newImg.onerror = function () {
						if (imgEle.nodeName.toLowerCase() === 'img') {
							imgEle.src = _this.errorImg;
						} else {
							imgEle.style.backgroundColor = _this.errorCol;
						}
						newImg = null;
					};

					imgEle.removeAttribute('lazyimg');
				}
			}
		})(imgEle);
	}

	return this;
}

LazyLoader.prototype.check = function () {
	this.init(this.opts);
	this.render();
	return this;
}
