---
title: Compute
---

The following demo is written in C/C++ and compiled into WebAssembly. Skip to the bottom of the page for the demo.

## RNA Shape Prediction

This article discusses enhancements to a modified version of Nussinov’s RNA min energy prediction model
to efficiently find multiple optimal structures. First, a simple recurrence is introduced. Then, a modified recurrence is examined
to eliminate duplicate paths for finding multiple minimum structures. Finally, an implementation is provided below.

Predicting RNA sequence structure has numerous applications. An RNA sequence is made up of four base pairs: A, U, C and G. 
These pairs bond together to form complex structures. Each bond reduces the energy of the structure, increasing stability.
Stability increases the probability of the structure.

Nussinov’s model predicts the minimum energy RNA structure using simple bonds of A:U, G:U and G:C. These pairs form loops, which can be nested, that reduce the energy.
Pseudoknots, bonds between pairs not in the same loop, are not considered in the model. This model uses a simple recurrence, which supports three operations.
The algorithm takes a sequence, and can shift a base pair, match two bases, or split the sequence in two. Loops must meet a minimum size 
and unpaired basses increase the energy of the structure. This model has been tweaked to only penalize bases within a loop, rather than all bases.

This tweaked model uses two recurrences. The functions O is for outer loop and N for inner loop calculations. The S function scores the pair, returning infinity
if the gap is too small, or if the bases do not match. The variable g represents the gap penalty. The variables i and j and the start and indices of the sub sequence.

### Simple Recurrence

$$
\begin{align}
 O(i,j) &= O(i+1,j) \\
        &= O(i, j-1)  \\
        &= N(i+1, j-1) + S(i,j) \\
        &= \sum_{k=i+1}^{j-1} O(i,k) + O(k+1,j) \\
 O(i,i) &= 0 
\end{align} 
$$
$$ \begin{align}
 N(i,j) &= N(i+1,j) + g \\
        &= N(i, j-1) + g  \\
        &= N(i+1, j-1) + S(i,j) \\
        &= \sum_{k=i+1}^{j-1} N(i,k) + N(k+1,j) \\
 N(i,i) &= g 
\end{align} $$

This relation can be implemented using dynamic programming for run time of $$O(N^3)$$ using $$O(N^2)$$ space, where N is length of sequence.
A min structure can be found by tracing back the recurrence. However, finding multiple paths with this recurrence
is inefficient as it produces many duplicate paths for the same structure. Four cases are discussed below.

   1. Shifting allows any permutation of left and right. Consider the structure *..(...)..*, which must shift left and right before the loop.
      The left and right dots can come in either order, creating duplicate paths. Adding a restriction, so all left shifts come first, fixes this issue.

   1. All left and all right shifts are same, as it is symmetrical. For example *...* can be three lefts or three rights. To fix this,
      penalize all right only moves.

   1. Spitting segments creates extra paths that can yield no loops. Penalizing segments splits that do not have a loop remove this issue.

   1. Multiple loops in a row can can be duplicated by different segment splits. Allowing only one is to only allow left side of split to split again.

The new proposed recurrence is much more complicated. Let the subscript O and N represent outer loop and inner loop. Then create three functions with 
subscripts, one for free movement, one for left only and one for right. Applying the tweaks above leads to the final recurrence:

### Free Recurrence

$$
\begin{align}
 F_O(i,j) &= F_O(i+1,j) \\
        &= R_O(i, j-1)  \\
        &= F_N(i+1, j-1) + S(i,j) \\
        &= \sum_{k=i+1}^{j-1} R_O(i,k) + L_O(k+1,j) \\
 F_O(i,i) &= 0 
\end{align} 
$$
$$ \begin{align}
 F_N(i,j) &= F_N(i+1,j) + g \\
        &= R_N(i, j-1) + g  \\
        &= F_N(i+1, j-1) + S(i,j) \\
        &= \sum_{k=i+1}^{j-1} R_N(i,k) + L_N(k+1,j) \\
 F_N(i,i) &= G 
\end{align} $$


### Right Recurrence 

$$
\begin{align}
 R_O(i,j) &= R_O(i,j-1) \\
        &= F_N(i+1, j-1) + S(i,j) \\
        &= \sum_{k=i+1}^{j-1} R_O(i,k) + L_O(k+1,j) \\
 R_O(i,i) &= \infty
\end{align} 
$$
$$ \begin{align}
 R_N(i,j) &= R_N(i,j-1) + g \\
        &= F_N(i+1, j-1) + S(i,j) \\
        &= \sum_{k=i+1}^{j-1} R_N(i,k) + L_N(k+1,j) \\
 R_N(i,i) &= \infty
\end{align} $$

### Left Recurrence

$$
\begin{align}
 L_O(i,j) &= L_O(i+1,j) \\
        &= F_N(i+1, j-1) + S(i,j) \\
 L_O(i,i) &= \infty
\end{align} 
$$
$$ \begin{align}
 L_N(i,j) &= L_N(i+1,j) + g \\
        &= F_N(i+1, j-1) + S(i,j) \\
 L_N(i,i) &= \infty
\end{align} $$

This complex relation can be implemented using dynamic programming for run time of $$O(3N^3)$$ using $$O(3N^2)$$ space.
It allows finding all paths in $$O(3N^3 + MN)$$ using $$O(3N^2 + MN)$$ where M is the number of min structures. This provides a
good bound for performance. Limits on number of structures should still be imposed, as the number of min energy structures can be 
exponential.

A WebAssembly implementation is shown below, with optional values for scores. Matches pairs use braces and unmatched pairs are represented using dots.
The demo is limited to up to 1000 minimum structures. The source code uses the above relation, but combines the recurrences into one shared function.

{% include alg.html %}

The [source code](https://github.com/mechapede/rna-predict) is available on Github. 
