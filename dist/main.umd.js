(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.clipTool = {}));
})(this, (function (exports) { 'use strict';

    class SelectedFrame {
      constructor(ele, data, content) {
        this.frames = null; //四方位点
        this.data = data; //元素对象数据
        this.ele = ele; //缩放盒子
        this.init(ele, data);
        this.content = content; //父元素环境
        console.log("data=", this.data);
      }
      init(ele, data) {
        let self = this;
        let frames = [];
        let fragment = document.createDocumentFragment();
        let minWH = 20;
        let frameData = [{
          //左上
          top: 0,
          left: 0,
          transform: "translate(-50%, -50%)",
          id: "_left_top",
          cursor: "nw-resize",
          width: 10,
          height: 10,
          borderRadius: "50%",
          cb: function (obj) {
            let changeW = obj.originW - obj.moveX;
            let changeH = obj.originH - obj.moveY;
            let changeLeft = obj.originLeft + obj.moveX;
            let changeTop = obj.originTop + obj.moveY;
            let minLeft = obj.originLeft + obj.originW - minWH;
            let minTop = obj.originTop + obj.originH - minWH;
            let maxWidth = data.x + data.width;
            let maxHeight = data.y + data.height;

            //固定比例
            if (self.data.ratio !== "free") {
              let ratio = self.data.ratio.split(":");
              // console.log("ratio",ratio)
              let wr = ratio[0];
              let hr = ratio[1];
              //边界处理
              if (changeW <= minWH) {
                changeW = minWH;
                changeLeft = minLeft;
              }
              if (changeLeft <= 0) {
                changeLeft = 0;
                changeW = maxWidth;
              }
              changeH = changeW * hr / wr;
              changeTop = obj.originTop + (obj.originW - changeW) * hr / wr;
              if (changeTop <= 0) {
                changeTop = 0;
                changeH = maxHeight;
                changeW = changeH * wr / hr;
                changeLeft = obj.originLeft + (obj.originH - changeH) * wr / hr;
              }
            } else {
              //自由
              //边界处理
              if (changeW <= minWH) {
                changeW = minWH;
                changeLeft = minLeft;
              }
              if (changeH <= minWH) {
                changeH = minWH;
                changeTop = minTop;
              }
              if (changeLeft <= 0) {
                changeLeft = 0;
                changeW = maxWidth;
              }
              if (changeTop <= 0) {
                changeTop = 0;
                changeH = maxHeight;
              }
            }
            ele.style.width = changeW + "px";
            ele.style.height = changeH + "px";
            ele.style.left = changeLeft + "px";
            ele.style.top = changeTop + "px";
            data.width = changeW;
            data.height = changeH;
            data.x = changeLeft;
            data.y = changeTop;
          }
        }, {
          //中上
          top: 0,
          left: "50%",
          transform: "translate(-50%, -50%)",
          id: "_center_top",
          cursor: "n-resize",
          width: 20,
          height: 10,
          borderRadius: "15px",
          cb: function (obj) {
            let changeW = null;
            let changeH = obj.originH - obj.moveY;
            let changeLeft = null;
            let changeTop = obj.originTop + obj.moveY;
            let minTop = obj.originTop + obj.originH - minWH;
            let maxHeight = data.y + data.height;
            let maxWidth = data.x < data.containerWidth - (data.x + data.width) ? data.x * 2 + data.width : data.width + (data.containerWidth - (data.x + data.width)) * 2;
            if (self.data.ratio !== "free") {
              let ratio = self.data.ratio.split(":");
              let wr = ratio[0];
              let hr = ratio[1];
              //边界处理
              if (changeH <= minWH) {
                changeH = minWH;
                // changeLeft = minLeft;
                changeTop = minTop;
              }
              if (changeTop <= 0) {
                changeTop = 0;
                changeH = maxHeight;
              }
              changeW = changeH * wr / hr;
              changeLeft = obj.originLeft + (obj.originH - changeH) * wr / hr / 2;
              if (changeW >= maxWidth) {
                changeW = maxWidth;
                changeH = changeW * hr / wr;
                changeTop = obj.originTop + (obj.originW - changeW) * hr / wr;
                changeLeft = obj.originLeft + (obj.originH - changeH) * wr / hr / 2;
              }
              ele.style.width = changeW + "px";
              ele.style.height = changeH + "px";
              ele.style.left = changeLeft + "px";
              ele.style.top = changeTop + "px";
              data.width = changeW;
              data.height = changeH;
              data.x = changeLeft;
              data.y = changeTop;
            } else {
              if (changeH <= minWH) {
                changeH = minWH;
                changeTop = minTop;
              }
              if (changeTop <= 0) {
                changeTop = 0;
                changeH = maxHeight;
              }
              ele.style.height = changeH + "px";
              ele.style.top = changeTop + "px";
              data.height = changeH;
              data.y = changeTop;
            }
          }
        }, {
          //右上
          top: 0,
          right: 0,
          transform: "translate(50%, -50%)",
          id: "_right_top",
          cursor: "ne-resize",
          width: 10,
          height: 10,
          borderRadius: "50%",
          cb: function (obj) {
            let changeW = obj.originW + obj.moveX;
            let changeH = obj.originH - obj.moveY;
            let changeTop = obj.originTop + obj.moveY;
            let minTop = obj.originTop + obj.originH - minWH;
            let maxHeight = data.y + data.height;
            let maxWidth = data.containerWidth - data.x;
            if (self.data.ratio !== "free") {
              let ratio = self.data.ratio.split(":");
              let wr = ratio[0];
              let hr = ratio[1];
              //边界处理
              if (changeW <= minWH) {
                changeW = minWH;
              }
              if (changeW >= maxWidth) {
                changeW = maxWidth;
              }
              changeH = changeW * hr / wr;
              changeTop = obj.originTop + (obj.originW - changeW) * hr / wr;
              if (changeTop <= 0) {
                changeTop = 0;
                changeH = maxHeight;
                changeW = changeH * wr / hr;
              }
            } else {
              //边界处理
              if (changeW <= minWH) {
                changeW = minWH;
              }
              if (changeH <= minWH) {
                changeH = minWH;
                changeTop = minTop;
              }
              if (changeW >= maxWidth) {
                changeW = maxWidth;
              }
              if (changeTop <= 0) {
                changeTop = 0;
                changeH = maxHeight;
              }
            }
            ele.style.width = changeW + "px";
            ele.style.height = changeH + "px";
            ele.style.top = changeTop + "px";
            data.width = changeW;
            data.height = changeH;
            data.y = changeTop;
          }
        }, {
          //左中
          top: "50%",
          left: 0,
          transform: "translate(-50%, -50%)",
          id: "_left_center",
          cursor: "e-resize",
          width: 10,
          height: 20,
          borderRadius: "15px",
          cb: function (obj) {
            let changeW = obj.originW - obj.moveX;
            let changeH = null;
            let changeLeft = obj.originLeft + obj.moveX;
            let changeTop = null;
            let minLeft = obj.originLeft + obj.originW - minWH;
            let maxWidth = data.x + data.width;
            let maxHeight = data.y < data.containerHeight - (data.y + data.height) ? data.y * 2 + data.height : data.height + (data.containerHeight - (data.y + data.height)) * 2;
            if (self.data.ratio !== "free") {
              let ratio = self.data.ratio.split(":");
              let wr = ratio[0];
              let hr = ratio[1];
              //边界处理
              if (changeW <= minWH) {
                changeW = minWH;
                changeLeft = minLeft;
              }
              if (changeLeft < 0) {
                changeW = maxWidth;
                changeLeft = 0;
              }
              changeH = changeW * hr / wr;
              changeTop = obj.originTop + (obj.originW - changeW) * hr / wr / 2;
              if (changeH >= maxHeight) {
                changeH = maxHeight;
                changeW = changeH * wr / hr;
                changeTop = obj.originTop + (obj.originW - changeW) * hr / wr / 2;
                changeLeft = obj.originLeft + (obj.originH - changeH) * wr / hr;
              }
              ele.style.width = changeW + "px";
              ele.style.height = changeH + "px";
              ele.style.left = changeLeft + "px";
              ele.style.top = changeTop + "px";
              data.width = changeW;
              data.height = changeH;
              data.x = changeLeft;
              data.y = changeTop;
            } else {
              if (changeW <= minWH) {
                changeW = minWH;
                changeLeft = minLeft;
              }
              if (changeLeft <= 0) {
                changeLeft = 0;
                changeW = maxWidth;
              }
              ele.style.width = changeW + "px";
              ele.style.left = changeLeft + "px";
              data.width = changeW;
              data.x = changeLeft;
            }
          }
        }, {
          //右中
          top: "50%",
          right: 0,
          transform: "translate(50%, -50%)",
          id: "_right_center",
          cursor: "e-resize",
          width: 10,
          height: 20,
          borderRadius: "15px",
          cb: function (obj) {
            let changeW = obj.originW + obj.moveX;
            let changeH = null;
            let changeTop = null;
            let maxWidth = data.containerWidth - data.x;
            let maxHeight = data.y < data.containerHeight - (data.y + data.height) ? data.y * 2 + data.height : data.height + (data.containerHeight - (data.y + data.height)) * 2;
            if (self.data.ratio !== "free") {
              let ratio = self.data.ratio.split(":");
              let wr = ratio[0];
              let hr = ratio[1];
              //边界处理
              if (changeW <= minWH) {
                changeW = minWH;
              }
              if (changeW >= maxWidth) {
                changeW = maxWidth;
              }
              changeH = changeW * hr / wr;
              changeTop = obj.originTop + (obj.originW - changeW) * hr / wr / 2;
              if (changeH >= maxHeight) {
                changeH = maxHeight;
                changeW = changeH * wr / hr;
                changeTop = obj.originTop + (obj.originW - changeW) * hr / wr / 2;
              }
              ele.style.width = changeW + "px";
              ele.style.height = changeH + "px";
              ele.style.top = changeTop + "px";
              data.width = changeW;
              data.height = changeH;
              data.y = changeTop;
            } else {
              if (changeW <= minWH) {
                changeW = minWH;
              }
              if (changeW >= maxWidth) {
                changeW = maxWidth;
              }
            }
            ele.style.width = changeW + "px";
            data.width = changeW;
          }
        }, {
          //左下
          bottom: 0,
          left: 0,
          transform: "translate(-50%, 50%)",
          id: "_left_bottom",
          cursor: "ne-resize",
          width: 10,
          height: 10,
          borderRadius: "50%",
          cb: function (obj) {
            let changeW = obj.originW - obj.moveX;
            let changeH = obj.originH + obj.moveY;
            let changeLeft = obj.originLeft + obj.moveX;
            let minLeft = obj.originLeft + obj.originW - minWH;
            let maxWidth = data.x + data.width;
            let maxHeight = data.containerHeight - data.y;
            if (self.data.ratio !== "free") {
              let ratio = self.data.ratio.split(":");
              let wr = ratio[0];
              let hr = ratio[1];
              //边界处理
              if (changeW <= minWH) {
                changeW = minWH;
                changeLeft = minLeft;
              }
              if (changeLeft <= 0) {
                changeLeft = 0;
                changeW = maxWidth;
              }
              changeH = changeW * hr / wr;
              if (changeH >= maxHeight) {
                changeH = maxHeight;
                changeW = changeH * wr / hr;
                changeLeft = obj.originLeft + (obj.originH - changeH) * wr / hr;
              }
            } else {
              //边界处理
              if (changeW <= minWH) {
                changeW = minWH;
                changeLeft = minLeft;
              }
              if (changeH <= minWH) {
                changeH = minWH;
              }
              if (changeLeft <= 0) {
                changeLeft = 0;
                changeW = maxWidth;
              }
              if (changeH >= maxHeight) {
                changeH = maxHeight;
              }
            }
            ele.style.width = changeW + "px";
            ele.style.height = changeH + "px";
            ele.style.left = changeLeft + "px";
            data.width = changeW;
            data.height = changeH;
            data.x = changeLeft;
          }
        }, {
          //中下
          bottom: 0,
          left: "50%",
          transform: "translate(-50%, 50%)",
          id: "_center_bottom",
          cursor: "n-resize",
          width: 25,
          height: 10,
          borderRadius: "15px",
          cb: function (obj) {
            let changeH = obj.originH + obj.moveY;
            let changeW = null;
            let changeLeft = null;
            let maxHeight = data.containerHeight - data.y;
            let maxWidth = data.x < data.containerWidth - (data.x + data.width) ? data.x * 2 + data.width : data.width + (data.containerWidth - (data.x + data.width)) * 2;
            if (self.data.ratio !== "free") {
              let ratio = self.data.ratio.split(":");
              let wr = ratio[0];
              let hr = ratio[1];
              //边界处理
              if (changeH <= minWH) {
                changeH = minWH;
              }
              if (changeH >= maxHeight) {
                changeH = maxHeight;
              }
              changeW = changeH * wr / hr;
              changeLeft = obj.originLeft + (obj.originH - changeH) * wr / hr / 2;
              if (changeW >= maxWidth) {
                changeW = maxWidth;
                changeH = changeW * hr / wr;
                changeLeft = obj.originLeft + (obj.originH - changeH) * wr / hr / 2;
              }
              ele.style.width = changeW + "px";
              ele.style.height = changeH + "px";
              ele.style.left = changeLeft + "px";
              data.width = changeW;
              data.height = changeH;
              data.x = changeLeft;
            } else {
              if (changeH <= minWH) {
                changeH = minWH;
              }
              if (changeH >= maxHeight) {
                changeH = maxHeight;
              }
            }
            ele.style.height = changeH + "px";
            data.height = changeH;
          }
        }, {
          //右下
          bottom: 0,
          right: 0,
          transform: "translate(50%, 50%)",
          id: "_right_bottom",
          cursor: "nw-resize",
          width: 10,
          height: 10,
          borderRadius: "50%",
          cb: function (obj) {
            let changeW = obj.originW + obj.moveX;
            let changeH = obj.originH + obj.moveY;
            let maxHeight = data.containerHeight - data.y;
            let maxWidth = data.containerWidth - data.x;
            if (self.data.ratio !== "free") {
              let ratio = self.data.ratio.split(":");
              let wr = ratio[0];
              let hr = ratio[1];
              //边界处理
              if (changeW <= minWH) {
                changeW = minWH;
              }
              if (changeW >= maxWidth) {
                changeW = maxWidth;
              }
              changeH = changeW * hr / wr;
              if (changeH >= maxHeight) {
                changeH = maxHeight;
                changeW = changeH * wr / hr;
              }
            } else {
              //边界处理
              if (changeW <= minWH) {
                changeW = minWH;
              }
              if (changeH <= minWH) {
                changeH = minWH;
              }
              if (changeH >= maxHeight) {
                changeH = maxHeight;
              }
              if (changeW >= maxWidth) {
                changeW = maxWidth;
              }
            }
            ele.style.width = changeW + "px";
            ele.style.height = changeH + "px";
            data.width = changeW;
            data.height = changeH;
          }
        }];
        for (let i = 0; i < 8; i++) {
          let item = document.createElement("div");
          item.style.position = "absolute";
          item.style.width = frameData[i].width + "px";
          item.style.height = frameData[i].height + "px";
          item.style.borderRadius = frameData[i].borderRadius;
          item.style.backgroundColor = "white";
          item.style.cursor = frameData[i].cursor;
          item.setAttribute("id", frameData[i].id);
          if (frameData[i].top !== undefined) item.style.top = frameData[i].top;
          if (frameData[i].left !== undefined) item.style.left = frameData[i].left;
          if (frameData[i].right !== undefined) item.style.right = frameData[i].right;
          if (frameData[i].bottom !== undefined) item.style.bottom = frameData[i].bottom;
          item.style.transform = frameData[i].transform;
          //绑定缩放事件
          item.onmousedown = mousedown;
          function mousedown(event) {
            // console.log(event, item, ele)
            event.stopPropagation();
            event.preventDefault();
            let originW = parseFloat(ele.style.width);
            let originH = parseFloat(ele.style.height);
            let originLeft = parseFloat(ele.style.left);
            let originTop = parseFloat(ele.style.top);

            // console.log(originW,originH)
            let clientX = event.clientX;
            let clientY = event.clientY;
            document.onmousemove = mousemove;
            function mousemove(event) {
              // console.log(event)
              let moveX = event.clientX - clientX;
              let moveY = event.clientY - clientY;
              frameData[i].cb && frameData[i].cb({
                moveX,
                moveY,
                originW,
                originH,
                originLeft,
                originTop
              });
              self.content.renderAll(data);
            }
            document.onmouseup = mouseup;
            function mouseup(event) {
              document.onmousemove = null;
              document.onmouseup = null;
              // console.log("up", event)
            }
          }

          frames.push(item);
          fragment.append(item);
        }
        this.frames = frames;
        ele.appendChild(fragment);
      }
      changeStyle(style) {
        const styleMap = {
          color: v => {
            this.setColor(v);
          },
          shape: v => {
            this.setShape(v);
          },
          size: v => {
            this.setSize(v);
          }
        };
        Object.keys(style).forEach(key => {
          styleMap[key] && styleMap[key](style[key]);
        });
      }
      setColor(color) {
        this.frames.forEach(item => {
          item.style.backgroundColor = color;
        });
      }
      setShape(shape) {
        if (shape === "circle") {
          this.frames.forEach(item => {
            item.style.borderRadius = "100%";
          });
        } else {
          this.frames.forEach(item => {
            item.style.borderRadius = "0%";
          });
        }
      }
      setSize(size) {
        let map = {
          "mini": {
            scale: "scale(1)"
          },
          "small": {
            scale: "scale(1.4)"
          },
          "medium": {
            scale: "scale(1.8)"
          }
        };
        let scale = map[size] && map[size].scale || 1;
        // console.log(scale)

        this.frames.forEach(item => {
          let transform = item.style.transform;
          let matchT = item.style.transform.match(/scale.*?\)$/);
          item.style.transform = matchT ? transform.replace(matchT[0], scale) : transform + "" + scale;
        });
      }
    }

    class Clip {
      constructor(ele, params = {
        x: 50,
        y: 50,
        width: 100,
        height: 100,
        containerWidth: 300,
        containerHeight: 300,
        ratio: "free"
      }) {
        this.ele = ele; //父元素
        this.clipParams = params; //裁剪信息
        this.clipBox = null; //裁剪盒子
        this.maskBox = null; //遮罩
        this.rectElement = null; //裁剪区域
        this.selectedFrame = null; //缩放按钮
        if (this.clipParams.width > this.clipParams.containerWidth) this.clipParams.width = this.clipParams.containerWidth;
        if (this.clipParams.height > this.clipParams.containerHeight) this.clipParams.height = this.clipParams.containerHeight;
        this.init(this.clipParams);
      }
      init(clipObject = this.clipParams) {
        this.clipBox = document.createElement("div");
        this.clipBox.id = "_clipBox";
        this.clipBox.style.position = "absolute";
        this.clipBox.style.left = "0";
        this.clipBox.style.top = "0";
        this.clipBox.style.zIndex = "9999";
        this.maskBox = document.createElement("div");
        this.maskBox.style.border = "0px solid rgba(0,0,0,0.5)";
        this.clipBox.appendChild(this.maskBox);
        this.ele.appendChild(this.clipBox);
        this.createRect(clipObject);
        this.renderAll(clipObject);
      }
      renderAll(clipObject = this.clipParams) {
        // console.log(clipObject)
        if (clipObject.width > clipObject.containerWidth) clipObject.width = clipObject.containerWidth;
        if (clipObject.height > clipObject.containerHeight) clipObject.height = clipObject.containerHeight;
        if (clipObject.width + clipObject.x > clipObject.containerWidth) clipObject.x -= clipObject.width + clipObject.x - clipObject.containerWidth;
        if (clipObject.height + clipObject.y > clipObject.containerHeight) clipObject.y -= clipObject.height + clipObject.y - clipObject.containerHeight;
        let clipBoxObject = {
          width: clipObject.width,
          height: clipObject.height,
          topBorder: clipObject.y,
          rightBorder: clipObject.containerWidth - clipObject.x - clipObject.width,
          bottomBorder: clipObject.containerHeight - clipObject.y - clipObject.height,
          leftBorder: clipObject.x
        };
        this.rectElement.style.width = clipObject.width + "px";
        this.rectElement.style.height = clipObject.height + "px";
        this.rectElement.style.left = clipObject.x + "px";
        this.rectElement.style.top = clipObject.y + "px";
        this.maskBox.style.width = clipBoxObject.width + "px";
        this.maskBox.style.height = clipBoxObject.height + "px";
        this.maskBox.style.borderWidth = `${clipBoxObject.topBorder}px ${clipBoxObject.rightBorder}px ${clipBoxObject.bottomBorder}px ${clipBoxObject.leftBorder}px `;
      }
      createRect(clipObject) {
        let fragment = document.createDocumentFragment();
        let controlDom = document.createElement("div");
        let self = this;
        this.rectElement = controlDom;
        controlDom.style.width = clipObject.width + "px";
        controlDom.style.height = clipObject.height + "px";
        controlDom.style.position = "absolute";
        controlDom.style.left = clipObject.x + "px";
        controlDom.style.top = clipObject.y + "px";
        controlDom.style.boxSizing = "border-box";
        controlDom.style.transformOrigin = "left top";
        controlDom.style.border = "2px solid blue";
        controlDom.style.cursor = "move";

        //缩放按钮
        let selectedFrame = new SelectedFrame(controlDom, clipObject, this);
        this.selectedFrame = selectedFrame;
        fragment.append(controlDom);
        controlDom.onmousedown = mousedown;
        function mousedown(event) {
          event.stopPropagation();
          event.preventDefault();
          // console.log("mousedown")
          document.onmousemove = mousemove;
          let clientX = event.clientX;
          let clientY = event.clientY;
          let psX = parseFloat(controlDom.style.left);
          let psY = parseFloat(controlDom.style.top);
          function mousemove(event) {
            // console.log("move")
            let moveX = event.clientX - clientX;
            let moveY = event.clientY - clientY;
            // console.log(moveX, moveY)
            let left = psX + moveX;
            let top = psY + moveY;
            let maxLeft = clipObject.containerWidth - clipObject.width;
            let maxTop = clipObject.containerHeight - clipObject.height;
            //边界处理
            if (left <= 0) {
              left = 0;
            }
            if (top <= 0) {
              top = 0;
            }
            if (left >= maxLeft) {
              left = maxLeft;
            }
            if (top >= maxTop) {
              top = maxTop;
            }
            controlDom.style.left = left + "px";
            controlDom.style.top = top + "px";
            clipObject.x = left;
            clipObject.y = top;
            self.renderAll(clipObject);
          }
          document.onmouseup = mouseup;
          function mouseup() {
            document.onmousemove = null;
            document.onmouseup = null;
          }
        }
        self.clipBox.appendChild(fragment);
      }
      changeClipParams(changeObj) {
        this.clipParams = Object.assign(this.clipParams, changeObj);
        this.renderAll();
      }
      setStyle(styleObject) {
        let map = {
          width: v => {
            this.clipParams.containerWidth = parseFloat(v);
            this.renderAll(this.clipParams);
          },
          height: v => {
            this.clipParams.containerHeight = parseFloat(v);
            this.renderAll(this.clipParams);
          },
          left: v => {
            this.clipBox.style.left = v;
          },
          top: v => {
            this.clipBox.style.top = v;
          }
        };
        Object.keys(styleObject).forEach(key => {
          map[key] && map[key](styleObject[key]);
        });
      }
      getClipData() {
        const {
          x,
          y,
          width,
          height,
          containerWidth,
          containerHeight
        } = this.clipParams;
        return {
          x,
          y,
          width,
          height,
          clipContainerWidth: containerWidth,
          clipContainerHeight: containerHeight
        };
      }
      destroy() {
        this.ele.removeChild(this.clipBox);
      }
      show() {
        this.clipBox.style.display = "block";
      }
      hide() {
        this.clipBox.style.display = "none";
      }
      setTheme(theme) {
        let map = {
          "white": {
            color: "white",
            border: "2px solid black",
            type: "rectElement",
            size: "mini"
          },
          "red": {
            color: "red",
            border: "2px solid blue",
            type: "circle",
            size: "small"
          },
          "black": {
            color: "black",
            border: "2px solid white",
            type: "rectElement",
            size: "medium"
          },
          "blue": {
            color: "blue",
            border: "2px solid gray",
            type: "circle",
            size: "small"
          },
          "green": {
            color: "green",
            border: "2px solid black",
            type: "circle",
            size: "small"
          },
          "random": {
            color: ` rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`,
            border: `2px solid rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`,
            type: "circle",
            size: "small"
          }
        };
        let arr = Object.keys(map);
        theme = theme || map[arr[Math.floor(Math.random() * arr.length)]];
        // console.log(theme);
        this.rectElement.style.border = theme.border;
        this.selectedFrame.changeStyle(theme);
      }
      setRatio(v) {
        this.clipParams.ratio = v;
        let ratio = v.split(":");
        let wr = ratio[0];
        let hr = ratio[1];
        this.clipParams.height = this.clipParams.width * hr / wr;
        if (this.clipParams.height > this.clipParams.containerHeight) {
          this.clipParams.height = this.clipParams.containerHeight;
          this.clipParams.width = this.clipParams.height * wr / hr;
        }
        this.renderAll();
      }
    }

    exports.Clip = Clip;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
