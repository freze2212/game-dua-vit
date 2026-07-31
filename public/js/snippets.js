function loadFinalManifestAWS(callBack,is1000)
{
	var userLogoPath = '/images/aws/logo/';
	var premium = '/js/premium0.js';

	try {
		if (urlData && urlData.language && urlData.language!=="english") {
			lib.properties.manifest.push({id:"language", src:"/language-files/"+urlData.language+".txt"});
		}

		var logoSrc = (urlData && urlData.logo) ? userLogoPath+urlData.logo+".png" : "/images/join.png";
		if (urlData) {
			urlData.userType = false;
			urlData.ownLogo = !!(urlData.logo);
		}
		lib.properties.manifest.push({id:"logo", src:logoSrc, crossOrigin:"Anonymous"});
	} catch (e) {
		console.warn('Manifest load error:', e);
	}

	if (typeof callBack === 'function') callBack();
}

function loadFinalManifest(callBack)
{
	try {
		var logoSrc = (urlData && urlData.logo) ? "/user/logos/"+urlData.logo+".png" : "/images/join.png";
		if (urlData) {
			urlData.userType = false;
			urlData.ownLogo = !!(urlData.logo);
		}
		lib.properties.manifest.push({id:"logo", src:logoSrc});
	} catch (e) {}

	if (typeof callBack === 'function') callBack();
}
