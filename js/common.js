function move(arrayToReorder,sourceId, targetId) {
    let sourceIndex, targetIndex;
    for (let i = 0; i < arrayToReorder.length; i++) {
        if (arrayToReorder[i].taskId == sourceId) {
            sourceIndex = i;
        } else if (arrayToReorder[i].taskId == targetId) {
            targetIndex = i;
        }
    }
    //clone task state
    var reorderedTask = arrayToReorder.splice(0)
    let temp = reorderedTask[sourceIndex];
    reorderedTask[sourceIndex] = reorderedTask[targetIndex];
    reorderedTask[targetIndex] = temp;
    return reorderedTask
}
export {move}
