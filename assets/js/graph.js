export async function drawGraph(containerId) {
  // Fetch graph data
  const response = await fetch('/pages/graph.json');
  const graphData = await response.json();

  // DOM element
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Graph container with ID '${containerId}' not found.`);
    return; // Exit if container is not found
  }
  console.log('Graph container dimensions:', container.offsetWidth, container.offsetHeight); // 디버깅용 로그
  console.log('Graph container dimensions:', container.offsetWidth, container.offsetHeight); // 디버깅용 로그

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
      size: 10,
      font: {
        size: 12,
        color: 'rgba(173, 216, 230, 0.9)', // Light blue for font
        face: 'Source Code Pro'
      },
      borderWidth: 2,
      color: {
        border: 'rgba(100, 149, 237, 0.7)', // Cornflower blue border
        background: 'rgba(25, 25, 112, 0.6)', // Midnight blue background
        highlight: {
          border: 'rgba(0, 191, 255, 1)', // Deep sky blue highlight border
          background: 'rgba(25, 25, 112, 0.8)' // Slightly less transparent on highlight
        }
      },
      shadow: {
        enabled: true,
        color: 'rgba(0, 191, 255, 0.7)', // Deep sky blue glow
        size: 10, // Larger glow size
        x: 0,
        y: 0
      },
      inherit: false
    },
    edges: {
      width: 1,
      color: { 
        color: 'rgba(100, 149, 237, 0.5)', // Cornflower blue for edges
        highlight: 'rgba(0, 191, 255, 0.8)' // Deep sky blue highlight
      },
      smooth: {
        type: 'continuous'
      },
      shadow: {
        enabled: true,
        color: 'rgba(100, 149, 237, 0.3)', // Subtle cornflower blue glow for edges
        size: 5, // Slightly larger glow
        x: 0,
        y: 0
      },
      inherit: false
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
  network.setSize(container.offsetWidth, container.offsetHeight); // Explicitly set network size

  window.addEventListener('resize', () => {
    network.fit();
    network.redraw();
  });

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
    // Add all nodes and edges for initial full display
    graphData.nodes.forEach(node => nodes.add(node));
    graphData.links.forEach(link => edges.add(link));
    network.fit(); // Fit the graph to the view
    network.redraw(); // Explicitly redraw the network
  }

  const startTimelapseButton = document.getElementById('start-timelapse');
  const resetGraphButton = document.getElementById('reset-graph');

  if (startTimelapseButton) {
    startTimelapseButton.addEventListener('click', startTimelapse);
  }
  if (resetGraphButton) {
    resetGraphButton.addEventListener('click', resetGraph);
  }

  // Initial full graph display
  resetGraph();
}

drawGraph();
