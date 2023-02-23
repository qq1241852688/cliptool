import { has, keys } from "lodash";

class SelectedFrame {
    constructor(ele, data, content) {
        this.frames = null;//四方位点
        this.data = data;//元素对象数据
        this.ele = ele;//缩放盒子
        this.init(ele, data);
        this.content = content;//父元素环境
        console.log("data=", this.data)

    }
    init(ele, data) {
        let self = this;
        let frames = [];
        let fragment = document.createDocumentFragment();
        let minWH = 30;
        let cssArr = [
            {
                //左上
                top: 0, left: 0, transform: "translate(-50%, -50%)", id: "_left_top", cursor: "nw-resize",
                cb: function (obj) {
                    let changeW = obj.originW - obj.moveX;
                    let changeH = obj.originH - obj.moveY;
                    let changeLeft = obj.originLeft + obj.moveX;
                    let changeTop = obj.originTop + obj.moveY;
                    let minLeft = obj.originLeft + obj.originW - minWH;
                    let minTop = obj.originTop + obj.originH - minWH;
                    let maxWidth = data.x + data.width;
                    let maxHeight = data.y + data.height;
                    //边界处理
                    if (changeW <= minWH) {
                        changeW = minWH;
                        changeLeft = minLeft;
                    };
                    if (changeH <= minWH) {
                        changeH = minWH;
                        changeTop = minTop;
                    };
                    if (changeLeft <= 0) {
                        changeLeft = 0;
                        changeW = maxWidth;
                    }
                    if (changeTop <= 0) {
                        changeTop = 0;
                        changeH = maxHeight;
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
            },
            {
                //中上
                top: 0, left: "50%", transform: "translate(-50%, -50%)", id: "_center_top", cursor: "n-resize",
                cb: function (obj) {
                    let changeH = obj.originH - obj.moveY;
                    let changeTop = obj.originTop + obj.moveY;
                    let minTop = obj.originTop + obj.originH - minWH;
                    let maxHeight = data.y + data.height;

                    if (changeH <= minWH) {
                        changeH = minWH;
                        changeTop = minTop;
                    };

                    if (changeTop <= 0) {
                        changeTop = 0;
                        changeH = maxHeight;
                    }
                    ele.style.height = changeH + "px";
                    ele.style.top = changeTop + "px";
                    data.height = changeH;
                    data.y = changeTop;
                }
            },
            {
                //右上
                top: 0, right: 0, transform: "translate(50%, -50%)", id: "_right_top", cursor: "ne-resize",
                cb: function (obj) {
                    let changeW = obj.originW + obj.moveX;
                    let changeH = obj.originH - obj.moveY;
                    let changeTop = obj.originTop + obj.moveY;
                    let minTop = obj.originTop + obj.originH - minWH;
                    let maxHeight = data.y + data.height;
                    let maxWidth = data.boxWidth - data.x;

                    //边界处理
                    if (changeW <= minWH) {
                        changeW = minWH;
                    };

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
                    ele.style.width = changeW + "px";
                    ele.style.height = changeH + "px";
                    ele.style.top = changeTop + "px";
                    data.width = changeW;
                    data.height = changeH;

                    data.y = changeTop;

                }
            },
            {
                //左中
                top: "50%", left: 0, transform: "translate(-50%, -50%)", id: "_left_center", cursor: "e-resize",
                cb: function (obj) {
                    let changeW = obj.originW - obj.moveX;
                    let changeLeft = obj.originLeft + obj.moveX;
                    let minLeft = obj.originLeft + obj.originW - minWH;
                    let maxWidth = data.x + data.width;
                    if (changeW <= minWH) {
                        changeW = minWH;
                        changeLeft = minLeft;
                    };
                    if (changeLeft <= 0) {
                        changeLeft = 0;
                        changeW = maxWidth;
                    }
                    ele.style.width = changeW + "px";
                    ele.style.left = changeLeft + "px";
                    data.width = changeW;
                    data.x = changeLeft;
                    data.width = changeW;




                }
            },
            {
                //右中
                top: "50%", right: 0, transform: "translate(50%, -50%)", id: "_right_center", cursor: "e-resize",
                cb: function (obj) {
                    let changeW = obj.originW + obj.moveX;
                    let maxWidth = data.boxWidth - data.x;

                    if (changeW <= minWH) {
                        changeW = minWH;
                    };
                    if (changeW >= maxWidth) {
                        changeW = maxWidth;
                    };
                    ele.style.width = changeW + "px";
                    data.width = changeW;

                }
            },
            {
                //左下
                bottom: 0, left: 0, transform: "translate(-50%, 50%)", id: "_left_bottom", cursor: "ne-resize",
                cb: function (obj) {
                    let changeW = obj.originW - obj.moveX;
                    let changeH = obj.originH + obj.moveY;
                    let changeLeft = obj.originLeft + obj.moveX;
                    let minLeft = obj.originLeft + obj.originW - minWH;
                    let maxWidth = data.x + data.width;
                    let maxHeight = data.boxHeight - data.y;
                    //边界处理
                    if (changeW <= minWH) {
                        changeW = minWH;
                        changeLeft = minLeft;
                    };
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

                    ele.style.width = changeW + "px";
                    ele.style.height = changeH + "px";
                    ele.style.left = changeLeft + "px";
                    data.width = changeW;
                    data.height = changeH;
                    data.x = changeLeft;

                }
            },
            {
                //中下
                bottom: 0, left: "50%", transform: "translate(-50%, 50%)", id: "_center_bottom", cursor: "n-resize",
                cb: function (obj) {
                    let changeH = obj.originH + obj.moveY;
                    let maxHeight = data.boxHeight - data.y;

                    if (changeH <= minWH) {
                        changeH = minWH;
                    };
                    if (changeH >= maxHeight) {
                        changeH = maxHeight;
                    }
                    ele.style.height = changeH + "px";
                    data.height = changeH;

                }
            },
            {
                //右下
                bottom: 0, right: 0, transform: "translate(50%, 50%)", id: "_right_bottom", cursor: "nw-resize",
                cb: function (obj) {
                    let changeW = obj.originW + obj.moveX;
                    let changeH = obj.originH + obj.moveY;
                    let maxHeight = data.boxHeight - data.y;
                    let maxWidth = data.boxWidth - data.x;
                    //边界处理
                    if (changeW <= minWH) {
                        changeW = minWH;
                    };
                    if (changeH <= minWH) {
                        changeH = minWH;
                    }
                    if (changeH >= maxHeight) {
                        changeH = maxHeight;
                    }
                    if (changeW >= maxWidth) {
                        changeW = maxWidth;
                    };
                    ele.style.width = changeW + "px";
                    ele.style.height = changeH + "px";
                    data.width = changeW;
                    data.height = changeH;

                }
            },
        ]
        for (let i = 0; i < 8; i++) {
            let item = document.createElement("div");
            item.style.position = "absolute";
            item.style.width = "10px";
            item.style.height = "10px";
            item.style.backgroundColor = "red";
            item.style.cursor = cssArr[i].cursor;
            item.setAttribute("id", cssArr[i].id);

            if (cssArr[i].top !== undefined) item.style.top = cssArr[i].top;
            if (cssArr[i].left !== undefined) item.style.left = cssArr[i].left;
            if (cssArr[i].right !== undefined) item.style.right = cssArr[i].right;
            if (cssArr[i].bottom !== undefined) item.style.bottom = cssArr[i].bottom;
            item.style.transform = cssArr[i].transform;
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
                    cssArr[i].cb && cssArr[i].cb({ moveX, moveY, originW, originH, originLeft, originTop });
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
    changeStyle(style){
        const styleMap={
            color:(v)=>{this.setColor(v)},
            shape:(v)=>{this.setShape(v)},
            size:(v)=>{this.setSize(v)},
        }
        Object.keys(style).forEach(key=>{
            styleMap[key]&&styleMap[key](style[key]);
        })
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
                width: 5,
                height: 5
            },
            "small": {
                width: 10,
                height: 10
            },
            "medium": {
                width: 15,
                height: 15
            }
        }
        let w=(map[size]&&map[size].width)||10;
        let h=(map[size]&&map[size].height)||10;

        this.frames.forEach(item => {
            item.style.width = w+"px";
            item.style.height = h+"px";
        });
    }


}
export default SelectedFrame;