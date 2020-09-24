#!/usr/bin/env bash

SCRIPT_PATH="$(cd "$(dirname "$0")"; pwd -P)"

clang++ \
  -Wfatal-errors \
  -c $SCRIPT_PATH/src/main.cxx \
  -o $SCRIPT_PATH/3d-game-shaders-for-beginners.o \
  -std=gnu++11 \
  -O3 \
  -I/usr/include/python2.7/ \
  -I/usr/include/panda3d/ \
  -I/usr/include/eigen3/


clang++ \
  $SCRIPT_PATH/3d-game-shaders-for-beginners.o \
  -o $SCRIPT_PATH/3d-game-shaders-for-beginners \
  -L/usr/lib/x86_64-linux-gnu/panda3d \
  -lp3framework \
  -lpanda \
  -lpandafx \
  -lpandaexpress \
  -lpandaphysics \
  -lp3dtoolconfig \
  -lp3dtool \
  -lp3pystub \
  -lp3direct \
  -lpthread
