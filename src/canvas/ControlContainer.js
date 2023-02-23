import Control from "../control/Control"
import SelectedFrame from "./SelectedFrame";
const MainControl = Control.CONTROL.MAIN;
class ControlContainer {
    constructor(newCanvas, originCanvas, content) {
        this.originCanvas = originCanvas;
        this.newCanvas = newCanvas;
        this.content = content;
        this.controlBox = null;
        this.init();

    }
    init() {
        this.controlBox = document.createElement("div");
        this.controlBox.style.position = "absolute";
        this.controlBox.style.width = this.content.canvas.width + "px";
        this.controlBox.style.height = this.content.canvas.height + "px";
        this.controlBox.style.top = 0;
        this.controlBox.style.left = 0;
        this.controlBox.setAttribute("id", "canvaslib_controlBox");

        let canvasBox = document.createElement("div");
        canvasBox.style.position = "relative";
        canvasBox.style.width = this.content.canvas.width + "px";
        canvasBox.setAttribute("id", "canvaslib_canvasBox");
        canvasBox.appendChild(this.controlBox);
        canvasBox.appendChild(this.newCanvas);
        const p = this.originCanvas.parentNode;
        p.replaceChild(canvasBox, this.originCanvas);
    }
    render(data) {
        let fragment = document.createDocumentFragment();
        let frameElements = [];//选中框
        let self = this;
        data.forEach(item => {
            console.log("item", item)
            let controlItem = document.createElement("div");
            controlItem.style.width = item.width + "px";
            controlItem.style.height = item.height + "px";
            controlItem.style.position = "absolute";
            controlItem.style.left = item.position.x + "px";
            controlItem.style.top = item.position.y + "px";
            controlItem.style.boxSizing = "border-box";
            controlItem.style.transformOrigin = "left top";
            let frameBox = controlItem.cloneNode();
            frameBox.style.width = item.width * item.transform.scaleX + "px";
            frameBox.style.height = item.height * item.transform.scaleY + "px";
            controlItem.style.transform = `scaleX(${item.transform.scaleX}) scaleY(${item.transform.scaleY}) `;
            let selectedFrame = new SelectedFrame(frameBox, controlItem, this.content, item);
            frameElements.push(selectedFrame);
            selectedFrame.display();
            fragment.append(controlItem);
            fragment.append(frameBox);


            controlItem.onmousedown = mousedown;
            function mousedown(event) {
                event.stopPropagation();
                event.preventDefault();
                console.log("mousedown")
                //清空所有及选中框
                frameElements.forEach(item => {
                    item.display();
                })
                item.selected = true;
                if (item.selected) {
                    //添加选中框
                    selectedFrame.show();
                }

                document.onmousemove = mousemove;
                let clientX = event.clientX;
                let clientY = event.clientY;
                let psX = parseFloat(controlItem.style.left);
                let psY = parseFloat(controlItem.style.top);
                // console.log(psX, psY)
                function mousemove(event) {
                    // console.log("move")
                    let moveX = event.clientX - clientX;
                    let moveY = event.clientY - clientY;
                    // console.log(moveX, moveY)
                    controlItem.style.left = psX + moveX + "px";
                    controlItem.style.top = psY + moveY + "px";
                    frameBox.style.left = psX + moveX + "px";
                    frameBox.style.top = psY + moveY + "px";
                    for (let i = 0; i < data.length; i++) {
                        if (data[i]._id === item._id) {
                            data[i].position.x = psX + moveX;
                            data[i].position.y = psY + moveY;
                        }
                    }
                    //重绘canvas
                    MainControl.emit(MainControl.REPAINT_CANVAS, data)
                }
                document.onmouseup = mouseup;
                function mouseup(event) {
                    document.onmousemove = null;
                    document.onmouseup = null;
                    // console.log("up", event)
                }
            }

        });
        self.controlBox.innerHTML = "";
        self.controlBox.appendChild(fragment);
    }
}
export default ControlContainer;