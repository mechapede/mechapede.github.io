---
title: Graphics
---

The graphical demo consists of two parts, a custom game engine, RastJS, and the graphical demo built using the program.

## RastJS

RastJS is a simple engine made from scratch for Webgl. The engine takes a JSON manifest file and loads and starts the code. The [source code](https://github.com/mechapede/rastjs) is available on Github.

## Terrain Demo

The terrain demo is a test project for RastJs. It contains the following rendering and terrain features:
* Perlin Noise Generated Terrain
* Height Based Texturing with Blending
* Water Animation
* Dynamic Vegetation Placement
* Transparent Meshes
* Skybox

These can be seen in the demo below.

{% include game.html %}

The [source code](https://github.com/mechapede/terra) is available on Github. 

I am not an artist. Assets are kindly provided by:
* Models - [Mikhail Bakhirev](https://www.cgtrader.com/free-3d-models/plant/other/lowpoly-pbr-rocks-and-foliage)
* Terrain Textures - [João Paulo](https://3dtextures.me/)
* Skybox - [Jockum Skoglund](https://opengameart.org/content/miramar-skybox)
