
package io.github.qualiabyte.katas.dijkstra;

import java.util.List;
import java.util.ArrayList;

public class Graph {
  public Graph() {
    this(new ArrayList<Vertex>());
  }

  public Graph(List<Vertex> nodes) {
    this.nodes = nodes;
  }

  public List<Vertex> nodes;
}
