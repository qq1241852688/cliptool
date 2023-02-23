import Event from "../libs/Event";
class MainControl extends Event {
    constructor() {
        super();
        this.CHANGE_WH = 'changeWH';//更改宽高
        this.CHANGE_CANVAS_CONTAINER = 'changeCanvasContainer';//画布有元素变化
        this.REPAINT_CANVAS = 'repaintCanvas';//画布有元素变化

        
    }

    /**宽度更改 */
    changeWH(w, h) {
        this.on(this.CHANGE_WH, w, h);
    }
    /**画布有元素变化 */
    changeCanvasContainer(obj) {
        this.on(this.CHANGE_CANVAS_CONTAINER, obj);
    }
    /**重绘canvas */
    repaintCanvas(){
        this.on(this.REPAINT_CANVAS, obj);
    }
}
export default MainControl;