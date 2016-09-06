
package io.github.qualiabyte.katas.dijkstra;

public class Edge implements Comparable<Edge> {
  public Edge() {
    this(0.0f, null, null);
  }

  public Edge(double weight, Vertex from, Vertex to) {
    this.weight = weight;
    this.from = from;
    this.to = to;
  }

  public int compareTo(Edge other) {
    return Double.compare(this.weight, other.weight);
  }

  public double weight;
  public Vertex from;
  public Vertex to;
}
