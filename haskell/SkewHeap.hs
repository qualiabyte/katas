
module SkewHeap where

-- SkewHeap defines a simple (minimum) priority queue.
data SkewHeap a = Empty | SkewNode a (SkewHeap a) (SkewHeap a) deriving (Eq, Show)

-- Merges two heaps into a single heap.
(+++) :: Ord a => SkewHeap a -> SkewHeap a -> SkewHeap a
heap1@(SkewNode x1 l1 r1) +++ heap2@(SkewNode x2 l2 r2)
  | x1 <= x2    = SkewNode x1 (heap2 +++ r1) l1
  | otherwise = SkewNode x2 (heap1 +++ r2) l2
Empty +++ heap = heap
heap +++ Empty = heap

-- Extracts minimum element from a heap.
extractMin Empty = Nothing
extractMin (SkewNode x l r ) = Just (x , l +++ r )

-- Creates a heap for a single element.
toHeap :: Ord a => a -> SkewHeap a
toHeap a = SkewNode a Empty Empty

-- Heapify a list of elements.
heapify :: Ord a => [a] -> SkewHeap a
heapify xs = case xs of [] -> Empty
                        [x] -> toHeap x
                        (x:xs) -> (toHeap x) +++ (heapify xs)
