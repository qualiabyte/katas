
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

testChapter6 = do
  putStrLn "Running Chapter 6 tests..."
  let list = [ 1, 2, 3, 4, 5 ]
  let largest = maximum' list
  assert (largest == 5) "Recursive maximum should select largest from list"
  putStrLn "Finished Chapter 6 tests..."

main = do
  putStrLn "Running Learn You A Haskell tests..."
  testChapter6
  putStrLn "Passed All Tests!"
