function move(arrayToReorder,sourceId, targetId) {
    let sourceIndex, targetIndex;
    //clone task state
    var reorderedTask = arrayToReorder.splice(0)
    for (let i = 0; i < reorderedTask.length; i++) {
        if (reorderedTask[i].taskId == sourceId) {
            sourceIndex = i;
        } else if (reorderedTask[i].taskId == targetId) {
            targetIndex = i;
        }
    }
    let temp = reorderedTask[sourceIndex];
    reorderedTask[sourceIndex] = reorderedTask[targetIndex];
    reorderedTask[targetIndex] = temp;
    return reorderedTask
}
export {move}
