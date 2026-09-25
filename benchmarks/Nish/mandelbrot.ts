// This benchmark is adapted to match the SOM version.
//
// Copyright © 2004-2013 Brent Fulgham
//
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//
//   * Neither the name of "The Computer Language Benchmarks Game" nor the name
//     of "The Computer Language Shootout Benchmarks" nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
// FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
// DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
// CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
// OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// The Computer Language Benchmarks Game
// http://benchmarksgame.alioth.debian.org
//
//  contributed by Karl von Laudermann
//  modified by Jeremy Echols
//  modified by Detlef Reichl
//  modified by Joseph LaFata
//  modified by Peter Zotov
//
// http://benchmarksgame.alioth.debian.org/u64q/program.php?test=mandelbrot&lang=yarv&id=3
//
// Ported to Nish from the JavaScript version (benchmarks/JavaScript/mandelbrot.js).

export class Mandelbrot {
  innerBenchmarkLoop(innerIterations: i32): boolean {
    return this.verifyResult(this.mandelbrot(innerIterations), innerIterations);
  }

  verifyResult(result: i32, innerIterations: i32): boolean {
    if (innerIterations === 500) {
      return result === 191;
    }
    if (innerIterations === 750) {
      return result === 50;
    }
    if (innerIterations === 1) {
      return result === 128;
    }

    console.log(`No verification result for ${innerIterations} found`);
    console.log(`Result is: ${result}`);
    return false;
  }

  mandelbrot(size: i32): i32 {
    let sum = 0;
    let byteAcc = 0;
    let bitNum = 0;

    let y = 0;
    const sizeF = toF64(size);

    while (y < size) {
      const ci: f64 = (2.0 * toF64(y)) / sizeF - 1.0;
      let x = 0;

      while (x < size) {
        let zrzr: f64 = 0.0;
        let zi: f64 = 0.0;
        let zizi: f64 = 0.0;
        const cr: f64 = (2.0 * toF64(x)) / sizeF - 1.5;

        let z = 0;
        let notDone = true;
        let escape = 0;
        while (notDone && z < 50) {
          const zr: f64 = zrzr - zizi + cr;
          zi = 2.0 * zr * zi + ci;

          zrzr = zr * zr;
          zizi = zi * zi;

          if (zrzr + zizi > 4.0) {
            notDone = false;
            escape = 1;
          }
          z += 1;
        }

        byteAcc = (byteAcc << 1) + escape;
        bitNum += 1;

        if (bitNum === 8) {
          sum ^= byteAcc;
          byteAcc = 0;
          bitNum = 0;
        } else if (x === size - 1) {
          byteAcc <<= 8 - bitNum;
          sum ^= byteAcc;
          byteAcc = 0;
          bitNum = 0;
        }
        x += 1;
      }
      y += 1;
    }
    return sum;
  }
}
