var SCgLayoutObjectType = {
    Node: 0,
    Edge: 1,
    Link: 2,
    Contour: 3,
    DotPoint: 4
};

// Layout algorithms


/**
 * Base layout algorithm
 */
SCg.LayoutAlgorithm = function (nodes, edges, contours, onTickUpdate) {
    this.nodes = nodes;
    this.edges = edges;
    this.contours = contours;
    this.onTickUpdate = onTickUpdate;
};

SCg.LayoutAlgorithm.prototype = {
    constructor: SCg.LayoutAlgorithm
};

// --------------------------

SCg.LayoutAlgorithmForceBased = function (nodes, edges, contours, onTickUpdate, rect) {
    SCg.LayoutAlgorithm.call(this, nodes, edges, contours, onTickUpdate);
    this.rect = rect;
};

SCg.LayoutAlgorithmForceBased.prototype = Object.create(SCg.LayoutAlgorithm);

SCg.LayoutAlgorithmForceBased.prototype.destroy = function () {
    this.stop();
};

SCg.LayoutAlgorithmForceBased.prototype.stop = function () {
    if (this.force) {
        this.force.stop();
        delete this.force;
        this.force = null;
    }

};

SCg.LayoutAlgorithmForceBased.prototype.start = function () {

    this.stop();

    // init D3 force layout
    var self = this;


    this.force = d3.layout.force()
      .nodes(this.nodes)
      .links(this.edges)
      .size(this.rect)
      .friction(0.9)
      .gravity(0.03)
      .chargeDistance(640)
      .linkDistance(function (edge) {
          if (edge.distance === 0 || edge.distance) return edge.distance;

          var p1 = edge.source.object.getConnectionPos(edge.target.object.position, edge.object.source_dot);
          var p2 = edge.target.object.getConnectionPos(edge.source.object.position, edge.object.target_dot);
          var cd = edge.source.object.position.clone().sub(edge.target.object.position).length();
          var d = cd - p1.sub(p2).length();

          if (edge.source.type == SCgLayoutObjectType.DotPoint ||
            edge.target.type == SCgLayoutObjectType.DotPoint) {
              return d + 50;
          }

          return 100 + d;
      })
      .linkStrength(function (edge) {
          if (edge.strength === 0 || edge.strength) return edge.strength;
          if (edge.source.type == SCgLayoutObjectType.DotPoint ||
            edge.target.type == SCgLayoutObjectType.DotPoint) {
              return 1;
          }

          return 0.3;
      })
      .charge(function (node) {
          if (node.charge === 0 || node.charge) return node.charge;
          if (node.type == SCgLayoutObjectType.DotPoint) {
              return 0;
          } else if (node.type == SCgLayoutObjectType.Link) {
              return -900;
          }

          return -700;
      })
      .on('tick', function () {
          self.onLayoutTick();
      })
      .start();
};

SCg.LayoutAlgorithmForceBased.prototype.onLayoutTick = function () {

    var dots = [];
    for (idx in this.nodes) {
        var node_layout = this.nodes[idx];

        if (node_layout.type === SCgLayoutObjectType.Node) {
            node_layout.object.setPosition(new SCg.Vector3(node_layout.x, node_layout.y, 0));
        } else if (node_layout.type === SCgLayoutObjectType.Link) {
            node_layout.object.setPosition(new SCg.Vector3(node_layout.x, node_layout.y, 0));
        } else if (node_layout.type === SCgLayoutObjectType.DotPoint) {
            dots.push(node_layout);
        } else if (node_layout.type === SCgLayoutObjectType.Contour) {
            node_layout.object.setPosition(new SCg.Vector3(node_layout.x, node_layout.y, 0));
        }
    }

    // setup dot points positions 
    for (idx in dots) {
        var dot = dots[idx];

        var edge = dot.object.target;
        if (dot.source)
            edge = dot.object.source;

        dot.x = edge.position.x;
        dot.y = edge.position.y;
    }

    for (const contour of this.nodes) {
        if (contour.type === SCgLayoutObjectType.Contour) {
            let boundedRectangle = contour.object.boundedRectangle();
            const offset = 5;
            const enlargedRect = [
                boundedRectangle[0].clone().add(new SCg.Vector3(-offset, -offset)),
                boundedRectangle[1].clone().add(new SCg.Vector3(-offset, +offset)),
                boundedRectangle[2].clone().add(new SCg.Vector3(+offset, +offset)),
                boundedRectangle[3].clone().add(new SCg.Vector3(+offset, -offset)),
            ];
            contour.object.setVertices(enlargedRect);
        }
    }

    this.onTickUpdate();
};


// ------------------------------------

SCg.LayoutManager = function () {

};

SCg.LayoutManager.prototype = {
    constructor: SCg.LayoutManager
};

SCg.LayoutManager.prototype.init = function (scene) {
    this.scene = scene;
    this.nodes = null;
    this.edges = null;

    this.algorithm = null;
};

/**
 * Prepare objects for layout
 */
SCg.LayoutManager.prototype.prepareObjects = function () {
    const chargeCoefficient = 2;
    const distanceCoefficient = 1;

    this.nodes = new Array();
    this.edges = new Array();
    var objDict = {};

    // first of all we need to collect objects from scene, and build them representation for layout
    for (const node of this.scene.nodes) {
        var obj = {
            x: node.position.x,
            y: node.position.y,
            object: node,
            type: SCgLayoutObjectType.Node,
            charge: -300 * chargeCoefficient,
        };

        objDict[node.id] = obj;
        this.nodes.push(obj);
    }

    for (const link of this.scene.links) {

        var obj = {
            x: link.position.x,
            y: link.position.y,
            object: link,
            type: SCgLayoutObjectType.Link,
            charge: -300 * chargeCoefficient,
        };

        objDict[link.id] = obj;
        this.nodes.push(obj);
    }

    for (const edge of this.scene.edges) {
        var obj = {
            object: edge,
            type: SCgLayoutObjectType.Edge,
            strength: 0.3,
            distance: 100 * distanceCoefficient,
        };
        objDict[edge.id] = obj;
        this.edges.push(obj);
    }

    for (const contour of this.scene.contours) {
        var obj = {
            x: contour.position.x,
            y: contour.position.y,
            object: contour,
            type: SCgLayoutObjectType.Contour,
            charge: -300 * chargeCoefficient,
        };
        objDict[contour.id] = obj;
        this.nodes.push(obj);
    }

    // store begin and end for edges
    for (const edge of this.edges) {
        const source = objDict[edge.object.source.id];
        const target = objDict[edge.object.target.id];

        function getEdgeObj(srcObj) {
            return {
                type: SCgLayoutObjectType.DotPoint,
                object: srcObj.object,
                charge: 0
            };
        };
        if (source.type == SCgLayoutObjectType.Edge) {
            edge.source = getEdgeObj(source);
            this.nodes.push(edge.source);
        } else {
            edge.source = source;
        }
        if (target.type == SCgLayoutObjectType.Edge) {
            edge.target = getEdgeObj(target);
            this.nodes.push(edge.target);
        } else {
            edge.target = target;
        }
    }

    // collect contour nodes to one cluster
    for (const contour of this.scene.contours) {
        for (const child of contour.childs) {
            let source = objDict[contour.id];
            if (source.type === SCgLayoutObjectType.Edge) {
                continue;
            }
            let target = objDict[child.id];
            if (target.type === SCgLayoutObjectType.Edge) {
                continue;
            }
            this.edges.push({
                type: SCgLayoutObjectType.Edge,
                source: source,
                target: target,
                strength: 0.3,
                distance: 50 * distanceCoefficient,
            });
        }
    }
};

/**
 * Starts layout in scene
 */
SCg.LayoutManager.prototype.doLayout = function () {

    if (this.algorithm) {
        this.algorithm.stop();
        delete this.algorithm;
    }

    this.prepareObjects();
    this.algorithm = new SCg.LayoutAlgorithmForceBased(this.nodes, this.edges, null,
        $.proxy(this.onTickUpdate, this),
        this.scene.getContainerSize());
    this.algorithm.start();
};

SCg.LayoutManager.prototype.onTickUpdate = function () {
    this.scene.updateObjectsVisual();
    this.scene.pointed_object = null;
};
