
import Assert
import Debug.Trace
import SkewHeap
import Text.Show.Pretty as Pretty

data Edge = Edge { weight :: Double
                 , from :: Int
                 , to :: Int
                 } deriving (Show)

instance Eq Edge where
  a == b = (weight a) == (weight b)

instance Ord Edge where
  compare a b = compare (weight a) (weight b)

data Vertex = Null |
              Vertex { adjacent :: [Edge]
                     , known :: Bool
                     , distance :: Double
                     , path :: Vertex
                     } deriving (Eq, Show)

e :: Edge
e = Edge { weight = 1.0, from = 0, to = 0 }

e12, e14, e24, e43 :: Edge
e12 = Edge { weight = 2.0, from = 1, to = 2 }
e14 = Edge { weight = 1.0, from = 1, to = 4 }
e24 = Edge { weight = 3.0, from = 2, to = 4 }
e43 = Edge { weight = 2.0, from = 4, to = 3 }

v :: Vertex
v = Vertex { adjacent = [], known = False, distance = -1.0, path = Null }

v1, v2, v3, v4 :: Vertex
(v1, v2, v3, v4) = ( v { adjacent = [e12, e14] }
                   , v { adjacent = [e24] }
                   , v { adjacent = [] }
                   , v { adjacent = [e43] }
                   )

dijkstra :: Int -> [Vertex] -> [Vertex]
dijkstra src verts
  | length soln == 0            = dijkstra' src verts [start'] queue
  | length soln == 1            = dijkstra' src verts soln queue
  | length soln <  length verts = soln
  | length soln == length verts = soln
  where start  = verts !! src
        start' = start { known = True, distance = 0, path = verts !! src }
        queue  = SkewNode (head (adjacent start')) Empty Empty
        soln   = filter known verts

dijkstra' :: Int -> [Vertex] -> [Vertex] -> SkewHeap Edge -> [Vertex]
dijkstra' src verts soln queue
  | queue' == Empty = soln
  | queue' /= Empty = dijkstra' src verts soln' queue'
  where Just(minEdge, queue') = (extractMin queue)
        nextVert  = verts !! to minEdge
        path      = verts !! from minEdge
        dist      = distance path + weight minEdge
        nextVert' = nextVert { known = True, distance = dist, path = path }
        soln'     = nextVert' : soln

vs :: [Vertex]
vs = [v1, v2, v3, v4]

pretty x = Pretty.ppShow x
prettyPrint x = putStrLn (pretty x)

testDijkstra = do
  let source = 1
  let graph = vs
  let result = dijkstra source graph
  putStrLn "GRAPH"
  prettyPrint graph
  putStrLn "RESULT"
  prettyPrint result
  assert (length result == length vs) "Dijsktra should process all vertices in graph"

main :: IO ()
main = do
  putStrLn "Testing Dijkstra..."
  testDijkstra
  putStrLn "Passed All Dijkstra Tests!"
