
all: build test

build: build-hello build-hash

build-hash:
	g++ -std=c++11 -g Hash.cpp -c -o Hash.o
	g++ -std=c++11 -g HashTests.cpp -o HashTests.o

build-hello:
	g++ hello-world.cpp -o hello-world.o

test: test-hello test-hash

test-hash:
	./HashTests.o

test-hello:
	./hello-world.o

.PHONY: all build test build-hello test-hello
