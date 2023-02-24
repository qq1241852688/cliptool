import SelectedFrame from "./SelectedFrame"
class Clip {
    constructor(ele, params = {
        x: 50,
        y: 50,
        width: 100,
        height: 100,
        boxWidth: 300,
        boxHeight: 300,
        ratio:"free"
    }) {
        this.ele = ele;//父元素


        this.params = params;//裁剪信息
        this.clipBox = null;//裁剪盒子
        this.maskBox = null;//遮罩
        this.rectElement = null;//裁剪区域
        this.selectedFrame = null;//缩放按钮
        this.createDom(params);


    }
    createDom(clipObject) {
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
    renderAll(clipObject=this.params) {
        // console.log(clipObject)
        let clipBoxObject = {};
        clipBoxObject.width = clipObject.width;
        clipBoxObject.height = clipObject.height;
        clipBoxObject.topBorder = clipObject.y;
        clipBoxObject.rightBorder = clipObject.boxWidth - clipObject.x - clipObject.width;
        clipBoxObject.bottomBorder = clipObject.boxHeight - clipObject.y - clipObject.height;
        clipBoxObject.leftBorder = clipObject.x;
        this.rectElement.style.width = clipObject.width + "px";
        this.rectElement.style.height = clipObject.height + "px";
        this.maskBox.style.width = clipBoxObject.width + "px";
        this.maskBox.style.height = clipBoxObject.height + "px";
        this.maskBox.style.borderWidth = `${clipBoxObject.topBorder}px ${clipBoxObject.rightBorder}px ${clipBoxObject.bottomBorder}px ${clipBoxObject.leftBorder}px `
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
                let maxLeft = clipObject.boxWidth - clipObject.width;
                let maxTop = clipObject.boxHeight - clipObject.height;
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
        const { x, y, width, height, boxWidth, boxHeight } = this.params;
        return { x, y, width, height, boxWidth, boxHeight };

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
                size: "mini",
            },
            "red": {
                color: "red",
                border: "2px solid blue",
                type: "circle",
                size: "small",
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
        }
        let arr = Object.keys(map);
        theme = theme || map[arr[Math.floor(Math.random() * arr.length)]];
        this.rectElement.style.border = theme.border;
        this.selectedFrame.changeStyle(theme);

    }
    setRatio(v) {
        this.params.ratio = v;
        let ratio = (v).split(":");
        let wr = ratio[0];
        let hr = ratio[1];
        this.params.height=this.params.width*hr/wr;
        this.renderAll();

    }

}
export default Clip;
