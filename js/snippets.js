function loadFinalManifestAWS(callBack,is1000)
{
	var userLogoPath = '/images/aws/logo/';
	var premium = '/js/premium0.js';

	function proceed(answer) {
		try {
			if (urlData && urlData.language && urlData.language!=="english") {
				lib.properties.manifest.push({id:"language", src:"/language-files/"+urlData.language+".txt"});
			}

			var logoSrc = (answer!=="1") ? "/images/join.png" : (urlData && urlData.logo ? userLogoPath+urlData.logo+".png" : "/images/join.png");
			if (urlData) {
				urlData.userType = (answer === "1");
				urlData.ownLogo = !!(urlData.logo);
			}
			lib.properties.manifest.push({id:"logo", src:logoSrc, crossOrigin:"Anonymous"});
			if (answer!=="1" && !is1000) {
				lib.properties.manifest.push({id:"premium0", src:'/js/premium0.js', crossOrigin:"Anonymous"});
			}
		} catch (e) {
			console.warn('Manifest load error:', e);
		}

		if (typeof callBack === 'function') callBack();
	}

	if (typeof $ === 'function' && $.ajax) {
		$.ajax({type: "GET", url: "/api/game-config", timeout: 2000})
			.done(function(answer) { proceed("0"); })
			.fail(function() { proceed("0"); });
	} else {
		proceed("0");
	}
}

function loadFinalManifest(callBack)
{
	function proceed(answer) {
		try {
			var logoSrc = (answer!=="1") ? "/images/join.png" : (urlData && urlData.logo ? "/user/logos/"+urlData.logo+".png" : "/images/join.png");
			if (urlData) {
				urlData.userType = (answer === "1");
				urlData.ownLogo = !!(urlData.logo);
			}
			lib.properties.manifest.push({id:"logo", src:logoSrc});
		} catch (e) {}

		if (typeof callBack === 'function') callBack();
	}

	if (typeof $ === 'function' && $.ajax) {
		$.ajax({url: "/api/game-config", timeout: 2000})
			.done(function(answer) { proceed("0"); })
			.fail(function() { proceed("0"); });
	} else {
		proceed("0");
	}
}

function isIE()
{
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");
	if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
		return true;
	}
	return false;
}
