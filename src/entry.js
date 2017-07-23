/**
 * Created by tozawa on 2017/07/23.
 */

import {GridPaper} from "./GridPaper";

var BOARD_WIDTH = 6000;     // ボード幅
var BOARD_HEIGHT = 4000;    // ボード高さ
var GRID_SIZE = 50;
var INITIAL_ZOOM = 0.8;
var ZOOM_UNIT = 0.002;
var AVAILABLE_ZOOM_MIN = 0.2;
var AVAILABLE_ZOOM_MAX = 5;


paper.install(window);
window.onload = function () {
    paper.install(window);
    paper.setup("myCanvas");

    let gridPaper = new GridPaper("myCanvas", BOARD_WIDTH, BOARD_HEIGHT, GRID_SIZE,
        INITIAL_ZOOM, ZOOM_UNIT, AVAILABLE_ZOOM_MIN, AVAILABLE_ZOOM_MAX);

    gridPaper.init();

    var canvasWidth = $("#myCanvas")[0].width;
    var canvasHeight = $("#myCanvas")[0].height;

    $("#canvasSize")[0].innerHTML = "canvas size: " + $("#myCanvas")[0].width + ", " + $("#myCanvas")[0].height;
    $("#viewSize")[0].innerHTML = "view size: " + view.size.width + ", " + view.size.height;


    var tool = new Tool();

    tool.onMouseMove = function (event) {
        $("#eventPoint")[0].innerHTML = "event point: " + event.point.x + ", " + event.point.y;
        $("#delta")[0].innerHTML = "delta: " + event.delta.x + ", " + event.delta.y;
    }

    tool.onMouseDown = function (event) {
        $("#downPoint")[0].innerHTML = "down point: " + event.downPoint.x + ", " + event.downPoint.y;
        $("#eventPoint")[0].innerHTML = "event point: " + event.point.x + ", " + event.point.y;
    }

    tool.onMouseDrag = function (event) {
        gridPaper.paperOnMouseDrag(event);
    };


    window.addEventListener('mousemove', function(e){
        gridPaper.windowOnMouseMove(e);
    });


    // ホイールの移動量に応じてビューを拡大・縮小する。
    window.addEventListener("mousewheel", function(e) {
        gridPaper.windowOnMouseWheel(e);
    });

    view.scale(INITIAL_ZOOM, view.center);
};
