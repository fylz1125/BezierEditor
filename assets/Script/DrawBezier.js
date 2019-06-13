let BezierAction = require('BezierAction');

cc.Class({
    editor: {
        executeInEditMode: true,
    },
    extends: cc.Component,

    properties: {
        bezierActions: [BezierAction],
        actionNode: cc.Node,
        duration: 2,
        params: {
            type: cc.String,
            multiline: true,
            get() {
                let params = this._getBezierParams();
                return JSON.stringify(params);
            }
        }
    },

    _getBezierParams() {
        let params = this.bezierActions.map((bezierAction) => {
            return [
                bezierAction.node.position,
                bezierAction.ctrl1.position,
                bezierAction.ctrl2.position,
                bezierAction.target.position,
            ]
        });
        return params;
    },

    start () {
        this.graphics = this.getComponent(cc.Graphics);
        this.bezierActions.forEach((bezierAction) => {
            this._registerNodeEvent(bezierAction);
        });
        this._onDrawBezierCurve();
    },

    _registerNodeEvent(bezierAction) {
        let array = [
            bezierAction.node,
            bezierAction.target,
            bezierAction.ctrl1,
            bezierAction.ctrl2,    
        ];
        array.forEach((node) => {
            node.on(cc.Node.EventType.POSITION_CHANGED, this._onDrawBezierCurve, this);
        });
    },

    _unregisterNodeEvent(bezierAction) {
        let array = [
            bezierAction.node,
            bezierAction.target,
            bezierAction.ctrl1,
            bezierAction.ctrl2,    
        ];
        array.forEach(node => node.targetOff(this)); 
    },

    onDestroy() {
        this.bezierActions.forEach((bezierAction) => {
            this._unregisterNodeEvent(bezierAction);
        });
    },

    _onDrawBezierCurve() {
        let haveRun = this.bezierActions.find(bezierAction => {
            return bezierAction.node.getNumberOfRunningActions();
        });
        if (haveRun) {
            return;
        }
        this.graphics.clear();
        this.bezierActions.forEach((bezierAction) => {
            this._drawOneBezier(bezierAction);    
        });
    },

    _drawOneBezier(bezierAction) {
        this._drawLine(bezierAction.node,  bezierAction.ctrl1,  cc.Color.RED);
        this._drawLine(bezierAction.target, bezierAction.ctrl2, cc.Color.RED);
        this.graphics.strokeColor = cc.Color.YELLOW;
        this.graphics.lineWidth = 4;
        this.graphics.moveTo(bezierAction.node.x, bezierAction.node.y);
        this.graphics.bezierCurveTo(
            bezierAction.ctrl1.x, bezierAction.ctrl1.y, 
            bezierAction.ctrl2.x, bezierAction.ctrl2.y, 
            bezierAction.target.x, bezierAction.target.y
        );
        this.graphics.stroke();
    },

    _drawLine(startNode, ctrlNode, color) {
        this.graphics.strokeColor = color;
        this.graphics.lineWidth = 2;
        this.graphics.moveTo(startNode.x, startNode.y);
        this.graphics.lineTo(ctrlNode.x, ctrlNode.y);
        this.graphics.stroke();
    },

    playBezierAction() {
        let params = this._getBezierParams();
        this.actionNode.position = params[0][0];
        let actions = params.map(param => {
            return cc.bezierTo(this.duration, param.slice(1));
        });
        this.actionNode.runAction(cc.sequence(actions));
        // let self = this;
        // let index = 0;
        // function playAction() {
        //     let param = params[index++];
        //     self.actionNode.position = param[0];
        //     let bezierTo = cc.bezierTo(self.duration, param.slice(1));
        //     let callFunc = cc.callFunc(() => {
        //         if (index >= params.length) {
        //             cc.log('播放完毕');
        //             return;
        //         }
        //         playAction();
        //     });
        //     self.actionNode.runAction(cc.sequence(bezierTo, callFunc));
        // }
        // playAction();
    }

});
