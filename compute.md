---
title: Compute
---

The follwing demo is written in C/C++ and compiled into webassembly. 

## RNA Shape Prediction

The prediction algorithm takes a RNA sequence, made up of A, U, C, G, and produces a structure for the minimum score based scoring criteria.
The pairs AU, GU and GC pairs reduce the score. For any space left in a loop, the gap penalty applies. The gap size obeys the minimum gap size as specified.

The algorithm uses a recurrence relation with dynamic programing to find the minimum.

{% include alg.html %}

The [source code](https://github.com/mechapede/rna-predict) is available on Github. 
