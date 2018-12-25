
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
        newLine(this);
    }
    else
    {
        // RESUME 
        // The purpose of coding Delete and Backspace tap is to avoid some browsers to remove the first line container when it's empty.
        if(event.key.toUpperCase() == "DELETE" || event.key.toUpperCase() == "BACKSPACE")
        {
            
        }
        if(event.key === 'Enter')
            event.preventDefault();
    }
};

//////////////////////////////////////////////////////
//////              Utilities                   //////
//////////////////////////////////////////////////////

function newLine($this) {
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

    // Delete the selected content.
    function deleteSelectedContent(node, startOffSet, endOffSet) {
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
     
    function getParentNode(node) {
        if(node.nodeType == Node.TEXT_NODE)
            return node.parentNode;
        return node;
    }

    function firstNode(lineContainerChilds, anchorNode, focusNode) {
        for (let i = 0; i < lineContainerChilds.length; i++) {
            if(lineContainerChilds.item(i) === anchorNode) return Object.create(null, {node: {value:anchorNode}, index: {value:i}});
            if(lineContainerChilds.item(i) === focusNode) return Object.create(null, {node: {value:focusNode}, index: {value:i}});
        }
    }

    function secondNode(node) {
        if(node == startNode)
        {
            node.startAt = startAt;
            endNode.startAt = 0;
            endNode.endAt = endAt;
            return endNode;
        }
        node.startAt = endAt;
        startNode.startAt = 0;
        startNode.endAt = startAt;
        return startNode;
    }

    

    
    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////  Process of breaking new line start here
    //////////////////////////////////////////////////////////////
    // The mission start from multiple conditions before breaking new line
    // the cause of that is to detect which state the user is to break a new line
    if(startNode.nodeType === Node.TEXT_NODE)
        startNode = startNode.parentNode;
    if(endNode.nodeType === Node.TEXT_NODE)
        endNode = endNode.parentNode;
    
    if(startNode === endNode){
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
            
            let text_node = firstNode(getParentNode(startNode).childNodes, startNode, endNode);
            let second_node = secondNode(text_node.node);
            if(second_node.nodeType == Node.TEXT_NODE)
            {
                text_node = text_node.node;
                while(text_node.nextSibling != second_node)
                    text_node.nextSibling.remove();
                deleteSelectedContent(text_node, text_node.startAt, text_node.textContent.length);
                deleteSelectedContent(second_node, second_node.startAt, second_node.endAt);
                resetSelection();
                breakNewLine();
            }
            else
            {
                if(text_node.index < second_node.endAt)
                {
                    for (let j = text_node.index+1; j < second_node.endAt; j++)
                        text_node.node.nextSibling.remove();
                    deleteSelectedContent(text_node.node, text_node.node.startAt, startNode.textContent.length);
                    resetSelection();
                    breakNewLine();
                }
                else
                {
                    for (let j = text_node.index; j > second_node.endAt; j--)
                        text_node.node.previousSibling.remove();
                    deleteSelectedContent(text_node.node, 0, text_node.node.startAt);
                    resetSelection();
                    breakNewLine();
                }
            }
        }
    }
    else
    {
        log('----- Multi line containers selected -----');

        let first_node = firstNode($this.childNodes, startNode, endNode).node;
        let second_node = secondNode(first_node);
        while (first_node.nextSibling !== second_node)
            first_node.nextSibling.remove();

        startNode = selection.anchorNode;
        endNode = selection.focusNode;
        // FIXME 
        first_node = firstNode(first_node.childNodes, selection.anchorNode, selection.focusNode).node;
        second_node = secondNode(first_node);

        if(first_node.nodeType == Node.TEXT_NODE) {
            while(first_node.nextSibling)
                first_node.nextSibling.remove();
            deleteSelectedContent(first_node, first_node.startAt, first_node.textContent.length);
        }
        else
            deleteSelectedContent(first_node, first_node.startAt, first_node.childNodes.length);

        let lineContainer = second_node;

        if(second_node.nodeType == Node.TEXT_NODE){
            while(second_node.previousSibling)
                second_node.previousSibling.remove();
            lineContainer = second_node.parentNode;
        }

        deleteSelectedContent(second_node, 0, second_node.endAt);

        if(lineContainer.firstChild.nodeType == Node.TEXT_NODE)
            selection.setPosition(lineContainer.firstChild, 0);
        else
            selection.setPosition(lineContainer, 0);
    }
}
