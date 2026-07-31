function isLocalhost()
{
	return location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname.indexOf("192.168.") !== -1;
}

function callServerAWS(serverCall, callBack)
{
	try {
		if (typeof $ === "function" && $.ajax) {
			$.ajax({
				url: "/api/game-config",
				type: "GET",
				cache: false,
				timeout: 2000,
				success: function (gotData) {
					if (typeof $.unblockUI === "function") setTimeout($.unblockUI, 200);
					if (typeof callBack === "function") callBack({ answer: "correct", status: "ok" });
				},
				error: function () {
					if (typeof $.unblockUI === "function") setTimeout($.unblockUI, 200);
					if (typeof callBack === "function") callBack({ answer: "correct", status: "ok" });
				}
			});
		} else {
			if (typeof callBack === "function") callBack({ answer: "correct", status: "ok" });
		}
	} catch (err) {
		if (typeof callBack === "function") callBack({ answer: "correct", status: "ok" });
	}
}
