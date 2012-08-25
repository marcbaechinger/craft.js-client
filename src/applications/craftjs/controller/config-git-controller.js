/*global controller: false, $: false, craftjs: false */
/*jslint browser: true */
//= require "../../../controller/model-aware-controller, config-common"
(function (exports) {
	var pullOutput = function (message, repoName) {
			$("#git-alert").html(craftjs.renderById("git-pull-template", {
				type: "success",
				label: "Success fully pulled repository " + repoName,
				message: message
			}));
		},
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
							
								craftjs.feedback.info("git", "started cloning repository <code>"
									+ url + "</code> to <code>" + name + "</code>");
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
											"</span></span><a class='btn btn-primary btn-mini' "
											+ "data-action='git-pull'>"
											+ "pull</a><span class='url'>"
											+ url +
											"</span><button class='close' data-action='remove-git-repo'>" +
											"&times;</button></li>";

										$("#git-hooks").append(listItem);
										craftjs.feedback.success("git", "Cloned repository '"
											+ url + "' to '" + name + "'");
									} else {
										craftjs.feedback.error("git", "failed cloning repository <code>"
											+ url + "</code> to <code>"
											+ name + "</code>: " + data.message);
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
									craftjs.feedback.error("git", "while removing repository '" + data.message + "'");
								} else {
									listItem.remove();
									craftjs.feedback.success("git", "removed repository <code>" + name + "</code>");
								}
							});
						}
					},
					"@git-pull": function (e) {
						var listItem = $(e.target).closest("li"),
							name = listItem.data("name");

						if (name) {
							craftjs.feedback.info("git", "started pulling repository '" + name + "'");
							craftjs.services.gitPull(name, function (data) {
								console.log(JSON.stringify(data));
								if (data.status !== "ok") {
									craftjs.feedback.info("git", "while pulling repository <code>"
										+ name + "</code>: " + data.message);
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