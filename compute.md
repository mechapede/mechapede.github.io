---
title: Compute
---

The following demo is written in C/C++ and compiled into WebAssembly. The demo is at the bottom of this page.

## RNA Shape Prediction

This article discusses enhancements of a RNA min energy prediction model
to efficiently find multiple optimal structures. First, a simple recurrence is introduced. Then, a modified recurrence is examined
to eliminate duplicate paths for finding multiple minimum structures. Finally, an in browser implementation is presented below.

Predicting RNA sequence structure has numerous applications. An RNA sequence is made up of four base pairs A, U, C and G. 
These pairs bond together to form complex structures. Each bond reduces the energy of the structure, increasing stability.
Stability increases the probability of the structure.

This model predicts the minimum energy structure using simple bonds of A:U, G:U and G:C. These pairs form loops, which can be nested, that reduce the energy.
Pseudoknots, bonds between pairs not in the same loop, are not considered in the model. Loops must meet a minimum size
and unpaired basses increase the energy of the structure.

This model uses a simple recurrence, with functions O for outer loop and N for inner loop calculations. The S function scores the pair, returning infinity
if the gap is too small, or the letters do not match. The variable G represents the gap penalty.

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
 N(i,j) &= N(i+1,j) + G \\
        &= N(i, j-1) + G  \\
        &= N(i+1, j-1) + S(i,j) \\
        &= \sum_{k=i+1}^{j-1} N(i,k) + N(k+1,j) \\
 N(i,i) &= G 
\end{align} $$

This relation can be implemented using dynamic programming for run time of $$O(N^3)$$ using $$O(N^2)$$ space, where N is length of sequence.
The min score and a min structure are derived from this calculation. However, finding multiple paths with this recurrence
is inefficient as it produces many duplicate paths for the same structure. Theses four issues are discussed below.

   1. Shifting allows any permutation of left and right. For example, LRL is same as LLR. 
      To fix this, add a restriction to continue right after first right.

   1. All left and all right shifts are same, as it is symmetrical. To fix this, penalize all right only moves.

   1. Spitting segments creates extra paths that may yield no loops. To fix this, penalize splits that do not have a loop.

   1. Multiple loops in a row can can be duplicated by different segment splits. Solution is to only allow left side of split to split again.

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
 F_N(i,j) &= F_N(i+1,j) + G \\
        &= R_N(i, j-1) + G  \\
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
 R_N(i,j) &= R_N(i,j-1) + G \\
        &= F_N(i+1, j-1) + S(i,j) \\
        &= \sum_{k=i+1}^{j-1} R_N(i,k) + L_N(k+1,j) \\
 N(i,i) &= \infty
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
 L_N(i,j) &= L_N(i+1,j) \\
        &= F_N(i+1, j-1) + S(i,j) \\
 L_N(i,i) &= \infty
\end{align} $$

This complex relation can be implemented using dynamic programming for run time of $$O(3N^3)$$ using $$O(3N^2)$$ space.
It allows finding all paths in $$O(3N^3 + MN)$$ using $$O(3N^2 + MN)$$ where M is the number of paths found. This provides a
good guarantee for performance. Limits on number of structures still need be imposed, as the number of min energy structures can be 
exponential.

A WebAssembly demo is shown below, with input values for scores. Matches pairs use braces and unmatched pairs are represented using dots.
The demo is limited to up to 1000 minimum structures.


{% include alg.html %}

The [source code](https://github.com/mechapede/rna-predict) is available on Github. 
