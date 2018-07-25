export function getValuesOfBinding(binding, iterationResult) {
    return iterationResult.results.map((constr, index) => iterationResult.get(index, binding));
}
