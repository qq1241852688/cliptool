import Control from "../control/Control"
const MainControl = Control.CONTROL.MAIN;

class SelectedFrame {
    constructor(ele,controlBox ,content, data) {
        this.frames = null;//四方位点
        this.content = content;//Canvas this
        this.controlBox=controlBox;//元素盒子
        this.data = data;//元素对象数据
        this.ele = ele;//缩放盒子
        this.init(ele);
        console.log("data=", this.data)

    }
    init(ele) {
        let self = this;
        ele.style.pointerEvents = "none";
        ele.style.border = "2px solid blue";
        let frames = [];
        let fragment = document.createDocumentFragment();
        let cssArr = [
            { top: 0, left: 0, transform: "translate(-50%, -50%)" },
            { top: 0, left: "50%", transform: "translate(-50%, -50%)" },
            { top: 0, right: 0, transform: "translate(50%, -50%)" },
            { top: "50%", left: 0, transform: "translate(-50%, -50%)" },
            { top: "50%", right: 0, transform: "translate(50%, -50%)" },
            { bottom: 0, left: 0, transform: "translate(-50%, 50%)" },
            { bottom: 0, left: "50%", transform: "translate(-50%, 50%)" },
            { bottom: 0, right: 0, transform: "translate(50%, 50%)" },
        ]
        for (let i = 0; i < 8; i++) {
            let item = document.createElement("div");
            item.style.position = "absolute";
            item.style.width = "10px";
            item.style.height = "10px";
            item.style.backgroundColor = "red";
            item.style.pointerEvents = "auto";

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
                let scale = self.controlBox.style.transform ? self.controlBox.style.transform.match(/(\-|\+)?\d+(\.\d+)?/ig) : [1, 1]
                let originScaleX = Number(scale[0]);
                let originScaleY = Number(scale[1]);
                let clientX = event.clientX;
                let clientY = event.clientY;
                let divLength = self.controlBox.clientWidth + self.controlBox.clientHeight;

                // console.log(divLength)
                document.onmousemove = mousemove;
                function mousemove(event) {
                    // console.log("move")
                    let moveX = event.clientX - clientX;
                    let moveY = event.clientY - clientY;
                    let totalMove = Math.abs(moveX) + Math.abs(moveY);
                    let count = totalMove / divLength;
                    // console.log(count)
                    // console.log(moveX, moveY)
                    let scaleX, scaleY;
                    if (moveX > 0) {
                        scaleX = originScaleX + count;
                        scaleY = originScaleX + count;
                    } else {
                        if (originScaleY <= 0) scaleX = 0;
                        if (originScaleY <= 0) scaleY = 0;
                        scaleX = originScaleY - count;
                        scaleY = originScaleY - count;

                    }
                    self.controlBox.style.transform = `scaleX(${scaleX}) scaleY(${scaleY}) `;
                    ele.style.width=parseFloat(self.controlBox.style.width)*scaleX+"px";
                    ele.style.height=parseFloat(self.controlBox.style.height)*scaleY+"px";
                    //更新数据
                    self.data.transform.scaleX = scaleX;
                    self.data.transform.scaleY = scaleY;
                    //重绘canvas
                    MainControl.emit(MainControl.REPAINT_CANVAS, self.content.container)


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

    show() {
        this.ele.style.display = "block"
    }
    display() {
        this.ele.style.display = "none"
    }

}
export default SelectedFrame;