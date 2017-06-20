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
		showServers.call(view);	
	}

});


function showServers(){
	var view = this;

	var serverChartEl = d.first(view.el, ".section-server-chart");
	view._serverChart = new ServerChart().init(serverChartEl);
	ajax.get("./data/data.json").then(function(data){
		view._serverChart.update(data);
	});
}