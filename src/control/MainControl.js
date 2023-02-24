import Event from "../libs/Event";
class MainControl extends Event {
    constructor() {
        super();
        this.CHANGE_WH = 'changeWH';//更改宽高
    }

    /**宽度更改 */
    changeWH(w, h) {
        this.on(this.CHANGE_WH, w, h);
    }
 
}
export default MainControl;