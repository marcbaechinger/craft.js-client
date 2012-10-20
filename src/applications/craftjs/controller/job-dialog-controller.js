/*global craftjs: false, $: false, controller: false */
/*jslint browser: true */
//= require "../../../controller/model-aware-controller, config-common"
(function (exports) {
	var JobDialogController = function (spec) {
		spec.events = $.extend({
			"@next": function() { this.next(); },
			"@previous": function() { this.previous(); },
			"@save": function () { this.save(); }
		}, spec.events || {});
		
		spec.model = new model.Model({
			data: {
				steps: ["cron", "tests", "build", "save"],
				currentStep: 0
			}
		});
		
		controller.ModelAwareController.call(this, spec);
	};
	JobDialogController.prototype = new controller.ModelAwareController();
	
	JobDialogController.prototype.init = function () {
		var that = this;
		controller.ModelAwareController.prototype.init.call(this);
		
		this.loadTests();
		this.loadJavascripts();
		this.testFilter = this.initFilter($("#test-filter"), ".test-list li", "name");
		this.javascriptFilter = this.initFilter($("#javascript-filter"), ".javascript-list li", "name");
		
		this.container.modal({
			show: false
		});
		this.container.on("show", function () {
			that.container.find(".error").hide();
		});
	};
	
	JobDialogController.prototype.initFilter = function(filterInput, itemSelector, dataAttName) {
		return filterInput.bind("keyup", function (e) {
			var query = filterInput.val();
			$(itemSelector).each(function() {
				var listItem = $(this),
					re = new RegExp(query,"g");
				if (listItem.data(dataAttName).match(re)) {
					listItem.show();
				} else {
					listItem.hide();
				}
			});
		});
	};
	
	JobDialogController.prototype.render = function() {
		var that = this,
			currentStep = this.model.get("steps")[this.model.get("currentStep")];
		
		$.each(this.model.get("steps"), function() {
			that.container.find("." + this).hide();
		});
		
		if (this.beforeTransition[currentStep]) {
			this.beforeTransition[currentStep].call(this);
		}
		$("." + currentStep).show();
	};
	
	JobDialogController.prototype.renderSummary = function() {
		var summaryData = {
			tests: [],
			javascripts: [],
			name: $("#job-name").val(),
			notification: $("#job-notification").val(),
			cronType: this.container.find("input[name='cron-type']:checked").val(),
			expand: true, // always expand when building
			transformation: {
				mangle: this.container.find("#mangle").attr("checked") === "checked",
				squeeze: this.container.find("#squeeze").attr("checked") === "checked",
				minimize: this.container.find("input[name='output']:checked").val() === "minimize",
				beautify: this.container.find("input[name='output']:checked").val() === "beautify"
			}
		};

		this.container.find(".test-list li input").each(function() {
			var item = $(this);
			if (item.attr("checked") === "checked") {
				summaryData.tests.push(item.val());
			}
		});
		this.container.find(".javascript-list li input").each(function() {
			var item = $(this);
			if (item.attr("checked") === "checked") {
				summaryData.javascripts.push(item.val());
			}
		});
		this.summaryData = summaryData;
		$("#save-panel").html(craftjs.renderById("summary-template", summaryData));
	};
	
	JobDialogController.prototype.save = function() {
		craftjs.services.storeJob(this.summaryData, function(data) {
			console.log(data);
		});
		this.container.modal("hide");
	};
	
	JobDialogController.prototype.loadTests = function() {
		this.loadFileData("getAllTests", ".test-list", "test-list-item");
	};
	JobDialogController.prototype.loadJavascripts = function() {
		this.loadFileData("getAllJavascripts", ".javascript-list", "javascript-list-item");
	};
	JobDialogController.prototype.loadFileData = function(serviceName, targetSelector, templateName) {
		var that = this;
		craftjs.services[serviceName](function (data) {
			that.container.find(targetSelector).html(craftjs.renderById(templateName, {
				tests: data.files
			}));
		});
	};
	JobDialogController.prototype.show = function () {
		this.container.modal("show");
	};
	JobDialogController.prototype.hide = function () {
		this.container.modal("hide");
	};
	JobDialogController.prototype.next = function() {
		var currentStep = this.model.get("currentStep"),
			numberOfSteps = this.model.get("steps").length,
			currentStepName = this.model.get("steps")[currentStep],
			validationErrors;
		
		if(currentStep < numberOfSteps - 1) {
			this.container.find(".error").hide();
			if (this.validators[currentStepName]) {
				validationErrors = this.validators[currentStepName].call(this);
				if (validationErrors.length < 1) {
					currentStep++;
					this.model.set({ currentStep: currentStep });					
				} else {
					this.showValidationErrors(validationErrors);
				}
			} else {
				currentStep++;
				this.model.set({ currentStep: currentStep });
			}
		}
	};
	
	JobDialogController.prototype.showValidationErrors = function(errors) {
		$.each(errors, function () {
			$("#" + this.fieldName + "-error").text(this.message).show();
		});
	};
	
	JobDialogController.prototype.previous = function() {
		var currentStep = this.model.get("currentStep");
		if(currentStep > 0) {
			currentStep--;
			this.model.set({ currentStep: currentStep });
		}
	};
	
	JobDialogController.prototype.beforeTransition = {
		save: function() {
			this.renderSummary();
		}
	};
	
	
	JobDialogController.prototype.validators = {
		cron: function() {
			var result = [],
				name = this.container.find("#job-name").val(),
				notificationEmail = this.container.find("#job-notification").val(),
				cronType = this.container.find("input[name='cron-type']:checked").val(),
				output = this.container.find("input[name='output']:checked").val();
				
			if (name.length < 1) {
				result.push( {
					fieldName: "job-name",
					message: "a job ust have a name"
				});
			}
				
			if (!cronType) {
				result.push( {
					fieldName: "cron-type",
					message: "choose an automation frequency"
				});
			}
			if (!output) {
				result.push( {
					fieldName: "ast-flags",
					message: "choose an output type (minimize or pretty-print)"
				});
			}
			if (notificationEmail && notificationEmail.indexOf("@") < 1) {
				result.push( {
					fieldName: "job-notification",
					message: "invalid email address"
				});
			}
			return result;
		}
	};
	
	exports.craftjs.JobDialogController = JobDialogController;
}(this));