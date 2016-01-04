export function toRadians(angle) {
    return Math.floor(angle) * (Math.PI / 180);
}

export function findPoint(angle, distance, ref) {
    let x = (distance * Math.cos(toRadians(angle))) + ref.x;
    let y = (distance * Math.sin(toRadians(angle))) + ref.y;
    return {x: x, y: y};
}

export function nextAngle(angle, num) {
    let inc = 360 / num;
    if( (angle + inc) > 360) {
        return (angle + inc) - 360;
    } else {
        return angle + inc;
    }
}