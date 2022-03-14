

let controller;
let scene;
let slashHeight;
let plusHeight;

$(window).on('load', function () {
    slashHeight=$('#card-container').height();
    plusHeight=slashHeight+100;

    $('#header').css('background',$($('meta')[1]).attr('content'));

     controller = new ScrollMagic.Controller({
        vertical:true,
        loglevel: 3,
        refreshInterval:true
    });

    var cssPic={"transform": "translate(200px,0px) scale(0.2)"};
    var scene = new ScrollMagic.Scene({
        // triggerElement: "#card-container",
        duration: 100,
        offset: 5
    }).setTween(".pic-wrapper", cssPic)
        // .addIndicators()
        .addTo(controller);

    var bool = false;
    scene.on('end',function (event) {
        var css;
        if(bool){
            $('.pic-wrapper').css({visibility:'visible'});
            css={top: "-50px"};
            bool=false;
        }else {
            $('.pic-wrapper').css({visibility:'hidden'});
            css={top:0};
            bool=true;
        }
        $('#header').css(css);
    });


    ScrollReveal.debug = true;
    let scrollReveal = new ScrollReveal({
        reset:true,
    });


    var slideUp = {
        delay: 200,
        duration: 250,
        distance: '30px',
        interval: 600,
        reset: false,
    };

    ScrollReveal().reveal('.scrollreveal', slideUp);

    SnapEffect("#thanos img",".pic-wrapper",3000,function () {
        setTimeout(function () {
            $('body,html').animate({
                scrollTop: 0
            }, 800);
        },2000);
    });
});


