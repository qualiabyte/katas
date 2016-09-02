
import Assert

-- Chapter 6: Recursion

-- Recursive Maximum
maximum' :: (Ord a) => [a] -> a
maximum' [] = error "maximum of empty list"
maximum' [x] = x
maximum' (x:xs)
    | x > maxTail = x
    | otherwise = maxTail
    where maxTail = maximum' xs

-- Recursive Replicate
replicate' :: (Num i, Ord i) => i -> a -> [a]
replicate' n x
    | n <= 0    = []
    | otherwise = x:replicate' (n-1) x

testMaximum = do
  let list = [ 1, 2, 3, 4, 5 ]
  let largest = maximum' list
  assert (largest == 5) "Recursive maximum should select largest from list"

testReplicate = do
  assert ((replicate 0 5) == []) "Replicate should repeat item zero times"
  assert ((replicate 3 5) == [5, 5, 5]) "Replicate should repeat item three times"

testChapter6 = do
  putStrLn "Running Chapter 6 tests..."
  testMaximum
  testReplicate
  putStrLn "Finished Chapter 6 tests..."

main = do
  putStrLn "Running Learn You A Haskell tests..."
  testChapter6
  putStrLn "Passed All Tests!"
