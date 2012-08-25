/*global $: true, craftjs: true */
/*jslint browser: true */
//= require "../renderer"
(function (exports) {
	var feedback = {
		info: function (topic, message, label, type) {
			$("#" + topic + "-alert").html(craftjs.renderById("alert-template", {
				type: type || "info",
				label: label || "Info",
				message: message
			}));
		},
		error: function (topic, message, label) {
			feedback.info(topic, message, label || "Error", "error");
		},
		success: function (topic, message, label) {
			feedback.info(topic, message, label || "Success", "success");
		},
		chomp: function (text) {
			return text.replace(/ /g, "");
		}
	};
	
	exports.craftjs = exports.craftjs || {};
	exports.craftjs.feedback = feedback;
}(this));