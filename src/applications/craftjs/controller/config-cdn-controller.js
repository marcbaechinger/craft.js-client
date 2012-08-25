/*global controller: false, craftjs: false, $: false */
/*jslint browser: true */
//= require "../../../controller/model-aware-controller, config-common"
(function (exports) {
	var CdnConfigController = function (model, containerId) {
		return new controller.ModelAwareController({
			containerSelector: "#" + containerId,
			model: model,
			events: {
				"@open-cdn-dialog": function () {
					var that = this;
					if (!this.cdnDialog) {
						this.cdnDialog =  $("#cdn-dialog").modal({
							show: false
						});
						this.cdnDialog.on("show", function () {
							that.cdnDialog.find(".error").hide();
						});
						this.cdnDialog.find(".btn-primary").on("click", function () {
							var name = that.cdnDialog.find("#lib-name").val(),
								url = that.cdnDialog.find("#lib-url").val();
								
							that.cdnDialog.modal("hide");
							craftjs.feedback.info("cdn", "start downloading <code>"
								+ url + "</code> to <code>" + name + "</code>");
							craftjs.services.addCdnResource(name, url, function (data) {
								console.log("dta", data);
								if (data.status !== "ok") {
									craftjs.feedback.error("cdn", "while downloading '" + url + "':" + data.message);
								} else {
									$("#cdn-libs").append(craftjs.renderById("cdn-item-template", {
										name: name,
										url: url
									}));
									craftjs.feedback.success("cdn", "Downloaded <code>" + url + "</code> to <code>"
										+ name + "</code> successfully");
								}
							});
						});
					}
					this.cdnDialog.modal("show");
				},
				"@remove-cdn-lib": function (ev) {
					var listitem = $(ev.target).closest("li"),
						name = listitem.data("name");

					craftjs.services.removeCdnResource(name, function (data) {
						if (data.status !== "ok") {
							craftjs.feedback.error("cdn", "while removing cdn resource <code>"
								+ name + "</code>:" + data.message);
						} else {
							listitem.remove();
							craftjs.feedback.success("cdn", "Removed CDN resource <code>"
								+ name + "</code> successfully");
						}
					});
				}
			}
		});
	};
	exports.craftjs.CdnConfigController = CdnConfigController;
}(this));