let typesObject = {
    "rect": rectHandler,
    "image": imageHandler,
    "text": textHandler

}
/**绘制矩形 */
function rectHandler(data, ctx) {
    const { styles, position, transform } = data;
    const { width, height } = styles;
    const { x, y } = position;
    const { scaleX, scaleY } = transform;
    let w = scaleX * width, h = scaleY * height;
    ctx.fillRect(x, y, w, h);
}

/**绘制文本 */

function textHandler(data, ctx) {
    const { styles, position, transform, width, height, text } = data;
    const { x, y } = position;
    ctx.strokeStyle='skyblue';
    // ctx.strokeText(text,x,y);
    ctx.fillText(text, x, y);

}
/**绘制图片 */

function imageHandler(data, ctx) {
    const { styles, position, transform, image, width, height } = data;
    const { x, y } = position;
    let w = transform.scaleX * width;
    let h = transform.scaleX * height;
    ctx.drawImage(image, x, y, w, h);
}

export function drawShapes(data, ctx) {
    const { type } = data;
    let fn = typesObject[type];
    fn && fn(data, ctx);
}