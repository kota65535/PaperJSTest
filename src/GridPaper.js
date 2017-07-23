

export class GridPaper {

    constructor(canvasId, boardWidth, boardHeight, gridSize,
                initialZoom, zoomUnit, zoomMin, zoomMax) {
        this.canvasId = canvasId;
        this.canvasElem = $("#" + canvasId)[0];
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;
        this.gridSize = gridSize;

        this.cursorPoint;        // ページ上のマウスカーソルの位置
        this.cursorDelta;        // ページ上のマウスカーソルの前フレーム位置との差分
        this.canvasPoint;        // キャンバス上のマウスカーソルの位置
        this.viewCenterMin;      // ビュー中心点の最小(左上)位置
        this.viewCenterMax;      // ビュー中心点の最大(右下)位置
        this.initialViewSize;    // 初期ビューサイズ
        this.boardMin;           // ボードの最小(左上)位置
        this.boardMax;           // ボードの最大(右下)位置
        this.shouldModifyViewCenter = true;      // ビュー中心点が移動可能範囲を超えたときに修正するか否かのフラグ

        this.initialZoom = initialZoom;
        this.zoomUnit = zoomUnit;
        this.zoomMin = zoomMin;
        this.zoomMax = zoomMax;

        this._init();
    }

    _init() {
        this.initialViewSize = new Size(view.size);
        this.viewCenterMin = new Point(view.size.width - this.boardWidth / 2, view.size.height - this.boardHeight / 2);
        this.viewCenterMax = new Point(this.boardWidth / 2, this.boardHeight / 2);
        this.boardMin = new Point(view.size.width / 2 - this.boardWidth / 2, view.size.height / 2 - this.boardHeight / 2);
        this.boardMax = new Point(view.size.width / 2 + this.boardWidth / 2, view.size.height / 2 + this.boardHeight / 2);

        console.log("viewCenterMin ", this.viewCenterMin);
        console.log("viewCenterMax ", this.viewCenterMax);
        console.log("boardMin ", this.boardMin);
        console.log("boardMax ", this.boardMax);

        // center of the view at first
        new Path.Circle({
            center: view.center,
            radius: 50,
            fillColor: 'blue'
        });

        // right bottom of the view
        new Path.Circle({
            center: new Point(this.canvasElem.width, this.canvasElem.height),
            radius: 50,
            fillColor: 'blue'
        });

        // center of the board & top-left of the view at first
        new Path.Circle({
            center: new Point(0, 0),
            radius: 50,
            fillColor: 'blue'
        });


        // top-left of the board
        new Path.Circle({
            center: this.boardMin,
            radius: 100,
            fillColor: 'green'
        });

        // bottom-right of the board
        new Path.Circle({
            center: this.boardMax,
            radius: 100,
            fillColor: 'green'
        });

        // top-left of the center of view
        new Path.Circle({
            center: this.viewCenterMin,
            radius: 50,
            fillColor: 'red'
        });

        // bottom-right of the center of view
        new Path.Circle({
            center: this.viewCenterMax,
            radius: 50,
            fillColor: 'red'
        });

        this._createGrids(this.gridSize);

        this.scale(this.initialZoom);
    }

    _createGrids(size) {
        let rangeX = _.range(Math.floor(this.boardMin.x / size), Math.floor(this.boardMax.x / size));
        let rangeY = _.range(Math.floor(this.boardMin.y / size), Math.floor(this.boardMax.y / size));
        // 縦線
        rangeX.forEach( (i) => {
            let line = new Path.Line(new paper.Point(size * i, this.boardMin.y), new paper.Point(size * i, this.boardMax.y));
            if (i === 0) {
                line.strokeColor = 'red';
                line.strokeWidth = 3;
            } else if (i % 4 === 0) {
                line.strokeColor = 'grey';
                line.strokeWidth = 3;
            } else {
                line.strokeColor = 'grey';
            }
        });
        // 横線
        rangeY.forEach( (i) => {
            let line = new Path.Line(new paper.Point(this.boardMin.x, size*i), new paper.Point(this.boardMax.x, size*i));
            if (i === 0) {
                line.strokeColor = 'red';
                line.strokeWidth = 3;
            } else if (i % 4 ===0) {
                line.strokeColor = 'grey';
                line.strokeWidth = 3;
            } else {
                line.strokeColor = 'grey';
            }
        })
    }


    /**
     * Paper.js の Tool.onMouseDrag() で実行させるハンドラ。
     * カーソルの移動量に応じてビューを移動させる。
     * 移動量の算出にはキャンバス上のマウスカーソルの位置ではなく、ページ上の位置を利用する。
     * @param event
     */
    paperOnMouseDrag(event) {
        // 移動量をスケールに応じて変化させる
        let moveUnit = 1 / view.getScaling().x;
        let nextCenter = view.center.subtract(this.cursorDelta.multiply(moveUnit));

        if (this.shouldModifyViewCenter) {
            // ビューの中心点が移動可能領域からはみ出さないようにする
            if ( nextCenter.x < this.viewCenterMin.x ) {
                nextCenter = new Point(this.viewCenterMin.x, nextCenter.y);
            }
            if ( this.viewCenterMax.x < nextCenter.x ) {
                nextCenter = new Point(this.viewCenterMax.x, nextCenter.y);
            }
            if ( nextCenter.y < this.viewCenterMin.y ) {
                nextCenter = new Point(nextCenter.x, this.viewCenterMin.y);
            }
            if ( this.viewCenterMax.y < nextCenter.y ) {
                nextCenter = new Point(nextCenter.x, this.viewCenterMax.y);
            }
        }

        view.center = nextCenter;
    }


    /**
     * Windowの mousemove イベントで実行させるハンドラ。
     * ページ上のマウスカーソルの位置と、対応するキャンバス上のマウスカーソルの位置を更新する。
     * @param e
     */
    windowOnMouseMove(e) {
        // ページ上のマウスカーソルの位置を更新
        let cursorBefore = this.cursorPoint;
        this.cursorPoint = new Point(e.pageX, e.pageY);
        this.cursorDelta = this.cursorPoint.subtract(cursorBefore);

        // キャンバス上のマウスカーソルの位置を更新
        let point = paper.DomEvent.getOffset(e, this.canvasElem);
        this.canvasPoint = paper.view.viewToProject(point);

    }

    /**
     * Windowの mousewheel イベントで実行させるハンドラ。
     * ホイールの移動量に応じてビューを拡大・縮小する。
     * @param e
     */
    windowOnMouseWheel(e) {
        console.log("wheelDelta: " + e.wheelDelta);

        // scale()に与える率は、現在からの相対値
        let newRelativeScale = 1 + this.zoomUnit * e.wheelDelta;
        this.scale(newRelativeScale);
    }


    scale(newRelativeScale) {
        // 最大拡大率・最小縮小率を超えないようにする
        let newScale = view.getScaling().x * newRelativeScale;
        if (newScale < this.zoomMin) {
            newRelativeScale = this.zoomMin / view.getScaling().x;
        }
        if (this.zoomMax < newScale) {
            newRelativeScale = this.zoomMax / view.getScaling().x;
        }

        view.scale(newRelativeScale, this.canvasPoint);
        console.info("currentZoom: ", newScale);

        // ビューの端がボードの範囲を超えないよう、ビュー中心の移動可能範囲を変更する
        if (view.size.width < this.boardWidth && view.size.height < this.boardHeight) {
            this.viewCenterMin = new Point(
                this.initialViewSize.width / 2 + view.size.width / 2 - this.boardWidth / 2,
                this.initialViewSize.height / 2 + view.size.height / 2 - this.boardHeight / 2);
            this.viewCenterMax = new Point(
                this.initialViewSize.width / 2 - view.size.width / 2 + this.boardWidth / 2,
                this.initialViewSize.height / 2 - view.size.height / 2 + this.boardHeight / 2);
            this.shouldModifyViewCenter = true;
        } else {
            // ビューサイズがボードの幅または高さを超えた場合は、ビューの中心点の修正を行わない。
            this.shouldModifyViewCenter = false;
        }
    }
}

