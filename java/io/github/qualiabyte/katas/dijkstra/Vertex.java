
package io.github.qualiabyte.katas.dijkstra;

import java.util.List;
import java.util.ArrayList;

public class Vertex implements Comparable<Vertex> {
  public Vertex(int id) {
    this(id, new ArrayList<Edge>());
  }

  public Vertex(int id, List<Edge> edges) {
    this.id = id;
    this.edges = edges;
  }

  public int compareTo(Vertex other) {
    return Double.compare(this.distance, other.distance);
  }

  public int id;
  public List<Edge> edges;
  public Vertex path;
  public double distance = Double.POSITIVE_INFINITY;
  public boolean known;
}
