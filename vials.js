/*
    Vial game solver
*/

// Input
const colors = ['red', 'green', 'blue', 'purple', 'orange', 'light-blue', 'light-green', 'gray', 'pink'];
const vials = [
    ['green', 'blue', 'purple', 'light-green'],
    ['blue', 'red', 'orange', 'green'],
    ['pink', 'gray', 'green', 'light-blue'],
    ['orange', 'red', 'light-green', 'pink'],
    ['orange', 'light-green', 'light-blue', 'light-blue'],
    ['purple', 'orange', 'gray', 'gray'],
    ['red', 'blue', 'blue', 'light-green'],
    ['purple', 'pink', 'light-blue', 'green'],
    ['pink', 'purple', 'red', 'gray'],
    [],
    []
];
// encode colors
let newVials = vials.map(vial => vial.map(color => colors.indexOf(color)));
const vialDepth = 4;

/*
    Solve for above vials and depth, removing 70% of states to prevent overflow
*/
console.log(solve(newVials, vialDepth, 0.3))

/*
    Recursive breadth first algorithm that checks all possible solutions

    1. if no positions: return
    2. for each position in the recurse:
        for each vial: 
            if win: return
            else if there's another vial that can be added to: add new state and steps to next recurse
    3. recurse
*/

function solve(initialVials, vialDepth, sample) {

    const win = recurser([initialVials], [[]], vialDepth, 0, 0);

    return win;

    function recurser(states, steps, vialDepth, statesFound, statesSkipped) {
        let newStates = [];
        let newSteps = [];
        let stateIndex = 0;
        if(states.length == 0) {
            return `\nSearched ${statesFound} positions\nSkipped ${statesSkipped} positions (~${Math.round((statesSkipped / (statesFound + statesSkipped)) * 100)}%)\nFound no solution\n`
        }
        for(let state of states) {
            statesFound++;
            // check if state is a win
            if(state.every(vial => vial.length == vialDepth && [...new Set(vial)].length == 1 || vial.length == 0)) {
                const prettySteps = steps[stateIndex].map(e => `Pour ${colors[e[0]]} from vial ${e[1] + 1} to vial ${e[2] + 1}`).map((e, i) => `${i}. ${e}`).join('\n')
                return `\nSearched ${statesFound} positions\nSkipped ${statesSkipped} positions (~${Math.round((statesSkipped / (statesFound + statesSkipped)) * 100)}%)\nSolution:\n` + prettySteps + '\n';
            }
            // add new states
            let outVialIndex = 0;
            for(let outVial of state) {
                // if empty skip
                if(outVial.length == 0) {
                    outVialIndex++;
                    continue
                }
                // get pour amount and color
                let currColor = outVial[outVial.length - 1];
                let colorDepth = 1;
                
                let vialToIterate = [...outVial.slice(0, outVial.length - 1)]
                vialToIterate.reverse();
                for(let color of vialToIterate) {
                    if(color == currColor) {
                        colorDepth++;
                    } else {
                        break;
                    }
                }
    
                let outVialIfPoured = outVial.slice(0, outVial.length - colorDepth);
    
                let inVialIndex = 0;
                for(let inVial of state) {
                    // skip same vial
                    if(inVialIndex == outVialIndex) {
                        inVialIndex++;
                        continue;
                    }
                    // check if vial can be poured
                    else {
                        let topColor = inVial.slice(-1)[0];
                        let vialRoom = vialDepth - inVial.length;
                        if(inVial.length == 0 || topColor == currColor && vialRoom >= colorDepth) {
                            // get new inVial
                            let inVialIfPoured = [...inVial];
                            for(let n = 0; n < colorDepth; n++) {
                                inVialIfPoured.push(currColor);
                            }
    
                            if(Math.random() > (1 - sample)) {
                            // update state and steps
                            stateToAdd = [...state];
                            stateToAdd[outVialIndex] = outVialIfPoured;
                            stateToAdd[inVialIndex] = inVialIfPoured;
                            newStates.push(stateToAdd);
    
                            stepToAdd = [...steps[stateIndex]];
                            stepToAdd.push([currColor, outVialIndex, inVialIndex]);
                            newSteps.push(stepToAdd);
                            } else {
                                statesSkipped++
                            }
                        }
                        inVialIndex++;
                    }
                }
                outVialIndex++;
            }
            stateIndex++;
        }
        return recurser(newStates, newSteps, vialDepth, statesFound, statesSkipped);
    }
}
