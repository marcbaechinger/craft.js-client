/*global jQuery: false, alert: false, document: false, craftjs: false*/
(function (exports, $) {
	
	exports.craftjs.services = exports.craftjs.services || {};

	exports.craftjs.services.storeJob = function (job, callback) {
		$.ajax("/jobs", {
			type: "PUT",
			data: JSON.stringify(job),
			dataType: "json",
			contentType: "application/json",
			success: function (jsonData) {
				if (callback) {
					callback(jsonData);
				}
			}
		});
	};
	// FIXME remove dependency to craftjs.data.dist
	exports.craftjs.services.release = function (job, callback) {
		$.ajax("/release", {
			type: "POST",
			data: JSON.stringify(job),
			dataType: "json",
			contentType: "application/json",
			error: function (res) {
				if (callback) {
					callback(undefined, res);
				} else {
					console.log(res);
				}
			},
			success: function (res) {
				if (callback) {
					callback(res);
				} else {
					console.log("res", res);
					document.location = "/" + craftjs.data.dist + "/" + res.path;
				}
			}
		});
	};


	exports.craftjs.services.deleteRelease = function (path, callback) {
		$.ajax("/project/build" + path, {
			type: "DELETE",
			dataType: "json",
			contentType: "application/json",
			success: function (jsonData) {
				if (callback && jsonData.status === "OK") {
					callback();
				}
			}
		});
	};

	exports.craftjs.services.sendConfiguration = function (configuration, callback) {
		$.ajax("/config", {
			type: "POST",
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify(configuration),
			success: function (jsonData) {
				if (callback && jsonData.status === "ok") {
					callback();
				}
			}
		});
	};
	
	exports.craftjs.services.addGitRepository = function (name, url, callback) {
		$.ajax("/config/githook", {
			type: "POST",
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify({name: name, url: url}),
			success: function (jsonData) {
				callback(jsonData);
			}
		});
	};
	
	
	exports.craftjs.services.addCdnResource = function (name, url, callback) {
		$.ajax("/config/cdn/name", {
			type: "POST",
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify({name: name, url: url}),
			success: function (jsonData) {
				callback(jsonData);
			}
		});
	};
	
	
	exports.craftjs.services.getAllTests = function (callback) {
		$.ajax("/test", {
			type: "GET",
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify({}),
			success: function (jsonData) {
				callback(jsonData);
			}
		});
	};
	
	
	exports.craftjs.services.getAllJavascripts = function (callback) {
		$.ajax("/test/javascripts", {
			type: "GET",
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify({}),
			success: function (jsonData) {
				callback(jsonData);
			}
		});
	};
	
	exports.craftjs.services.removeCdnResource = function (name, callback) {
		$.ajax("/config/cdn/" + name, {
			type: "DELETE",
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify({name: name}),
			success: function (jsonData) {
				callback(jsonData);
			}
		});
	};
	
	exports.craftjs.services.gitPull = function (name, callback) {
		$.ajax("/config/githook/" + name, {
			type: "PUT",
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify({name: name}),
			success: function (jsonData) {
				callback(jsonData);
			}
		});
	};
	exports.craftjs.services.deleteGitRepository = function (name, callback) {
		$.ajax("/config/githook/" + name, {
			type: "DELETE",
			dataType: "json",
			contentType: "application/json",
			data: JSON.stringify({name: name}),
			success: function (jsonData) {
				callback(jsonData);
			}
		});
	};
	exports.craftjs.services.deleteFile = function (path, callback) {
		$.ajax("/" + craftjs.data.context + "/" + path, {
			type: "DELETE",
			dataType: "json",
			contentType: "application/json",
			success: function (jsonData) {
				if (callback && jsonData.status === "OK") {
					callback();
				}
			}
		});
	};
	exports.craftjs.services.phantomTest = function (path, callback, errorhandler) {
		$.ajax({
			url: path,
			contentType: "application/json",
			success: callback,
			error: errorhandler
		});
	};
	
}(this, jQuery));