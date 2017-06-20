var d3 = window.d3;

module.exports = ServerChart;

function ServerChart(){

}

// opts
ServerChart.prototype.init = function(el, opts){
	var self = this;

	self._opts = opts; // TODO: need to have some default

	// margin.right negative to compensite the clip path below
	var margin = {top: 50, right: 20, bottom: 150, left: 20};

	var width = self._width = el.clientWidth - margin.left - margin.right;
	var height = self._height = el.clientHeight - margin.top - margin.bottom;

	// declares a tree layout and assigns the size
	self._treemap = d3.tree().size([width, height]);

	// appends a 'group' element to 'svg'
	// moves the 'group' element to the top left margin
	self._g = d3.select(el).append("svg")
			.attr("class", "ServerChart")
			.attr("width", self._width + margin.left + margin.right)
			.attr("height", self._height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");		


	return self;
};

ServerChart.prototype.update = function(data){
	var self = this;
	var opts = self._opts;
	var treemap = self._treemap;
	var g = self._g;

	//  assigns the data to a hierarchy using parent-child relationships
	var nodes = d3.hierarchy(data, function(d) {
		return d.children;
	});
	// maps the node data to the tree layout
	nodes = treemap(nodes);

	// adds the links between the nodes
	var link = g.selectAll(".link")
		.data(nodes.descendants().slice(1))
		.enter().append("path")
		.attr("class", "link")
		.attr("d", function(d) {
			var h = (d.y - d.parent.y) / 4;
			return "M " + d.x + "," + (d.y - h) + "L" + d.x + "," + (d.y - 2 * h)
				+ "L" + d.parent.x + "," + (d.y - 2 * h)
				+ "L" + d.parent.x + "," + (d.y - 3 * h);
		});

	// adds each node as a group
	var node = g.selectAll(".node")
		.data(nodes.descendants())
		.enter().append("g")
		.attr("class", function(d) { 
			return "node" + 
				(d.children ? " node--internal" : "node--leaf");
		})
		.attr("transform", function(d) { 
			return "translate(" + d.x + "," + d.y + ")"; 
		});

	// adds symbols as nodes
	node.append("svg")
		.attr("class", "symbol")
		.attr("width", 32)
		.attr("height", 32)
		.attr("x", "-1.35em")
		.attr("y", "-2.5em")
		.append("use")
   		.attr("xlink:href", "#ico-postr");

	// adds the text to the node
	node.append("text")
		.attr("dy", "1.35em")
		.attr("text-anchor", "middle")
		.text(function(d) { return d.data.name; });


	return self;
};

// --------- /LineChart --------- //