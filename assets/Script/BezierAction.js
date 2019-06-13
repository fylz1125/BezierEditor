
cc.Class({
    extends: cc.Component,

    properties: {
        target: cc.Node, //hhsf 
        ctrl1: cc.Node,
        ctrl2: cc.Node,
        duration: 2,
    },

    start () {
        this.oldPosition = this.node.position;
    },

    play() {
        let array = [ this.ctrl1.position, this.ctrl2.position, this.target.position];
        this.node.runAction(cc.bezierTo(this.duration, array));
    },

    reset() {
        this.node.position = this.oldPosition;
    },
});
