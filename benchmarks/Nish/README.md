# Nish Benchmarks

Ports of the Are We Fast Yet benchmarks to [Nish](https://github.com/amritk/nish),
an ahead-of-time compiler from a static subset of TypeScript to LLVM IR.

Ported so far: Bounce, List, Mandelbrot, Permute, Queens, Storage, Towers.

## Building and running

Requires Node.js 22.18+ (CI uses 26) (for the `nish` launcher) and clang 18 with lld. On
Debian/Ubuntu, set `CC=clang-18` if only the versioned binary is installed.

```bash
./build.sh                   # npm install the pinned compiler, build ./harness
./harness Queens 10 1000     # benchmark, outer iterations, inner iterations
```

The harness prints the same `runtime: <n>us` lines as the other ports, so
ReBench reads it with the `RebenchLog` gauge adapter (`test-nish` in
`test.conf`, `steady-nish` in `rebench.conf`).

## Differences from the JavaScript version

Nish has no inheritance, no function values and no garbage collector, so:

- Each benchmark is a standalone class with its own `innerBenchmarkLoop`
  instead of subclassing `Benchmark`, and the harness selects one by name.
- There is no GC. The harness releases the arena after each measured
  iteration. Within one, the compiler's automatic arena scopes reclaim what
  each `benchmark()` call allocates (since nish 0.11.0).
- Storage's leaves are `(ArrayTree | null)[]` filled with `null`s. An inner
  node wraps each child array in an `ArrayTree`, because a Nish type cannot
  refer to itself except through a class.
- In List, `tail` checks for `null` explicitly before dereferencing, where
  JavaScript relies on the VM's implicit check.
- Array bounds checks stay on (the compiler's default). `--unchecked-indexing`
  exists but is not used.
