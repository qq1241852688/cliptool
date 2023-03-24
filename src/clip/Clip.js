import SelectedFrame from "./SelectedFrame"
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
        this.ele = ele;//父元素
        this.clipParams = params;//裁剪信息
        this.clipBox = null;//裁剪盒子
        this.maskBox = null;//遮罩
        this.rectElement = null;//裁剪区域
        this.selectedFrame = null;//缩放按钮
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
            leftBorder: clipObject.x,
        };
        this.rectElement.style.width = clipObject.width + "px";
        this.rectElement.style.height = clipObject.height + "px";
        this.rectElement.style.left = clipObject.x + "px";
        this.rectElement.style.top = clipObject.y + "px";
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
    changeClipParams(changeObj) {
        this.clipParams = Object.assign(this.clipParams, changeObj);
        this.renderAll();
    }
    setStyle(styleObject) {
        let map = {
            width: (v) => { this.clipParams.containerWidth = parseFloat(v); this.renderAll(this.clipParams); },
            height: (v) => { this.clipParams.containerHeight = parseFloat(v); this.renderAll(this.clipParams); },
            left: (v) => { this.clipBox.style.left = v },
            top: (v) => { this.clipBox.style.top = v },
        }
        Object.keys(styleObject).forEach(key => {
            map[key] && map[key](styleObject[key]);
        });

    }
    getClipData() {
        const { x, y, width, height, containerWidth, containerHeight } = this.clipParams;
        return { x, y, width, height, clipContainerWidth: containerWidth, clipContainerHeight: containerHeight };

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
            "random": {
                color: ` rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`,
                border: `2px solid rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`,
                type: "circle",
                size: "small"

            },
        }
        let arr = Object.keys(map);
        theme = theme || map[arr[Math.floor(Math.random() * arr.length)]];
        // console.log(theme);
        this.rectElement.style.border = theme.border;
        this.selectedFrame.changeStyle(theme);

    }
    setRatio(v) {
        this.clipParams.ratio = v;
        let ratio = (v).split(":");
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
export default Clip;
