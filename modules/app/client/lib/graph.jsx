export function toRadians(angle) {
    if(angle == 0) {
        return 360 * (Math.PI / 180);
    }
    return Math.floor(angle) * (Math.PI / 180);
}

export function findPoint(angle, distance, ref) {
    let x = (distance * Math.cos(toRadians(angle))) + ref.x;
    let y = (distance * Math.sin(toRadians(angle))) + ref.y;
    return {x: x, y: y};
}

export function nextAngle(angle, num) {
    angle = Math.ceil(angle);
    let inc = Math.ceil(360 / num);
    if( (angle + inc) > 360) {
        if((angle + inc) % 360 == 0){
            return 0;
        } else {
            return (angle + inc) - 360;
        }
    }  else {
        return angle + inc;
    }
}