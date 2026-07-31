createjs.Sound.play = function(a, b, d, e, f, g, h, i, j)
{
    if (!createjs.Sound.activePlugin)createjs.Sound.activePlugin={}
    if(createjs.Sound.activePlugin.context && createjs.Sound.activePlugin.context.state==="suspended")
    {
        createjs.Sound.activePlugin.context.resume();
    }
    var k;
    k = b instanceof Object || b instanceof createjs.PlayPropsConfig ? createjs.PlayPropsConfig.create(b) : createjs.PlayPropsConfig.create({
        interrupt: b,
        delay: d,
        offset: e,
        loop: f,
        volume: g,
        pan: h,
        startTime: i,
        duration: j
    });
    var l = createjs.Sound.createInstance(a, k.startTime, k.duration),
        m = createjs.Sound._playInstance(l, k);
    return m || l._playFailed(), l;
};

///window.devicePixelRatio = 1;


function createHiPPICanvas(width, height)
{
    const ratio = window.devicePixelRatio;
    const canvas = document.getElementById("canvas");

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.getContext("2d").scale(ratio, ratio);

    return canvas;
}




// function isIE()
// {
// 	var ua = window.navigator.userAgent;
// 	var msie = ua.indexOf("MSIE ");
//
// 	return (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))?true: false;
//
// 	return false;
// }
// function isEdge()
// {
// 	if (/Edge/.test(navigator.userAgent)) {
// 	   return true;
// 	}else{
// 		return false;
// 	}
// }

function getChromeVersion ()
{
    var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);

    return raw ? parseInt(raw[2], 10) : false;
}


if ((navigator.userAgent.toLowerCase().indexOf('firefox') > -1 || getChromeVersion()>=71) && createjs)
{
    createjs.Text.prototype._drawTextLine = function(ctx, text, y)
    {
        // Adjust text position only if textBaseline is "top"
        if (this.textBaseline === "top")
        {
            var lineHeight = this.lineHeight || this.getMeasuredLineHeight();
            y += lineHeight * 0.1; //we need 0.1 instead of 0.3 which is in the original fix
        }
        // Chrome 17 will fail to draw the text if the last param is included but null, so we feed it a large value instead:
        if (this.outline) { ctx.strokeText(text, 0, y, this.maxWidth||0xFFFF); }
        else { ctx.fillText(text, 0, y, this.maxWidth||0xFFFF); }
    };
}



var touchTrue = true;

setTimeout(function()
{

	$("#canvas").on('mousemove',function(e){e.preventDefault()});

	if(!('ontouchstart' in window) && navigator.maxTouchPoints > 0)
	{

		$(document).on('mousedown', 'input, textarea', function () {
			if (touchTrue) {
				createjs.Touch.disable(stage);
				touchTrue = false;
			}
		}).on('mouseup', 'input, textarea', function () {
			createjs.Touch.enable(stage);
			touchTrue = true;

		})

	}



},1000);
