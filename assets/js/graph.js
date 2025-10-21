export async function drawGraph() {
  // Fetch graph data
  const response = await fetch('/pages/graph.json');
  const graphData = await response.json();

  // DOM element
  const container = document.getElementById('knowledge-graph-modal');
  if (!container) {
    console.error('Graph container not found.');
    return; // Exit if container is not found
  }

  // Read CSS variables for theme colors
  const style = getComputedStyle(document.documentElement);
  const accentViolet = style.getPropertyValue('--accent-violet').trim();
  const accentCyan = style.getPropertyValue('--accent-cyan').trim();
  const panelBg = style.getPropertyValue('--panel').trim();
  const fgMain = style.getPropertyValue('--fg-main').trim();
  const border = style.getPropertyValue('--border').trim();

  // Graph options
  const options = {
    nodes: {
      shape: 'dot',
      size: 16,
      font: {
        size: 14,
        color: fgMain
      },
      borderWidth: 2,
      color: {
        border: accentViolet,
        background: panelBg,
        highlight: {
          border: accentCyan,
          background: panelBg
        }
      }
    },
    edges: {
      width: 1,
      color: { 
        color: accentViolet,
        highlight: accentCyan
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

  // Initialize DataSets for dynamic updates
  const nodes = new vis.DataSet();
  const edges = new vis.DataSet();
  const data = { nodes: nodes, edges: edges };

  let network = new vis.Network(container, data, options);

  // Sort nodes by date for timelapse
  const sortedNodes = graphData.nodes.sort((a, b) => new Date(a.date) - new Date(b.date));
  const sortedLinks = graphData.links; // Links will be added with nodes

  let nodeIndex = 0;
  let edgeIndex = 0;
  let interval = null;

  function addNextNode() {
    if (nodeIndex < sortedNodes.length) {
      const node = sortedNodes[nodeIndex];
      nodes.add(node);

      // Add edges connected to this node
      sortedLinks.filter(link => link.from === node.id || link.to === node.id)
                 .forEach(link => {
                     // Only add edge if both connected nodes already exist
                     if (nodes.get(link.from) && nodes.get(link.to)) {
                         edges.add(link);
                     }
                 });
      nodeIndex++;
    } else {
      clearInterval(interval);
      // Add any remaining edges that connect already existing nodes
      sortedLinks.forEach(link => {
          if (!edges.get(link.id) && nodes.get(link.from) && nodes.get(link.to)) {
              edges.add(link);
          }
      });
    }
  }

  function startTimelapse() {
    resetGraph();
    interval = setInterval(addNextNode, 500); // Add a node every 500ms
  }

  function resetGraph() {
    clearInterval(interval);
    nodes.clear();
    edges.clear();
    nodeIndex = 0;
    edgeIndex = 0;
    network.destroy(); // Destroy and recreate network to reset physics
    network = new Network(container, data, options);
  }

  document.getElementById('start-timelapse').addEventListener('click', startTimelapse);
  document.getElementById('reset-graph').addEventListener('click', resetGraph);

  // Initial full graph display if no timelapse is started
  // Or just show the reset button to start timelapse
  // For now, let's just show the reset button and user clicks start
  resetGraph(); // Initialize with empty graph, ready for timelapse
}

drawGraph();
