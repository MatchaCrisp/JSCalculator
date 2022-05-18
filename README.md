# Javascript Mini-Calculator

## Introduction

This is a simple calculator built with the React library, using mathjs for the actual calculations. The logic observed here is **immediate execution**.

This calculator is project #4 of FreeCodeCamp(FCC)'s Front End Development Libraries Certification.

## Features

* input positive/negative integer/decimal numbers up to 22 digits.
* up to 22 digits in significant digits in terms of precision.
* scientific notation support.
* addition/subtraction/multiplication/division/modulo function.
* square/square root function.
* All Clear, Clear Entry, and backspace function.
* Up to 13 past calculations. (collapsible in mobile view)
* Set calculation to one of the past ones by clicking.
* numpad input support.

## changelog

### v0.1 Brainstorm
 - created app
 - installed gh-pages/mathjs
 * TODO:
 - Basic arithmetic +/-/*//
 - Sqrt/^2
 - negative numbers
 - AC/Del
 - integer operations
 - decimal operations
 - process calculation on enter/on new operator
 - scientific notation toggle
 - ON/OFF switch
 - calculation history/undo
 - on the fly number edit
 - history change

### v 0.3 Basics
 - basic positive float calculation
 - clear all, clear entry, backspace function
 - removed scientific notation
 - no leading zero/dupe zeroes/dupe decimal
 - no dupe operators
 * TODO:
 - sqrt/^2
 - negative numbers
 - consecutive calculations
 - calculation history
 - history change

### v0.4 Basics2
 - sqrt/^2
 - negative numbers
 - consecutive calculations
 - scientific notationn
 - backspace function with scientific notation
 * TODO:
 - refactor (extremely redundant and messy code)
 - FCC compliant negative number
 - FCC compliant display
 - calculation history
 - history change

### v0.5 MVP
 - FCC compliant calculations
 - refactored (to best of ability)
 - calculation history
 - modulo function
 - fixed:
   - issue of state changes dependent on previous states, resulting in fast calculations generating unpredictable results
   - issue of negative sign being seen as a valid operand
   - issue of recording history reflecting inaccurate/incomplete calculations
 * TODO:
 - SCSS
 - history change (time travel)
 - fix scientific notation not being properly counted in digit limit
 - truncation of numbers displayed in history
 - fix 30 digits too large to fit on display
 - add history size limit (20 perhaps?)

### v0.6 Feature update
 - history change
 - scientific notation now properly added to digit limit
 - fixed sqrt/pow behavior on complete calculations
 - added dynamic font-size for extremely large numbers
 - added infinity for numbers with 10+ digits after e
 - added appropriate response to undefined/infinity as op2/res
 - added history number truncation
 - added history size limit
 * in progress:
 - collapsible history (mobile only, how to display only last item while collapsed, how to ensure all items fit when expanded)
 * TODO:
 - SCSS
 - responsive design

### v0.7 almost release
 - responsive design (react based) at 900px breakpoint
 - collapsible history at below 900px
 * TODO:
 - source bg img
 - proper color scheme
 - test max history size and how it fits 

### v0.8 SCSS and troubleshooting
 - fixed +/-, e+, pow, sqrt handling behavior to match expectations
 - removed console.logs
 - bg img
 - color scheme
 - history key hashing
 - operator behavior testing (cannot reproduce infinity multiplication bug, added additional check in calcing method as precaution)
 - reduce history size to 13
 - fixed power staying off when resizing viewport above breakpoint
 - split history display text to put result always on the right
 * TODO:
 - split components
 - change readme
 - build&publish

### v1.0 build
 - split components
 - update readme.md
 - deleted unnecessary comments
 - deleted redundant imgs
 - build

### v 1.1 revisit
 - reorganize readme/changelog
 - remove unnecessary packages 
 - clean up file tree
 - add compatibility meta tag 
 - clean up index.html