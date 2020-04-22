---
title: Compiler
---

# Unnamed Compiler

The Unnamed Compiler is written in Java and compilers into JVM code. The language is a very small subset of the C language. An example program is shown below from a test case.

```c
int arrayMax (int[3] vals) {
    int i;
    int max;
    i = 1;
    max = vals[0];
    while(i  < 3){
        if( max < vals[i] ) {
            max = vals[i];
        }
        i = i + 1;
    }
    return max;
}

void main () {
    int[3] vals;
    vals[0] = 1;
    vals[1] = 7;
    vals[2] = 5;
    print arrayMax(vals);
}
```

The compiler is broken into multiple stages. 
1. Parsing and Tree Construction Using Antlr3
2. Type Checking
3. Intermediate Language(IR) Generation
4. IR to JVM Generation
5. (External) JVM Class Generation using Jasmin

The compiler outputs the Jasmin string representaion after stage 4. From there the code is generated into class files by Jasmin so it can be run on the JVM.

The Compiler is an academic exercise. Not all operators are supported and many compiler sanity checks are not performed. No optimizations are performed on the output.

The [source code](https://github.com/mechapede/UnnamedCompiler) is hosted on Github.
