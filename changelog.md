# v0.1 Brainstorm
## new
 * created app
 * installed gh-pages/mathjs

## to do
 * Basic arithmetic +/-/*//
 * Sqrt/^2
 * negative numbers
 * AC/Del
 * integer operations
 * decimal operations
 * process calculation on enter/on new operator
 * scientific notation toggle
 * ON/OFF switch
 
 * calculation history/undo
 * on the fly number edit
 * history change

# v0.3 Basics
## new
 * basic positive float calculation
 * clear all, clear entry, backspace function
 * removed scientific notation
 * no leading zero/dupe zeroes/dupe decimal
 * no dupe operators

### to do
 * sqrt/^2
 * negative numbers
 * consecutive calculations

 * calculation history
 * history change

# v0.4 Basics2
## new
 * sqrt/^2
 * negative numbers
 * consecutive calculations
 * scientific notationn
 * backspace function with scientific notation

### to do
 * refactor (extremely redundant and messy code)
 * FCC compliant negative number
 * FCC compliant display

 * calculation history
 * history change

# v0.5 MVP
## new
 * FCC compliant calculations
 * refactored (to best of ability)
 * calculation history
 * modulo function
 * fixed:
   * issue of state changes dependent on previous states, resulting in fast calculations generating unpredictable results
   * issue of negative sign being seen as a valid operand
   * issue of recording history reflecting inaccurate/incomplete calculations

### to do
 * SCSS
 * history change (time travel)
 * fix scientific notation not being properly counted in digit limit
 * truncation of numbers displayed in history
 * fix 30 digits too large to fit on display
 * add history size limit (20 perhaps?)

# v0.6 Feature update
## new
 * history change
 * scientific notation now properly added to digit limit
 * fixed sqrt/pow behavior on complete calculations
 * added dynamic font-size for extremely large numbers
 * added infinity for numbers with 10+ digits after e
 * added appropriate response to undefined/infinity as op2/res
 * added history number truncation
 * added history size limit

## in progress
 * collapsible history (mobile only, how to display only last item while collapsed, how to ensure all items fit when expanded)

### to do
 * SCSS
 * responsive design

# v0.7 almost release
## new
 * responsive design (react based) at 900px breakpoint
 * collapsible history at below 900px

## to do
 * source bg img
 * proper color scheme
 * test max history size and how it fits 

# v0.7 SCSS and troubleshooting
## new
 * fixed +/-, e+, pow, sqrt handling behavior to match expectations
 * removed console.logs
 * bg img
 * color scheme
 * history key hashing
 * operator behavior testing (cannot reproduce infinity multiplication bug, added additional check in calcing method as precaution)
 * reduce history size to 13
 * fixed power staying off when resizing viewport above breakpoint
 * split history display text to put result always on the right

## to do
 * split components
 * change readme
 * build&publish