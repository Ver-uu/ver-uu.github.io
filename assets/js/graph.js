async function drawGraph() {
  // Fetch graph data
  const response = await fetch('/pages/graph.json');
  const graphData = await response.json();

  // DOM element
  const container = document.getElementById('knowledge-graph');

  // Graph options
  const options = {
    nodes: {
      shape: 'dot',
      size: 16,
      font: {
        size: 14,
        color: '#c8d0ec'
      },
      borderWidth: 2,
      color: {
        border: '#8f63ff',
        background: '#0c1017',
        highlight: {
          border: '#66caff',
          background: '#0f141d'
        }
      }
    },
    edges: {
      width: 1,
      color: { 
        color: 'rgba(143, 99, 255, 0.2)',
        highlight: '#66caff'
      },
      smooth: {
        type: 'continuous'
      }
    },
    physics: {
      stabilization: false,
      barnesHut: {
        gravitationalConstant: -8000,
        springConstant: 0.04,
        springLength: 200
      }
    },
    interaction: {
      tooltipDelay: 200,
      hideEdgesOnDrag: true
    }
  };

  // Create network
  const network = new vis.Network(container, graphData, options);

  // Add event listener for node clicks
  network.on("selectNode", function (params) {
    if (params.nodes.length > 0) {
      const nodeId = params.nodes[0];
      const node = graphData.nodes.find(n => n.id === nodeId);
      if (node) {
        window.location.href = node.id;
      }
    }
  });
}

drawGraph();
