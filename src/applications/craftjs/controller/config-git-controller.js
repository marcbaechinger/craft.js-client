/*global */
/*jslint browser: true */
//= require "../../../controller/model-aware-controller"
(function (exports) {
	var GitConfigController = function(model, containerId) {
		return new controller.ModelAwareController({
			containerSelector: "#" + containerId,
			model: model,
			events: {
				"@add-repo": function () {
					var that = this;
					if (!that.repoDialog) {
						this.repoDialog =  $("#repo-dialog").modal({
							show: false
						});
						that.repoDialog.on("show", function () {
							that.repoDialog.find(".error").hide();
						});
						that.repoDialog.find(".btn-primary").on("click", function () {
							var name = that.repoDialog.find("#repo-name").val(),
								url = that.repoDialog.find("#repo-url").val();
								
							craftjs.services.addGitRepository(name, url, function (data) {
								if (data.status === "ok") {
									var listItem =  "<li class='row-fluid' data-name='" + 
										name + 
										"'><span class='span2'><span class='label label-warning' onclick='document.location=\"/repo/" + 
										name + 
										"\"'>repo:/" +
										name +
										"</span></span><span class='url'>" + 
										url +
										"</span><button class='close' data-action='remove-git-repo'>&times;</button></li>";
									
									$("#git-hooks").append(listItem);
									that.repoDialog.modal("hide");
								} else {
									that.repoDialog.find(".error").text(data.message).show();
								}
							});
						});
					}
					that.repoDialog.modal("show");
				},
				"@remove-git-repo": function (e) {
					var listItem = $(e.target).closest("li"),
						name = listItem.data("name");
						
					if (name) {
						craftjs.services.deleteGitRepository(name, function (data) {
							if (data.status !== "ok") {
								alert(data.message);
							} else {
								listItem.remove();
							}
						});
					}
				},
				"@git-pull": function (e) {
					var listItem = $(e.target).closest("li"),
						name = listItem.data("name");
					
					if (name) {
						craftjs.services.gitPull(name, function (data) {
							if (data.status !== "ok") {
								alert(data.message);
							} else {
								alert(data.message);
							}
						});
					}
				}
			}
		});
	};
	exports.craftjs.GitConfigController = GitConfigController;
}(this));