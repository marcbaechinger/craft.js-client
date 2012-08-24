/*global */
/*jslint browser: true */
//= require "../../../controller/model-aware-controller"
(function (exports) {
	var CdnConfigController = function(model, containerId) {
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
							var name = that.cdnDialog.find("#repo-name").val(),
								url = that.cdnDialog.find("#repo-url").val();
								
							craftjs.services.addCdnResource(name, url, function (data) {
								if (data.status !== "ok") {
									alert(data.message);
								} else {
									that.cdnDialog.modal("hide");
								}
							});
						});
					}
					this.cdnDialog.modal("show");
				}
			}
		});
	};
	exports.craftjs.CdnConfigController = CdnConfigController;
}(this));