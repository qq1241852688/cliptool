import SelectedFrame from "./SelectedFrame"
class Clip {
    constructor(ele, params = {
        x: 50,
        y: 50,
        width: 100,
        height: 100,
        boxWidth: 300,
        boxHeight: 300,
    }) {
        this.ele = ele;//父元素
        this.params = params;//裁剪信息
        this.clipBox = null;//裁剪盒子
        this.maskBox = null;//遮罩
        this.rect = null;//裁剪区域
        this.selectedFrame = null;//缩放按钮
        this.createDom(params);


    }
    createDom(clipRect) {

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
        this.createRect(clipRect);
        this.renderAll(clipRect);
    }
    renderAll(clipRect) {
        // console.log(clipRect)
        let clipBoxObject = {};
        clipBoxObject.width = clipRect.width;
        clipBoxObject.height = clipRect.height;
        clipBoxObject.topBorder = clipRect.y;
        clipBoxObject.rightBorder = clipRect.boxWidth - clipRect.x - clipRect.width;
        clipBoxObject.bottomBorder = clipRect.boxHeight - clipRect.y - clipRect.height;
        clipBoxObject.leftBorder = clipRect.x;
        this.maskBox.style.width = clipBoxObject.width + "px";
        this.maskBox.style.height = clipBoxObject.height + "px";
        this.maskBox.style.borderWidth = `${clipBoxObject.topBorder}px ${clipBoxObject.rightBorder}px ${clipBoxObject.bottomBorder}px ${clipBoxObject.leftBorder}px `
    }
    createRect(clipRectObject) {
        let fragment = document.createDocumentFragment();
        let controlItem = document.createElement("div");
        let self = this;
        this.rect = controlItem;
        controlItem.style.width = clipRectObject.width + "px";
        controlItem.style.height = clipRectObject.height + "px";
        controlItem.style.position = "absolute";
        controlItem.style.left = clipRectObject.x + "px";
        controlItem.style.top = clipRectObject.y + "px";
        controlItem.style.boxSizing = "border-box";
        controlItem.style.transformOrigin = "left top";
        controlItem.style.border = "2px solid blue";
        //缩放按钮
        let selectedFrame = new SelectedFrame(controlItem, clipRectObject, this);
        this.selectedFrame = selectedFrame;
        fragment.append(controlItem);
        controlItem.onmousedown = mousedown;
        function mousedown(event) {
            event.stopPropagation();
            event.preventDefault();
            // console.log("mousedown")
            document.onmousemove = mousemove;
            let clientX = event.clientX;
            let clientY = event.clientY;
            let psX = parseFloat(controlItem.style.left);
            let psY = parseFloat(controlItem.style.top);
            function mousemove(event) {
                // console.log("move")
                let moveX = event.clientX - clientX;
                let moveY = event.clientY - clientY;
                // console.log(moveX, moveY)
                let left = psX + moveX;
                let top = psY + moveY;
                let maxLeft = clipRectObject.boxWidth - clipRectObject.width;
                let maxTop = clipRectObject.boxHeight - clipRectObject.height;
                //边界处理
                if (left <= 0) {
                    left = 0;
                }
                if (top <= 0) {
                    top = 0;
                }
                if (left >= maxLeft) {
                    left = maxLeft
                }
                if (top >= maxTop) {
                    top = maxTop;
                }
                controlItem.style.left = left + "px";
                controlItem.style.top = top + "px";
                clipRectObject.x = left;
                clipRectObject.y = top;
                self.renderAll(clipRectObject);

            }
            document.onmouseup = mouseup;
            function mouseup(event) {
                document.onmousemove = null;
                document.onmouseup = null;
                // console.log("up", event)
            }
        }

        self.clipBox.appendChild(fragment);


    }

    setStyle(styleObject) {
        let map = {
            width: (v) => { this.params.boxWidth = parseFloat(v); this.renderAll(this.params); },
            height: (v) => { this.params.boxHeight = parseFloat(v); this.renderAll(this.params); },
            left: (v) => { this.clipBox.style.left = v },
            top: (v) => { this.clipBox.style.top = v },
        }
        Object.keys(styleObject).forEach(key => {
            map[key] && map[key](styleObject[key]);
        });

    }
    getClipData() {
        return this.params;
      
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
                type: "rect",
                size:"mini",
            },
            "red": {
                color: "red",
                border: "2px solid blue",
                type: "circle",
                size:"small",


            },
            "black": {
                color: "black",
                border: "2px solid white",
                type: "rect",
                size:"medium"

            },
            "blue": {
                color: "blue",
                border: "2px solid gray",
                type: "circle",
                size:"small"

            },
            "green": {
                color: "green",
                border: "2px solid black",
                type: "circle",
                size:"small"

            },
        }
        let arr = Object.keys(map);
        theme = theme || map[arr[Math.floor(Math.random() * arr.length)]];
        this.rect.style.border = theme.border;
        this.selectedFrame.changeStyle(theme)

    }

}
export default Clip;
