/**事件控制器 */
import MainControl from "./MainControl";
class Control{
    constructor(){
        this.CONTROL = {
            MAIN: new MainControl()
        };
    }
}
export default new Control;