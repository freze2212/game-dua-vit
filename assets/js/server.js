function isLocalhost()
{
	return location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname.indexOf("192.168.") !== -1;
}

function Server() {
}

Server.prototype.load = function(data) {
	var self = this;
	if (typeof self.dispatchEvent === "function") {
		self.dispatchEvent({ type: "serverAnswer", data: { answer: "correct", status: "ok", list: "Aaron,George,Rozalyn,Ilia,Rory" } });
	}
};

Server.prototype.save = function(data) {
	var self = this;
	if (typeof self.dispatchEvent === "function") {
		self.dispatchEvent({ type: "serverAnswer", data: { answer: "correct", status: "ok", list: "Aaron,George,Rozalyn,Ilia,Rory" } });
	}
};

function callServerAWS(serverCall, callBack)
{
	if (typeof callBack === "function") callBack({ answer: "correct", status: "ok", list: "Aaron,George,Rozalyn,Ilia,Rory" });
}
