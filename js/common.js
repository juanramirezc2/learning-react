function move(arrayToReorder,sourceId, targetId) {
    let sourceIndex, targetIndex;
    for (let i = 0; i < state.tasks.length; i++) {
        if (state.tasks[i].taskId == sourceId) {
            sourceIndex = i;
        } else if (state.tasks[i].taskId == targetId) {
            targetIndex = i;
        }
    }
    //clone task state
    var reorderedTask = state.tasks.splice(0)
    let temp = reorderedTask[sourceIndex];
    reorderedTask[sourceIndex] = reorderedTask[targetIndex];
    reorderedTask[targetIndex] = temp;
    return reorderedTask
}
export {move}
