var d = mvdom; // external/global lib
var render = require("../../js-app/render.js").render;

d.register("SummaryView",{
	create: function(data, config){
		return render("SummaryView");
	}
});