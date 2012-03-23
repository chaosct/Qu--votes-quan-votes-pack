/*
soziframes.js : transforming sozi SVG animations
    to a sequence of PNG images, so you can make
    a proper video without capturing the screen.

author: Carles F. Julià < chaos.ct _AT_ gmail com >

You need phantomjs to run it!
*/
var page = require('webpage').create(),
    address, output, size;

page.onConsoleMessage = function (msg) {
    console.log('>>> ' + msg);
};

if (phantom.args.length < 2 || phantom.args.length > 2) {
    console.log('Usage: soziframes.js SVG_URL duration(ms)');
    phantom.exit();
} else {
    address = phantom.args[0];
    duration = parseInt( phantom.args[1]) / 40 ;
    page.viewportSize = { width: 1280, height: 720 };
    page.onInitialized=function(){
        page.evaluate(function(){
            now = Date.now();
            Date.now = function(){return now;};
            window.setTimeout = function (fn,ms){
                timeoutfn = fn;
                timeoutms = ms;
            }; 
        });
    };
    page.open(address,function (status) {
        if (status !== 'success') {
            console.log('Unable to load the address!');
        } else {
            window.setTimeout(function () {
                var n = 0;
                page.render(n+".png");
                window.setInterval(function(t) {
                    console.log(n);
                    n +=1;
                    page.render(n+".png");
                    page.evaluate(function(){
                        now = now + 40;
                        if(timeoutfn){
                            timeoutms -=40;
                            if (timeoutms <=0){
                                timeoutfn();
                                timeoutfn = undefined;
                            }
                        }
                    });
                    if(n > duration){
                        phantom.exit();
                    }
                },40);    
                
            }, 200);
        }
    });
}
