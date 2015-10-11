BlazeLayout.setRoot('body');

Meteor.startup(function(){
   Session.set("windowWidth", window.innerWidth);
   Session.set("windowHeight", window.innerHeight);
});

Template.app.helpers({
    apiConnected: function(){
        var user = Meteor.user();
        return user.profile.apikey != "";
    }
});

Template.nodeGraph.helpers({
    nodes: function(){
        return Nodes.find();
    }
});

Template.nodeGraph.onRendered(function(){
    var width = Session.get("windowWidth");
    var height = Session.get("windowHeight");
    var color = d3.scale.category20();

    var force = d3.layout.force()
        .linkDistance(80)
        .charge(-120)
        .gravity(.05)
        .size([width, height])
        .on("tick", tick);

    var svg = d3.select("#nodeGraph").append('svg')
        .attr('width', width)
        .attr('height', height);

    var link = svg.selectAll(".link"),
        node = svg.selectAll(".node");

    var data = {};
    data.nodes = Nodes.find().fetch();
    data.links = Connectors.find().fetch();
    d3.json(data, function (error, graph) {
        update();
    });

    function update() {
        var nodes = data.nodes,
            links = d3.layout.tree().links(nodes);

        force
            .nodes(nodes)
            .links(links)
            .start();

        link = link.data(links, function(d) { return d.target.id; });

        link.exit().remove();

        link.enter().insert("line", ".node")
            .attr("class", "link");

        node = node.data(nodes, function(d) { return d.id; });

        node.exit().remove();

        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .call(force.drag);

        nodeEnter.append("circle")
            .attr("r", function(d) { return Math.sqrt(d.size) / 10 || 4.5; });

        nodeEnter.append("text")
            .attr("dy", ".35em")
            .text(function(d) { return d.name; });

        node.select("circle")
            .style("fill", color);
    }

    function tick() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    }
});

Template.connectApi.events({
    'submit #api-key-form': function(event, template) {
        event.preventDefault();
        Meteor.call("setAPIKey", template.find("#api-key").value, function(err, res) {
            if(res) {
                toastr.success('API Key Saved.');
            }
            if(err) {
                toastr.error('Error: API Key Not Saved.');
            }
        });
    }
});