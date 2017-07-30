/**
 * Created by tozawa on 2017/07/23.
 */

import {GridPaper} from "./GridPaper";

var BOARD_WIDTH = 6000;     // ボード幅
var BOARD_HEIGHT = 4000;    // ボード高さ
var GRID_SIZE = 50;
var INITIAL_ZOOM = 0.7;
var ZOOM_UNIT = 0.002;
var AVAILABLE_ZOOM_MIN = 0.2;
var AVAILABLE_ZOOM_MAX = 5;



function testNamedArgs({size = 'big', cords = { x: 0, y: 0 }, radius = 25} = {}) {
    console.log(size, cords, radius);
    // do some chart drawing
}

let gridPaper;

paper.install(window);
window.onload = function () {
    paper.install(window);
    paper.setup("myCanvas");

    gridPaper = new GridPaper("myCanvas", BOARD_WIDTH, BOARD_HEIGHT, GRID_SIZE,
        INITIAL_ZOOM, ZOOM_UNIT, AVAILABLE_ZOOM_MIN, AVAILABLE_ZOOM_MAX);

    // gridPaper.init();

    testNamedArgs({size: "small"});

    let canvasElem = $("#myCanvas")[0];

    $("#canvasSize")[0].innerHTML = "canvas size: " + canvasElem.width + ", " + canvasElem.height;
    $("#viewSize")[0].innerHTML = "view size: " + view.size.width + ", " + view.size.height;


    let tool = new Tool();

    tool.onMouseMove = (event) => {
        $("#eventPoint")[0].innerHTML = "event point: " + event.point.x + ", " + event.point.y;
        $("#delta")[0].innerHTML = "delta: " + event.delta.x + ", " + event.delta.y;
        $("#canvasSize")[0].innerHTML = "canvas size: " + canvasElem.width + ", " + canvasElem.height;
        $("#viewSize")[0].innerHTML = "view size: " + view.size.width + ", " + view.size.height;
    };

    tool.onMouseDown = (event) => {
        gridPaper.paperOnMouseDown(event);
        $("#downPoint")[0].innerHTML = "down point: " + event.downPoint.x + ", " + event.downPoint.y;
        $("#eventPoint")[0].innerHTML = "event point: " + event.point.x + ", " + event.point.y;
    };

    tool.onMouseDrag = (event) => {
        gridPaper.paperOnMouseDrag(event);
        $("#viewRange")[0].innerHTML = "view range: (" + gridPaper.viewCenterMin.x + "," + gridPaper.viewCenterMin.y + ") - (" + gridPaper.viewCenterMax.x + "," + gridPaper.viewCenterMax.y + ")";
        $("#viewCenter")[0].innerHTML = "view center: " + view.center.x + ", " + view.center.y;
    };

    tool.onMouseUp = (event) => {
        gridPaper.paperOnMouseUp(event);
        $("#downPoint")[0].innerHTML = "down point: " + event.downPoint.x + ", " + event.downPoint.y;
        $("#eventPoint")[0].innerHTML = "event point: " + event.point.x + ", " + event.point.y;
    };

    window.addEventListener('mousemove', function(e){
        gridPaper.windowOnMouseMove(e);

        $("#cursorPoint")[0].innerHTML = "cursor point: " + gridPaper.cursorPoint.x + ", " + gridPaper.cursorPoint.y;
        $("#cursorDelta")[0].innerHTML = "cursor delta: " + gridPaper.cursorDelta.x + ", " + gridPaper.cursorDelta.y;
        $("#canvasPoint")[0].innerHTML = "canvas point: " + gridPaper.canvasPoint.x + ", " + gridPaper.canvasPoint.y;
    });

    window.addEventListener("mousewheel", function(e) {
        gridPaper.windowOnMouseWheel(e);

        $("#viewSize")[0].innerHTML = "view size: " + view.size.width + ", " + view.size.height;
    });


};
