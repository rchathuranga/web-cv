var imageDataArray = [];
var canvasCount = 35;
let dust = new Audio('thanos_snap_js_file/thanos_dust.mp3');
let thanos_snap = new Audio('thanos_snap_js_file/thanos_snap.mp3');



const glove = document.querySelector(".infinity");
const snap = document.querySelector(".snap");

function INFINITYCLICK() {
    // Hide default glove
    glove.style.display = "none";
    snap.style.display = "block";
    // Show Snap animation
    snap.className = "snap";

    setTimeout(function () {
        snap.style.display = "none";
        glove.style.display = "block";
    },2000)
}



function SnapEffect(click_element,effect_element,timeWait,eventOption) {
    effect_element = $(effect_element);
    let event=function(){

        INFINITYCLICK();

        setTimeout(function () {
            thanos_snap.play();
        },700);
        eventOption();
        setTimeout(function () {
            dust.play();
        }, timeWait + 120);
        setTimeout(snap,timeWait);
    };
    $(click_element).click(event);
    function snap() {
        html2canvas(effect_element[0], {scale: 1}).then(canvas => {
            //capture all div data as image
            ctx = canvas.getContext("2d");
            var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            var pixelArr = imageData.data;
            createBlankImageData(imageData);
            //put pixel info to imageDataArray (Weighted Distributed)
            for (let i = 0; i < pixelArr.length; i += 4) {
                //find the highest probability canvas the pixel should be in
                let p = Math.floor((i / pixelArr.length) * canvasCount);
                let a = imageDataArray[weightedRandomDistrib(p)];
                a[i] = pixelArr[i];
                a[i + 1] = pixelArr[i + 1];
                a[i + 2] = pixelArr[i + 2];
                a[i + 3] = pixelArr[i + 3];
            }
            //create canvas for each imageData and append to target element;
            for (let i = 0; i < canvasCount; i++) {
                let c = newCanvasFromImageData(imageDataArray[i], canvas.width, canvas.height);
                c.classList.add("dust");
                $(effect_element).parent().append(c);
            }
            //clear all children except the canvas
            effect_element.not(".dust").fadeOut(3500);
            //apply animation
            $(".dust").each(function (index) {
                animateBlur($(this), 0.8, 800);
                setTimeout(() => {
                    animateTransform($(this), 500, -100, chance.integer({min: -15, max: 15}), 800 + (110 * index));
                }, 70 * index);
                //remove the canvas from DOM tree when faded
                $(this).delay(70 * index).fadeOut((110 * index) + 800, "easeInQuint", () => {
                    $(this).remove();
                });
            });
        });
    }
}

function weightedRandomDistrib(peak) {
    var prob = [], seq = [];
    for(let i=0;i<canvasCount;i++) {
        prob.push(Math.pow(canvasCount-Math.abs(peak-i),3));
        seq.push(i);
    }
    return chance.weighted(seq, prob);
}
function animateBlur(elem,radius,duration) {
    var r =0;
    $({rad:0}).animate({rad:radius}, {
        duration: duration,
        easing: "easeOutQuad",
        step: function(now) {
            elem.css({
                filter: 'blur(' + now + 'px)'
            });
        }
    });
}
function animateTransform(elem,sx,sy,angle,duration) {
    var td = tx = ty =0;
    $({x: 0, y:0, deg:0}).animate({x: sx, y:sy, deg:angle}, {
        duration: duration,
        easing: "easeInQuad",
        step: function(now, fx) {
            if (fx.prop == "x")
                tx = now;
            else if (fx.prop == "y")
                ty = now;
            else if (fx.prop == "deg")
                td = now;
            elem.css({
                transform: 'rotate(' + td + 'deg)' + 'translate(' + tx + 'px,'+ ty +'px)'
            });
        }
    });
}
function createBlankImageData(imageData) {
    for(let i=0;i<canvasCount;i++)
    {
        let arr = new Uint8ClampedArray(imageData.data);
        for (let j = 0; j < arr.length; j++) {
            arr[j] = 0;
        }
        imageDataArray.push(arr);
    }
}
function newCanvasFromImageData(imageDataArray ,w , h) {
    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    tempCtx = canvas.getContext("2d");
    tempCtx.putImageData(new ImageData(imageDataArray, w , h), 0, 0);

    return canvas;
}