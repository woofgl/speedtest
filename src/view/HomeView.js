var d = window.mvdom;
var Gtx = window.Gtx;
var d3 = window.d3;

var render = require("../js-app/render.js").render;

var ServerChart = require("./chart/ServerChart.js");
var ajax = require("../js-app/ajax.js");


d.register("HomeView",{
	create: function(data, config){
		return render("HomeView");
	}, 

	postDisplay: function(){
		var view = this; // best practice, set the view variable first.	
		// for now just use to check if uploading
		view._uploading = false;

		var serverChartEl = d.first(view.el, ".section-server-chart");
		view._serverChart = new ServerChart().init(serverChartEl);

		showServers.call(view);	
	},
	events: {
		"click; .btn-choose": function(evt){
			var view = this;
			var fileEl = d.first(view.el, ".file-choose");
			fileEl.click();
		},
		"change; .file-choose": function(evt){
			var view = this;
			var fileEl = evt.selectTarget;
			var val = fileEl.value;
			if(val){
				d.first(view.el, ".file-name").innerHTML = val;
			}else{
				d.first(view.el, ".file-name").innerHTML = "";
			}
		},
		"click; .btn-go": function(evt){
			var view = this;
			var fileEl = d.first(view.el, ".file-choose");
			var val = fileEl.value;
			if(val){
				view._uploading = true;
				var titleEl = d.first(view.el, ".title");
				titleEl.innerHTML = "Uploading..."
				d.first(view.el, ".file-name").innerHTML = "";
				var uploadConEl = d.first(view.el, ".section-upload");
				uploadConEl.classList.add("uploading");

				// to show servers status
				showServers.call(view);
			}
		},
		"click; .btn-cancel": function(evt){
			var view = this;
			var fileEl = d.first(view.el, ".file-choose");
			var val = fileEl.value;
			if(val){
				view._uploading = false;
				var titleEl = d.first(view.el, ".title");
				titleEl.innerHTML = "Upload a file"
				var uploadConEl = d.first(view.el, ".section-upload");
				uploadConEl.classList.remove("uploading");
			}
		}
	}

});


function showServers(){
	var view = this;
	var url = view._uploading ? "./data/data-uploading.json" : "./data/data.json";
	ajax.get(url).then(function(data){
		view._serverChart.update(data);
	});
}