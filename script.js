
/*********************************
     TODO 
    1 - Create breaking line code.
    2 - Code the Delete and Backspace tap.
    3 - Code the Space tap.
    4 - Code the placeholder.
    
***********************************/

/***********************************
     #Issues 
    - Unspected behaviour : Firefox selects also the textarea container while selecting the emojis
    - Unspected behaviour : Firefox add a BR element when taping space key 
    - Unspected behaviour : Chrome delete the first line container child when I delete the only letter or emoji left from the line container.
    - See the issue in the function deleteSelectedContent()
***********************************/

///////////////////////////////////////////
//////           Polyfills           //////
///////////////////////////////////////////

// Polyfill for ChildNode.remove() method
(function (arr) {
    arr.forEach(function (item) {
      if (item.hasOwnProperty('remove')) {
        return;
      }
      Object.defineProperty(item, 'remove', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function remove() {
          if (this.parentNode !== null)
            this.parentNode.removeChild(this);
        }
      });
    });
  })([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

// Polyfill for ChildNode.replaceWith() method
{function ReplaceWithPolyfill() {
'use-strict'; // For safari, and IE > 10
var parent = this.parentNode, i = arguments.length, currentNode;
if (!parent) return;
if (!i) // if there are no arguments
    parent.removeChild(this);
while (i--) { // i-- decrements i and returns the value of i before the decrement
    currentNode = arguments[i];
    if (typeof currentNode !== 'object'){
    currentNode = this.ownerDocument.createTextNode(currentNode);
    } else if (currentNode.parentNode){
    currentNode.parentNode.removeChild(currentNode);
    }
    // the value of "i" below is after the decrement
    if (!i) // if currentNode is the first argument (currentNode === arguments[0])
    parent.replaceChild(currentNode, this);
    else // if currentNode isn't the first
    parent.insertBefore(this.previousSibling, currentNode);
}
}
if (!Element.prototype.replaceWith)
    Element.prototype.replaceWith = ReplaceWithPolyfill;
if (!CharacterData.prototype.replaceWith)
    CharacterData.prototype.replaceWith = ReplaceWithPolyfill;
if (!DocumentType.prototype.replaceWith) 
    DocumentType.prototype.replaceWith = ReplaceWithPolyfill;}


let textarea = document.getElementById('textarea'),
    textarea2 = document.getElementById('textarea2'),
    log = console.log;

//////////////////////////////////////////////////
//////////////////////////////////////////////////


textarea.onkeydown = textarea2.onkeydown = function(event) {
    if(event.ctrlKey && event.key === "Enter")
    {
        event.preventDefault();
        newLineEvent(this);
    }
    else
    {
        // RESUME 
        // The purpose of coding Delete and Backspace tap is to avoid some browsers to remove the first line container when it's empty.
        if(event.key.toUpperCase() == "DELETE" || event.key.toUpperCase() == "BACKSPACE")
        {
            deleteEvent(this, event);
        }
        else
        {
            if(event.key == " "){
                // TODO 
                textarea.childNodes.item(0).childNodes.item(0).textContent += "\u202F";
                window.getSelection().setPosition(textarea.childNodes.item(0).childNodes.item(0), 
                            textarea.childNodes.item(0).childNodes.item(0).textContent.length)
                event.preventDefault();
            }
            if(event.key === 'Enter')
                event.preventDefault();
        }
    }
};

// BREAK NEW LINE EVENT
function newLineEvent($this) {
    let selection = window.getSelection(),
        range = document.createRange(),
        startAt = selection.anchorOffset,
        endAt = selection.focusOffset,
        startNode = selection.anchorNode,
        endNode = selection.focusNode;

    //////////////////////////////////////////////////////////// Some separated functions
    // NOTE  : Some functions will be usefull for other tasks.
    
    // This function is the one which break new line.
    function breakNewLine() {
        let newLine = document.createElement('div');
        
        if(endNode.nodeType == Node.TEXT_NODE) {
            // RESUME 
            // This condition works for Firefox and browsers that the target text nodes as first child.
            if(endAt == 0)
            {
                let lineContainer = endNode.parentElement;
                let countJumps = 0;
                do{
                    newLine.appendChild(endNode.cloneNode());
                    if(endNode.nextSibling == null) break;
                    endNode = endNode.nextSibling;
                    ++countJumps;
                }while(true);
                
                do{
                    if(!endNode.previousSibling){
                        lineContainer.childNodes[countJumps].remove();
                        if(!lineContainer.hasChildNodes())
                            lineContainer.appendChild(document.createElement('br'));
                        break;
                    }
                    endNode = endNode.previousSibling;
                    lineContainer.childNodes.item(lineContainer.childNodes.length - 1).remove();
                    --countJumps;
                }while(countJumps != -1);
                
                if(!newLine.hasChildNodes())
                    newLine.appendChild(document.createElement('br'));
                $this.insertBefore(newLine, lineContainer.nextSibling);
                selection.setPosition(lineContainer.nextSibling.firstChild, 0);
            }
            else{
                // RESUME 
                // Works for all browsers.
                if(endAt < endNode.textContent.length){
                    range.setStart(endNode, endAt);
                    range.setEnd(endNode, endNode.textContent.length);

                    let extractedContent = range.extractContents();

                    newLine.appendChild(extractedContent);

                    let lineContainer = endNode.parentElement;
                    let countJumps = 0;
                    while(endNode.nextSibling != null){
                        newLine.appendChild(endNode.nextSibling.cloneNode());
                        endNode = endNode.nextSibling;
                        ++countJumps;
                    }
                    while(countJumps != 0) {
                        endNode = endNode.previousSibling; 
                        lineContainer.childNodes.item(lineContainer.childNodes.length - 1).remove();
                        --countJumps;
                    }
                    if(!newLine.hasChildNodes())
                        newLine.appendChild(document.createElement('br'));    
                    
                    $this.insertBefore(newLine, lineContainer.nextSibling);
                    selection.setPosition(lineContainer.nextSibling.firstChild, 0);
                }
                else{
                    // RESUME 
                    // This condition works for all browsers.
                    if(endAt == endNode.textContent.length) {
                        let lineContainer = endNode.parentElement;
                        let countJumps = 0;
                        while(endNode.nextSibling != null){
                            newLine.appendChild(endNode.nextSibling.cloneNode());
                            endNode = endNode.nextSibling;
                            ++countJumps;
                        }
                        while(countJumps != 0) {
                            endNode = endNode.previousSibling;
                            lineContainer.childNodes.item(lineContainer.childNodes.length - 1).remove();
                            --countJumps;
                        }
                        if(!newLine.hasChildNodes())
                            newLine.appendChild(document.createElement('br'));    
                        
                        $this.insertBefore(newLine, lineContainer.nextSibling);
                        selection.setPosition(lineContainer.nextSibling, 0);
                    }
                }
            }
        }
        else{
            // RESUME 
            // This condition will be executed only for emojis or the line container.
        
            // For future issues, the commented condition must check if the selected node is an image, if it's it must go to the parent element, which is the container line.
            // if(endNode.nodeName == "IMG")

            range.setStart(endNode, endAt);
            range.setEnd(endNode, endNode.childNodes.length);

            let extractedContent = range.extractContents();

            extractedContent.childNodes.forEach(child => {
                newLine.appendChild(child.cloneNode());
            });
            
            if(!endNode.hasChildNodes())
                endNode.appendChild(document.createElement('br'));

            if(!newLine.hasChildNodes())
                newLine.appendChild(document.createElement('br'));
            
            $this.insertBefore(newLine, endNode.nextSibling);
            (newLine.firstChild.nodeType == Node.TEXT_NODE) 
                ? selection.setPosition(newLine.firstChild, 0) 
                : selection.setPosition(newLine, 0);
        }
    }
    
    // This function brings me the current element or elements that I will deal with, and some other informations,
    // such as caret position and from where selection started. 
    function resetSelection() {
        selection = window.getSelection();
        startAt = selection.anchorOffset;
        endAt = selection.focusOffset;
        startNode = selection.anchorNode;
        endNode = selection.focusNode;
    }


    if(handlingSingleLine(selection) == 1){
        log('----- Single line container -----');

        startNode = selection.anchorNode;
        endNode = selection.focusNode;

        if(startNode == endNode)
        {
            log('----- Anchor & Caret are in the same node -----');
            
            deleteSelectedContent(startNode, startAt, endAt);
            resetSelection();
            breakNewLine();
        }
        else
        {
            log('----- Anchor & Caret are [NOT] in the same node -----');
            
            // Find the first text node in the selected line container.
            startNode = firstNode(getParentNode(startNode).childNodes, startNode, endNode);
            // Get the second selected node. (It could a text node or the line container)
            endNode = secondNode(startNode, { anchorNode: selection.anchorNode, focusNode: selection.focusNode }, startAt, endAt);
            // Check if it is a text node.
            if(endNode.nodeType == Node.TEXT_NODE)
            {
                // Start to delete the line container's children between the first selected text node and the second selected text node.
                while(startNode.nextSibling != endNode)
                    startNode.nextSibling.remove();
                // Delete the selected content from the bothtext node.
                deleteSelectedContent(startNode, startNode.startAt, startNode.textContent.length);
                deleteSelectedContent(endNode, endNode.startAt, endNode.endAt);
                resetSelection();
                breakNewLine();
            }
            // If the second selected node is not a text node.
            else
            {
                // If the first text node's position is less than the last set of mouse selection.
                if(startNode.index < endNode.endAt)
                {
                    // Delete all the line container's children between the position of the first selected text node and the position of last set of mouse selection.
                    for (let j = startNode.index+1; j < endNode.endAt; j++)
                        startNode.nextSibling.remove();
                    deleteSelectedContent(startNode, startNode.startAt, startNode.textContent.length);
                    resetSelection();
                    breakNewLine();
                }
                // If the first text node's position was greater than the last set of mouse selection.
                else
                {
                    // Delete all the line container's children between the position of the first selected text node and the position of last set of mouse selection.
                    for (let j = startNode.index; j > endNode.endAt; j--)
                        startNode.previousSibling.remove();
                    deleteSelectedContent(startNode, 0, startNode.startAt);
                    resetSelection();
                    breakNewLine();
                }
            }
        }
    }
    else
    {
        log('----- Multi line containers selected -----');
        
        // Delete line containers between the first selected line container and the last selected line container.
        if(startNode.nodeType === Node.TEXT_NODE)
            startNode = startNode.parentNode;
        if(endNode.nodeType === Node.TEXT_NODE)
            endNode = endNode.parentNode;

        startNode = firstNode($this.childNodes, startNode, endNode);
        endNode = secondNode(startNode, { anchorNode:getParentNode(selection.anchorNode) , focusNode:getParentNode(selection.focusNode) }, startAt, endAt);
        while (startNode.nextSibling !== endNode)
            startNode.nextSibling.remove();
        
        // Reset startNode and endNode objects to the origin selected nodes.
        if(getParentNode(selection.anchorNode) == startNode) {
            startNode = selection.anchorNode;
            endNode = secondNode(startNode, { anchorNode:selection.anchorNode , focusNode:selection.focusNode }, startAt, endAt);
        }
        else {
            startNode = selection.focusNode;
            endNode = secondNode(startNode, { anchorNode:selection.anchorNode , focusNode:selection.focusNode }, startAt, endAt);
        }
        
        // Delete content of the first selected line container.
        if(startNode.nodeType == Node.TEXT_NODE) {
            while(startNode.nextSibling)
                startNode.nextSibling.remove();
            deleteSelectedContent(startNode, startNode.startAt, startNode.textContent.length);
        }
        else
            deleteSelectedContent(startNode, startNode.startAt, startNode.childNodes.length);

        let lineContainer = endNode;

        // Delete content of the second selected line container.
        if(endNode.nodeType == Node.TEXT_NODE){
            while(endNode.previousSibling)
                endNode.previousSibling.remove();
            lineContainer = endNode.parentNode;
        }

        deleteSelectedContent(endNode, 0, endNode.endAt);

        // Make focus on the appropriate node.
        if(lineContainer.firstChild.nodeType == Node.TEXT_NODE)
            selection.setPosition(lineContainer.firstChild, 0);
        else
            selection.setPosition(lineContainer, 0);
    }
}





// DELETE EVENT
function deleteEvent($this, event) {
    let selection = window.getSelection(),
        range = document.createRange(),
        startAt = selection.anchorOffset,
        endAt = selection.focusOffset,
        startNode = selection.anchorNode,
        endNode = selection.focusNode;

    // Get all information about the focused line container before deleting the content.
    let keyPressed = event.key.toUpperCase();
    let size = -1;
    if(endNode.nodeType == Node.TEXT_NODE)
        size = endNode.textContent.length;
    let focusedLineContainer = getParentNode(endNode);
    /*
    -------------- Some variables not used --------------
    let previousLineContainer = focusedLineContainer.previousSibling;
    let nextLineContainer = focusedLineContainer.nextSibling;
    let isFirstChild = focusedLineContainer == $this.firstChild;*/
    let sizeChilds = focusedLineContainer.childNodes.length;
    

    ////////////////////////////////////////////////////////////////////
    //////////
    //////////      Functions to call
    //////////
    ////////////////////////////////////////////////////////////////////

    function isEmpty(sizeChildren, currentLineContainer) {
        return (sizeChildren == 1 && currentLineContainer.firstChild.nodeName.toUpperCase() == "BR");
    }

    function deleteEmptyLineContainer(currentLineContainer, siblingLineContainer, detectiveChild) {
        if(siblingLineContainer) {
            if(siblingLineContainer[detectiveChild].nodeType == Node.TEXT_NODE)
            {
                if(keyPressed == "BACKSPACE")
                    selection.setPosition(siblingLineContainer[detectiveChild], siblingLineContainer[detectiveChild].textContent.length);
                else
                    selection.setPosition(siblingLineContainer[detectiveChild], 0);
            }
            else
            {
                if(keyPressed == "BACKSPACE")
                    selection.setPosition(siblingLineContainer, siblingLineContainer.childNodes.length);
                else
                    selection.setPosition(siblingLineContainer, 0);
            }
            
            currentLineContainer.remove();
            log('Delete Empty Line Container')
        }
    }
    
    function mergeTwoLineContainer(currentNode, siblingLineContainer, detectiveChild) {
        if(siblingLineContainer){
            if(siblingLineContainer[detectiveChild].nodeType == Node.TEXT_NODE)
            {
                log("the detected child of siblingLineContainer is a text")
                let textNode = siblingLineContainer[detectiveChild];
                if(currentNode.nodeType == Node.TEXT_NODE) {
                    // Redefine mergeTwoTexts() Function
                    function mergeTwoTexts(text1, text2) {
                        let length = text1.textContent.length;
                        let text1Parent = getParentNode(text1);
                        text1.textContent += text2.textContent;
                        selection.setPosition(text1, length);

                        while(text2.nextSibling)
                            text1Parent.appendChild(text2.nextSibling);

                        text1Parent.nextSibling.remove();
                    }

                    (keyPressed == "BACKSPACE")
                        ? mergeTwoTexts(textNode, currentNode)
                        : mergeTwoTexts(currentNode, textNode);
                }
                else {
                    if(keyPressed == "BACKSPACE"){
                        selection.setPosition(textNode, textNode.textContent.length);
                        let firstNode = currentNode.firstChild;
                        siblingLineContainer.appendChild(firstNode.cloneNode());
                        while (firstNode.nextSibling) 
                            siblingLineContainer.appendChild(firstNode.nextSibling);
                        currentNode.remove();
                    }
                    else{
                        selection.setPosition(currentNode, currentNode.childNodes.length);
                        currentNode.appendChild(textNode.cloneNode());
                        while (textNode.nextSibling) 
                            currentNode.appendChild(textNode.nextSibling);
                        siblingLineContainer.remove();
                    }
                }
            }
            else
            {
                log("the detected child of siblingLineContainer is not a text")
                let parentNode = getParentNode(currentNode);
                let length = siblingLineContainer.childNodes.length;
                let emtpy = isEmpty(length, siblingLineContainer);
                if(keyPressed == "BACKSPACE"){
                    if(emtpy){ siblingLineContainer.remove(); return; }

                    let firstNode = parentNode.firstChild;
                    siblingLineContainer.appendChild(firstNode.cloneNode());
                    while (firstNode.nextSibling) 
                        siblingLineContainer.appendChild(firstNode.nextSibling);
                    selection.setPosition(siblingLineContainer, length);
                    parentNode.remove();
                }
                else
                {
                    if(emtpy){ siblingLineContainer.remove(); return; }
                    if(currentNode == parentNode)
                        selection.setPosition(currentNode, currentNode.childNodes.length);
                    else
                        selection.setPosition(currentNode, currentNode.textContent.length);
                    let firstNode = siblingLineContainer.firstChild;
                    parentNode.appendChild(firstNode.cloneNode());
                    while (firstNode.nextSibling) 
                        parentNode.appendChild(firstNode.nextSibling);
                    siblingLineContainer.remove();
                }
            }
        }
    }

    function mergeTwoTexts(text1, text2) {
        let length = text1.textContent.length;
        text1.textContent += text2.textContent;
        selection.setPosition(text1, length);
        text2.remove();
    }

    ///////////////////////////////////////
    // ********************************* //
    ///////////////////////////////////////

    if(handlingSingleLine(selection))
    {
        log('Single Line Container');
        if(startNode == endNode && startAt == endAt)
        {
            log('No Selection');
            if(isEmpty(sizeChilds, focusedLineContainer)) {
                /////////////////////////////////////////////////////////////////////////////////////////////////////////
                //                                       Empty Line Container                                          //
                /////////////////////////////////////////////////////////////////////////////////////////////////////////

                log('Empty Line Container');
                event.preventDefault();
                (keyPressed == "BACKSPACE") ? deleteEmptyLineContainer(focusedLineContainer, focusedLineContainer.previousSibling, 'lastChild') 
                                            : deleteEmptyLineContainer(focusedLineContainer, focusedLineContainer.nextSibling, 'firstChild');
            }
            else {
                log('Not Empty Line Container');

                if(size > 0) {
                    /////////////////////////////////////////////////////////////////////////////////////////////////////////
                    //                                               Text Node                                             //
                    /////////////////////////////////////////////////////////////////////////////////////////////////////////

                    log('Text Node');
                    let cases = (endAt == 0) ? 0 : (endAt == size) ? 1 : -1;
                    switch (cases) {
                        // If the caret at the beginning of text content
                        case 0:
                            log('Case 0');
                            if(keyPressed == "BACKSPACE"){
                                event.preventDefault();
                                log('BACKSPACE')
                                if(endNode == focusedLineContainer.firstChild)
                                    mergeTwoLineContainer(endNode, focusedLineContainer.previousSibling, 'lastChild');
                                else
                                {
                                    if(endNode.previousSibling) {
                                        endNode.previousSibling.remove();
                                        let prevNode = endNode.previousSibling;
                                        if(prevNode && prevNode.nodeType == Node.TEXT_NODE)
                                            mergeTwoTexts(prevNode, endNode);
                                    }
                                }
                            }
                            else{
                                if(size == 1){
                                    event.preventDefault();
                                    if(endNode.parentNode.childNodes.length == 1)
                                        endNode.parentNode.appendChild(document.createElement('br'));
                                    endNode.remove();
                                }
                            }
                        break;

                        // If the caret at the end of text content
                        case 1:
                            log('Case 1');
                            if(keyPressed == "BACKSPACE"){
                                if(size == 1){
                                    event.preventDefault();
                                    if(endNode.parentNode.childNodes.length == 1)
                                        endNode.parentNode.appendChild(document.createElement('br'));
                                    endNode.remove();
                                }
                            }
                            else{
                                event.preventDefault();
                                log('DELETE');
                                if(endNode == focusedLineContainer.lastChild)
                                    mergeTwoLineContainer(endNode, focusedLineContainer.nextSibling, 'firstChild');
                                else{
                                    if(endNode.nextSibling) {
                                        endNode.nextSibling.remove();
                                        let nextNode = endNode.nextSibling;
                                        if(nextNode && nextNode.nodeType == Node.TEXT_NODE)
                                            mergeTwoTexts(endNode, nextNode);
                                    }
                                }
                            }
                        break;
                    }
                }
                else
                {
                    /////////////////////////////////////////////////////////////////////////////////////////////////////////
                    //                                          The Line Container                                         //
                    /////////////////////////////////////////////////////////////////////////////////////////////////////////
                    
                    log('Not a text');
                    if(keyPressed == 'BACKSPACE')
                    {
                        if(endAt == 0) {
                            event.preventDefault();
                            mergeTwoLineContainer(endNode, focusedLineContainer.previousSibling, 'lastChild');
                        }
                        else {
                            if(endAt == 1 && endNode.firstChild.nodeType != Node.TEXT_NODE && sizeChilds == 1)
                            {
                                event.preventDefault();
                                endNode.appendChild(document.createElement('br'));
                                endNode.firstChild.remove();
                            }
                            else
                            {
                                let currentNode = endNode.childNodes.item(endAt - 1);
                                if(currentNode.previousSibling && 
                                    currentNode.nextSibling &&
                                    currentNode.previousSibling.nodeType == Node.TEXT_NODE &&  
                                    currentNode.nextSibling.nodeType == Node.TEXT_NODE)
                                {
                                    event.preventDefault();
                                    mergeTwoTexts(currentNode.previousSibling, currentNode.nextSibling);
                                    currentNode.remove();
                                }
                            }
                        }
                    }
                    else
                    {
                        if(endAt == sizeChilds)
                        {
                            event.preventDefault();
                            mergeTwoLineContainer(endNode, focusedLineContainer.nextSibling, 'firstChild');
                        }
                        else
                        {
                            if(endAt == 0 && endNode.firstChild.nodeType != Node.TEXT_NODE && sizeChilds == 1)
                            {
                                event.preventDefault();
                                endNode.appendChild(document.createElement('br'));
                                endNode.firstChild.remove();
                            }
                            else
                            {
                                let currentNode = endNode.childNodes.item(endAt);
                                if(currentNode.previousSibling && 
                                    currentNode.nextSibling &&
                                    currentNode.previousSibling.nodeType == Node.TEXT_NODE &&  
                                    currentNode.nextSibling.nodeType == Node.TEXT_NODE)
                                {
                                    event.preventDefault();
                                    mergeTwoTexts(currentNode.previousSibling, currentNode.nextSibling);
                                    currentNode.remove();
                                }
                            }
                        }
                    }
                }
            }
        }
        else
        {
            log('There is a selection');
            if(startNode == endNode)
            {
                log('Same Node');
                
                event.preventDefault();
                if(startNode.nodeType == Node.TEXT_NODE)
                {
                    deleteSelectedContent(endNode, startAt, endAt);
                    selection.setPosition(endNode, (startAt < endAt) ? startAt : endAt);
                    return;
                }
                
                if(startAt > endAt) {
                    let tmp = endAt;
                    endAt = startAt;
                    startAt = tmp;
                }
                
                let prevNode = focusedLineContainer.childNodes.item(startAt - 1);
                let nextNode = focusedLineContainer.childNodes.item(endAt);
                
                deleteSelectedContent(endNode, startAt, endAt);
                if(prevNode 
                    && nextNode 
                    && prevNode.nodeType == Node.TEXT_NODE 
                    && nextNode.nodeType == Node.TEXT_NODE)
                {
                    let length = prevNode.textContent.length;
                    prevNode.textContent += nextNode.textContent;
                    selection.setPosition(prevNode, length);
                    nextNode.remove();
                    return;
                }
                
                selection.setPosition(endNode, startAt);
            }
            else
            {
                log('Not Same Node')
                event.preventDefault();
                
                startNode = firstNode(focusedLineContainer.childNodes, startNode, endNode);
                endNode = secondNode(startNode, { anchorNode: selection.anchorNode , focusNode: selection.focusNode }, startAt, endAt);
                
                if(endNode.nodeType == Node.TEXT_NODE)
                {
                    log('User selected from a text node to a text node');
                    while(startNode.nextSibling != endNode)
                        startNode.nextSibling.remove();
                    deleteSelectedContent(startNode, startNode.startAt, startNode.textContent.length);
                    deleteSelectedContent(endNode, endNode.startAt, endNode.endAt);
                    if(startNode.parentNode && endNode.parentNode)
                    {
                        let length = startNode.textContent.length;
                        startNode.textContent += endNode.textContent;
                        endNode.remove();
                        selection.setPosition(startNode, length);
                    }
                    else
                    {
                        // Wet Code 
                        (startNode.parentNode) 
                            ? selection.setPosition(startNode, startNode.startAt)
                            : selection.setPosition(focusedLineContainer, startNode.index);
                    }
                }
                else
                {
                    log('User selected from a line container node to a text node');
                    
                    if(startNode.index < endNode.endAt)
                    {
                        for (let j = startNode.index+1; j < endNode.endAt; j++)
                            startNode.nextSibling.remove();
                        deleteSelectedContent(startNode, startNode.startAt, startNode.textContent.length);
                        if(startNode.parentNode && startNode.nextSibling && startNode.nextSibling.nodeType == Node.TEXT_NODE)
                        {
                            let nextNode = startNode.nextSibling;
                            startNode.textContent += nextNode.textContent;
                            nextNode.remove();
                        }
                        // Wet Code 
                        (startNode.parentNode) 
                            ? selection.setPosition(startNode, startNode.startAt)
                            : selection.setPosition(focusedLineContainer, startNode.index);
                    }
                    else
                    {
                        for (let j = startNode.index; j > endNode.endAt; j--)
                            startNode.previousSibling.remove();
                        deleteSelectedContent(startNode, 0, startNode.startAt);
                        if(startNode.parentNode && startNode.previousSibling && startNode.previousSibling.nodeType == Node.TEXT_NODE)
                        {
                            let prevNode = startNode.previousSibling;
                            let length = prevNode.textContent.length;
                            prevNode.textContent += startNode.textContent;
                            startNode.remove();
                            selection.setPosition(prevNode, length);
                        }
                        else
                        {
                            // Wet Code 
                            (startNode.parentNode) 
                                ? selection.setPosition(startNode, 0)
                                : selection.setPosition(focusedLineContainer, endNode.endAt);
                        }
                    }
                }
            }
        }
    }
    else
    {
        log('----- Multi line containers selected -----');
        
        event.preventDefault();
        // Delete line containers between the first selected line container and the last selected line container.
        if(startNode.nodeType === Node.TEXT_NODE)
            startNode = startNode.parentNode;
        if(endNode.nodeType === Node.TEXT_NODE)
            endNode = endNode.parentNode;

        startNode = firstNode($this.childNodes, startNode, endNode);
        endNode = secondNode(startNode, { anchorNode:getParentNode(selection.anchorNode) 
                                        , focusNode:getParentNode(selection.focusNode) }
                                        , startAt, endAt);
        while (startNode.nextSibling !== endNode)
            startNode.nextSibling.remove();
        
        // Reset startNode and endNode objects to the origin selected nodes.
        if(getParentNode(selection.anchorNode) == startNode) {
            startNode = selection.anchorNode;
            endNode = secondNode(startNode, { anchorNode:selection.anchorNode , focusNode:selection.focusNode }, startAt, endAt);
        }
        else {
            startNode = selection.focusNode;
            endNode = secondNode(startNode, { anchorNode:selection.anchorNode , focusNode:selection.focusNode }, startAt, endAt);
        }
        
        // Delete content of the first selected line container.
        if(startNode.nodeType == Node.TEXT_NODE) {
            while(startNode.nextSibling)
                startNode.nextSibling.remove();
            deleteSelectedContent(startNode, startNode.startAt, startNode.textContent.length);
        }
        else
            deleteSelectedContent(startNode, startNode.startAt, startNode.childNodes.length);

        let lineContainer = endNode;

        // Delete content of the second selected line container.
        if(endNode.nodeType == Node.TEXT_NODE){
            while(endNode.previousSibling)
                endNode.previousSibling.remove();
            lineContainer = endNode.parentNode;
        }

        deleteSelectedContent(endNode, 0, endNode.endAt);

        mergeTwoLineContainer();

        // Make focus on the appropriate node.
        /* if(lineContainer.firstChild.nodeType == Node.TEXT_NODE)
            selection.setPosition(lineContainer.firstChild, 0);
        else
            selection.setPosition(lineContainer, 0); */
    }
}




/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

function handlingSingleLine(selection) {
    let startNode = selection.anchorNode,
        endNode = selection.focusNode;

    if(startNode.nodeType === Node.TEXT_NODE)
        startNode = startNode.parentNode;
    if(endNode.nodeType === Node.TEXT_NODE)
        endNode = endNode.parentNode;

    return (startNode === endNode);
}

function getParentNode(node) {
    if(node.nodeType == Node.TEXT_NODE)
        return node.parentNode;
    return node;
}

// Delete the selected content.
function deleteSelectedContent(node, startOffSet, endOffSet) {
    let range = document.createRange();
    let lineContainer = node;
    
    if(startOffSet > endOffSet) {
        let tmp = endOffSet;
        endOffSet = startOffSet;
        startOffSet = tmp;
    }

    if(node.nodeType == Node.TEXT_NODE)
    { 
        lineContainer = node.parentNode;
        if(startOffSet == 0 && node.textContent.length == endOffSet)
            node.remove();
        else
        {
            range.setStart(node, startOffSet);
            range.setEnd(node, endOffSet);
            range.deleteContents();
        }
        if(lineContainer.childNodes.length == 0)
            lineContainer.appendChild(document.createElement('br'));
        return;
    }
    
    range.setStart(node, startOffSet);
    range.setEnd(node, endOffSet);
    range.deleteContents();

    if(lineContainer.childNodes.length == 0)
        lineContainer.appendChild(document.createElement('br'));
}

function firstNode(lineContainerChilds, anchorNode, focusNode) {
    for (let i = 0; i < lineContainerChilds.length; i++) {
        if(lineContainerChilds.item(i) === anchorNode) { anchorNode.index = i; return anchorNode; };
        if(lineContainerChilds.item(i) === focusNode) { focusNode.index = i; return focusNode; };
    }
}

function secondNode(node, compareWith, startAt, endAt) {
    if(node == compareWith.anchorNode)
    {
        node.startAt = startAt;
        compareWith.focusNode.startAt = 0;
        compareWith.focusNode.endAt = endAt;
        return compareWith.focusNode;
    }
    node.startAt = endAt;
    compareWith.anchorNode.startAt = 0;
    compareWith.anchorNode.endAt = startAt;
    return compareWith.anchorNode;
}