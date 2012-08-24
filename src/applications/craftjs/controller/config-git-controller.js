/*global controller: false, $: false, craftjs: false */
/*jslint browser: true */
//= require "../../../controller/model-aware-controller"
(function (exports) {
	var info = function (message, label, type) {
			$("#git-alert").html(craftjs.renderById("alert-template", {
				type: type || "info",
				label: label || "Info",
				message: message
			}));
		},
		pullOutput = function (message, repoName) {
			$("#git-alert").html(craftjs.renderById("git-pull-template", {
				type: "success",
				label: "Success fully pulled repository " + repoName, 
				message: message
			}));
		},
		error = function (message, label) { info(message, label || "Error", "error"); },
		success = function (message, label) { info(message, label || "Success", "success"); },
		chomp = function (text) {  return text.replace(/ /g, "");  },
		GitConfigController = function (model, containerId) {
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
								var name = chomp(that.repoDialog.find("#repo-name").val()),
									url = chomp(that.repoDialog.find("#repo-url").val());
							
								info("started cloning repository '" + url + "' to '" + name + "'");
								that.repoDialog.modal("hide");

								craftjs.services.addGitRepository(name, url, function (data) {
									if (data.status === "ok") {
										var listItem =  "<li class='row-fluid' data-name='" +
											name +
											"'><span class='span2'><span class='label label-warning' " +
											"onclick='document.location=\"/repo/" +
											name +
											"\"'>repo:/" +
											name +
											"</span></span><a class='btn btn-primary btn-mini' data-action='git-pull'>pull</a><span class='url'>" +
											url +
											"</span><button class='close' data-action='remove-git-repo'>" +
											"&times;</button></li>";

										$("#git-hooks").append(listItem);
										success("Cloned repository '" + url + "' to '" + name + "'");
									} else {
										error("failed cloning repository '" + url + "' to '" +
												name + "': " + data.message);
									}
								});
							});
						}
						that.repoDialog.modal("show");
					},
					"@remove-git-repo": function (e) {
						var listItem = $(e.target).closest("li"),
							name = chomp(listItem.data("name"));

						if (name) {
							craftjs.services.deleteGitRepository(name, function (data) {
								if (data.status !== "ok") {
									error("while removing repository '" + data.message + "'");
								} else {
									listItem.remove();
									success("removed repository '" + name + "'");
								}
							});
						}
					},
					"@git-pull": function (e) {
						var listItem = $(e.target).closest("li"),
							name = listItem.data("name");

						if (name) {
							info("started pulling repository '" + name + "'");
							craftjs.services.gitPull(name, function (data) {
								console.log(JSON.stringify(data));
								if (data.status !== "ok") {
									error("while pulling repository '" + name + "': " + data.message);
								} else {
									pullOutput(data.output, name);
								}
							});
						}
					}
				}
			});
		};
	exports.craftjs.GitConfigController = GitConfigController;
}(this));