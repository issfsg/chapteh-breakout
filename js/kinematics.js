function jump(obj) {
    obj.gravity = settings.gravity;
    obj.dirn = -obj.dirn;
    obj.vx = 2 * obj.dirn;
    obj.vy = 10;
    obj.omega = 10 * obj.dirn;
}