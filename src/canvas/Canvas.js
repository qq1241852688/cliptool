import Control from "../control/Control"
import { drawShapes } from "./Shapes"
import ControlContainer from "./ControlContainer";
const MainControl = Control.CONTROL.MAIN;
class Canvas {
    constructor(doc) {
        this.canvas = null;
        this.ctx = null;
        this.container = [];
        this.controlContainer = null;
        this.initCanvas(doc);

        MainControl.on(MainControl.CHANGE_CANVAS_CONTAINER, (data) => {
            this.changeCanvasContainer(data);
        })
        MainControl.on(MainControl.CHANGE_WH, (w, h) => {
            this.changeWHControl(w, h);
        })
        MainControl.on(MainControl.REPAINT_CANVAS, (data) => {
            this.repaintCanvas(data);
        })

    }
    /**重绘canvas */
    repaintCanvas(data) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        data.forEach(element => {
            drawShapes(element, this.ctx);
        });
    }
    /**画布元素改变 */
    changeCanvasContainer(data) {
        this.repaintCanvas(data);
        this.controlContainer.render(this.container);
    }
    _id = 0;

    initCanvas(doc) {
        let originCanvas = null;
        if (typeof doc === "string") {
            originCanvas = document.getElementById(doc);
        } else {
            originCanvas = doc;
        }

        let newCanvas = originCanvas.cloneNode(true);
        this.canvas = newCanvas;
        this.ctx = this.canvas.getContext("2d");
        this.controlContainer = new ControlContainer(newCanvas, originCanvas, this);



    }

    /**监听画布宽高 */
    changeWHControl(w, h) {
        // console.log(w,h)
        this.canvas.width = w;
        this.canvas.height = h;
        document.getElementById("canvaslib_controlBox").style.width = w + "px";
        document.getElementById("canvaslib_controlBox").style.height = h + "px";
        document.getElementById("canvaslib_canvasBox").style.width = w + "px";
        document.getElementById("canvaslib_canvasBox").style.height = h + "px";
    }

    /**改变元素宽高 */
    changeWH(w, h) {
        MainControl.emit(MainControl.CHANGE_WH, w, h);
    }
    /**清空画布 */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.container = [];
    }

    /**canvas转base64 */
    toDataURL(name, quality) {
        return this.canvas.toDataURL(name, quality);
    }
    /**添加元素 */
    add(data) {
        data._id = ++this._id;
        this.container.push(data);
        MainControl.emit(MainControl.CHANGE_CANVAS_CONTAINER, this.container);

    }
    /**删除元素 */
    remove(data) {
        console.log("delete", data);
    }
}
export default Canvas;
