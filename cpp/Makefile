
all: build test

build: build-hello

build-hello:
	g++ hello-world.cpp -o hello-world

test: test-hello

test-hello:
	./hello-world

.PHONY: all build test build-hello test-hello
