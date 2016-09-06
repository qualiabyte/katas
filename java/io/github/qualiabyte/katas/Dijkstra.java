
package io.github.qualiabyte.katas;

import java.util.List;
import java.util.ArrayList;
import java.util.PriorityQueue;
import io.github.qualiabyte.katas.dijkstra.*;

public class Dijkstra {

  public static Graph shortestPaths(int startIndex, Graph graph) {
    Vertex start = graph.nodes.get(startIndex);
    PriorityQueue<Edge> queue = new PriorityQueue<Edge>(start.edges);

    // Process start node
    start.distance = 0;
    start.path = start;
    start.known = true;

    // Process remaining nodes
    Graph result = shortestPaths(graph, queue);
    return result;
  }

  public static Graph shortestPaths(Graph graph, PriorityQueue<Edge> queue) {

    while (queue.peek() != null) {
      Edge edge = queue.poll();
      Vertex destination = edge.to;

      if (destination.known == true) {
        continue;
      }
      else {
        destination.distance = edge.from.distance + edge.weight;
        destination.path = edge.from;
        destination.known = true;
      }

      // Add unsolved edges to queue
      for (Edge adjacent : destination.edges) {
        if (adjacent.to.known == false) {
          queue.add(adjacent);
        }
      }
    }

    return graph;
  }
}

class DijkstraTests extends Tests {
  public static void run() {
    log("Testing Dijkstra");
    testShortestPaths();
    log("Passed Dijkstra Tests!");
  }

  public static Graph setupGraph() {
    Vertex v1 = new Vertex(1);
    Vertex v2 = new Vertex(2);
    Vertex v3 = new Vertex(3);
    Vertex v4 = new Vertex(4);
    Vertex v5 = new Vertex(5);
    Vertex v6 = new Vertex(6);
    Vertex v7 = new Vertex(7);

    Edge e12 = new Edge(2.0d, v1, v2);
    Edge e14 = new Edge(1.0d, v1, v4);
    Edge e24 = new Edge(3.0d, v2, v4);
    Edge e25 = new Edge(10.0d, v2, v5);
    Edge e36 = new Edge(5.0d, v3, v6);
    Edge e43 = new Edge(2.0d, v4, v3);
    Edge e45 = new Edge(2.0d, v4, v5);
    Edge e46 = new Edge(8.0d, v4, v6);
    Edge e47 = new Edge(4.0d, v4, v7);
    Edge e57 = new Edge(6.0d, v5, v7);
    Edge e76 = new Edge(1.0d, v7, v6);

    v1.edges.add(e12);
    v1.edges.add(e14);
    v2.edges.add(e24);
    v2.edges.add(e25);
    v3.edges.add(e36);
    v4.edges.add(e43);
    v4.edges.add(e45);
    v4.edges.add(e46);
    v4.edges.add(e47);
    v5.edges.add(e57);
    v7.edges.add(e76);

    List<Vertex> nodes = new ArrayList<Vertex>();
    nodes.add(v1);
    nodes.add(v2);
    nodes.add(v3);
    nodes.add(v4);
    nodes.add(v5);
    nodes.add(v6);
    nodes.add(v7);

    Graph graph = new Graph(nodes);

    return graph;
  }

  public static void testShortestPaths() {
    log("Testing Dijkstra.shortestPaths(sourceIndex, graph)");
    Graph graph = setupGraph();

    Graph solution = Dijkstra.shortestPaths(0, graph);

    for (Vertex node : solution.nodes) {
      if (node.known != true)
        throw new Error("Dijkstra should solve each node in graph");

      log("NODE: id: " + node.id +
          ", distance: " + node.distance +
          ", path: " + node.path.id);
    }

    Vertex v1 = graph.nodes.get(0);
    Vertex v2 = graph.nodes.get(1);
    Vertex v3 = graph.nodes.get(2);
    Vertex v4 = graph.nodes.get(3);
    Vertex v5 = graph.nodes.get(4);
    Vertex v6 = graph.nodes.get(5);
    Vertex v7 = graph.nodes.get(6);

    if (v1.distance != 0 || v1.path != v1)
      throw new Error("Dijkstra should solve path for v1");

    if (v2.distance != 2 || v2.path != v1)
      throw new Error("Dijkstra should solve path for v2");

    if (v3.distance != 3 || v3.path != v4)
      throw new Error("Dijkstra should solve path for v3");

    if (v4.distance != 1 || v4.path != v1)
      throw new Error("Dijkstra should solve path for v4");

    if (v5.distance != 3 || v5.path != v4)
      throw new Error("Dijkstra should solve path for v5");

    if (v6.distance != 6 || v6.path != v7)
      throw new Error("Dijkstra should solve path for v6");

    if (v7.distance != 5 || v7.path != v4)
      throw new Error("Dijkstra should solve path for v7");
  }

  public static void main(String[] args) {
    try {
      DijkstraTests.run();
    }
    catch (Error e) {
      log(e.toString());
      System.exit(1);
    }
  }
}
