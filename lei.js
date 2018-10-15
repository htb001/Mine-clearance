var aUl = document.getElementsByClassName("above")[0];
var bUl = document.getElementsByClassName("blow")[0];
var playBt = document.getElementsByClassName("play")[0];
var reBt = document.getElementsByClassName("replay")[0];
var lev = document.getElementsByClassName("level")[0];
var aP = lev.getElementsByTagName("p");
var time = document.getElementsByClassName("time")[0];
var residue = document.getElementsByClassName("residue")[0];
var tips = document.getElementsByClassName("tips")[0];
var tipText = document.getElementsByClassName("tip-text")[0];
var yesBtn = document.getElementsByClassName("yes")[0];
var noBtn = document.getElementsByClassName("no")[0];

var liNum,
    x,
    y,
    mineNum,
    bli,
    ali,
    count,
    nowActive,
    qiFlag = true,
    firstTime,
    nowTime,
    hardLevel = {
        type: "",
    },
    flag = false,
    li,
    li1;

var lW = 20;
var xlen,
    ylen,
    pos = [],
    timer = null;

chooseHard();

playGame();




//创建li及雷
function createPan() {
    aUl.style.display = "block";
    for (var i = 0; i < liNum; i++) {
        li = document.createElement("li");
        li1 = document.createElement("li");
        aUl.appendChild(li);
        bUl.appendChild(li1);
        aUl.style.width = xlen * 20 + 2 * xlen + "px";
        bUl.style.width = xlen * 20 + 2 * xlen + "px";
    }
    createLei(mineNum);
    writeHtml();

}

function createLei(mineNum) {
    //随机数在0-linum之间；
    bli = bUl.getElementsByTagName("li");
    ali = aUl.getElementsByTagName("li");
    for (var i = 0; i < mineNum; i++) {
        var ran = Math.floor(Math.random() * liNum);
        while (bli[ran].className) {
            ran = Math.floor(Math.random() * liNum);
        }
        bli[ran].className = "lei";

    }
}

function writeHtml() {
    count = "";
    for (var i = 0; i < liNum; i++) {
        ali[i].index = i;
        var pos1 = createCoord(i);
        var polen = pos1.length;
        if (bli[i].className == "lei") {
            bli[i].innerHTML = "";
        } else {
            for (var j = 0; j < polen; j++) {
                if (x[pos1[j][0]] && y[pos1[j][1]]) {
                    if (bli[pos1[j][0] + pos1[j][1] * xlen].className == "lei") {
                        count++;
                    }
                }
            }
            bli[i].innerHTML = count;
            count = "";
        }
    }
}

function createCoord(item) {
    var lx = item % xlen;
    var ly = Math.floor(item / xlen);

    var pos = [
        [lx - 1, ly - 1],
        [lx, ly - 1],
        [lx + 1, ly - 1],
        [lx - 1, ly],
        [lx + 1, ly],
        [lx - 1, ly + 1],
        [lx, ly + 1],
        [lx + 1, ly + 1]
    ];
    return pos;
}

function bindEvent() {
    var qiarr = [];
    aUl.onclick = function (e) {
        var event = e || window.event;
        var target = event.srcElement || event.target;
        var _index = target.index;
        judgrLei(_index);
    };
    aUl.oncontextmenu = function (e) {
        cancelHandle(e);
        var event = e || window.event;
        var target = event.srcElement || event.target;
        var _index = target.index;


        if (target.className == "") {
            if (qiFlag) {
                target.className = "littleflag";
                qiarr.push(_index);
                residue.innerHTML = parseInt(residue.innerHTML) - 1;
            }
        } else if (target.className == "littleflag") {
            target.className = "";
            for (var i = 0; i < qiarr.length; i++) {
                if (qiarr[i] == _index) {
                    qiarr.splice(i);
                }
            }
            residue.innerHTML = parseInt(residue.innerHTML) + 1;
        }

        if (residue.innerHTML == 0) {
            qiFlag = false;
            var num2 = 0;
            for (var j = 0; j < qiarr.length; j++) {
                if (bli[qiarr[j]].className == "lei") {
                    num2++;
                }
            }
            if (num2 == mineNum) {
                tipText.innerHTML = "游戏结束，耗时" + Math.floor((lastTime - firstTime) / 1000) + "s";
                tips.style.display = "block";
            }

        } else {
            qiFlag = true;
        }

    };
}

function cancelHandle(event) {
    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }
}


function judgrLei(item) {
    var pos2 = createCoord(item);
    var polen = pos2.length;
    if (bli[item].innerHTML == "") {
        if (bli[item].className == "lei") {
            gameOver();
        } else {
            if (ali[item].className == "") {
                ali[item].className = "transparent";
            }
            for (var j = 0; j < polen; j++) {
                if (x[pos2[j][0]] && y[pos2[j][1]] && ali[pos2[j][0] + pos2[j][1] * xlen].className != "transparent") {
                    ali[pos2[j][0] + pos2[j][1] * xlen].className = "transparent";
                    if (bli[pos2[j][0] + pos2[j][1] * xlen].innerHTML == "") {
                        judgrLei((pos2[j][0] + pos2[j][1] * xlen));
                    }


                }
            }
        }
    } else {
        ali[item].className = "transparent";
    }
}


function playGame() {
    yesBtn.onclick = playBt.onclick = function () {
        clearInterval(timer);
        tips.style.display = "none";
        if (hardLevel.type) {
            if (flag) {
                while (ali.length--) {
                    aUl.removeChild(ali[ali.length - 1]);
                }
                while (bli.length--) {
                    bUl.removeChild(bli[bli.length - 1]);
                }
            }
            // lev.style.display = "none";
            firstTime = new Date().getTime();
            timer = setInterval(function () {
                lastTime = new Date().getTime();
                time.innerHTML = Math.floor((lastTime - firstTime) / 1000);
            }, 1000);
            //简单liNum = 81，mineNum = 10,x = [1-9],y = [1-9]
            //困难的liNUm = 12*12, mineNum = 20, x = [1-12], y = [1-12]
            //神liNum = 15*15 ,mineNum = 30, x = [1-15], y = [1-15]
            switch (hardLevel.type) {
                case "rookie":
                    mineNum = 10;
                    x = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                    y = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                    xlen = x.length;
                    ylen = y.length;
                    liNum = xlen * ylen;
                    break;
                case "master":
                    mineNum = 20;
                    x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
                    y = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
                    xlen = x.length;
                    ylen = y.length;
                    liNum = xlen * ylen;
                    break;
                case "god":
                    mineNum = 30;
                    x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
                    y = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
                    xlen = x.length;
                    ylen = y.length;
                    liNum = xlen * ylen;
                    break;
            }
            residue.innerHTML = mineNum;
            createPan();
            bindEvent();
            flag = true;
        }
    };
    noBtn.onlick = function () {
        window.opener = null;
        window.open('', '_self');
        window.close();

    };


}

function chooseHard() {
    for (var i = 0; i < aP.length; i++) {
        aP[i].onclick = function () {
            if (nowActive) {
                nowActive.className = "";
            }
            this.className = "active";
            hardLevel.type = this.getAttribute("data");
            nowActive = this;
        };
    }
}

function gameOver() {
    clearInterval(timer);
    aUl.style.display = "none";
    nowActive.className = "";
    hardLevel.type = "";
    tipText.innerHTML = "游戏结束，是否要重新开始？";
    tips.style.display = "block";

}