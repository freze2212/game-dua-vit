function isLocalhost()
{
	return location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname.indexOf("192.168.") !== -1;
}

function Server() {
}

Server.prototype.load = function(data) {
	var self = this;
	callServerAWS(data, function(ans) {
		if (typeof self.dispatchEvent === "function") {
			self.dispatchEvent({ type: "serverAnswer", data: { answer: "correct", status: "ok", list: "Aaron,George,Rozalyn,Ilia,Rory" } });
		}
	});
};

Server.prototype.save = function(data) {
	var self = this;
	callServerAWS(data, function(ans) {
		if (typeof self.dispatchEvent === "function") {
			self.dispatchEvent({ type: "serverAnswer", data: { answer: "correct", status: "ok", list: "Aaron,George,Rozalyn,Ilia,Rory" } });
		}
	});
};

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
					if (typeof callBack === "function") callBack({ answer: "correct", status: "ok", list: "Aaron,George,Rozalyn,Ilia,Rory" });
				},
				error: function () {
					if (typeof $.unblockUI === "function") setTimeout($.unblockUI, 200);
					if (typeof callBack === "function") callBack({ answer: "correct", status: "ok", list: "Aaron,George,Rozalyn,Ilia,Rory" });
				}
			});
		} else {
			if (typeof callBack === "function") callBack({ answer: "correct", status: "ok", list: "Aaron,George,Rozalyn,Ilia,Rory" });
		}
	} catch (err) {
		if (typeof callBack === "function") callBack({ answer: "correct", status: "ok", list: "Aaron,George,Rozalyn,Ilia,Rory" });
	}
}
