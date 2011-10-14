/*

Monkey is a very simple library used for traversing tree,
like an agile monkey.

Form of created tree:
-- creates new root node without value
-- all tree nodes are objects
-- children nodes are in a list 'children' parameter
-- data in node is in other parameters

*/

(function(global) {
    var __version = 0.01;
    var monkey = {};
    var baseTree = {};
    
    var baseTree = {
        hierarchyColumn: undefined,
        treeData: undefined
    };
    
    baseTree.insertNode = function(node) {
        var id = this.nodeId(node);
        var parentId = getParentId(id);
        var parentNode;
        
        if (!!parentId) {
            assertNodeInTree(this, parentId, 'createTree');
        }
        
        parentNode = this.getNode(parentId);
        node['children'] = [];
        insertChild(parentNode, node, this['hierarchyColumn']);
    };
    
    baseTree.getNode = function(id) {        
        var node;
        var maxLevel;
        var childId;
        var actLevel;
        
        assertId(id, 'getNode');
        
        node = this['treeData']['root'];
        if (id === null) return node;
        
        maxLevel = count(id, '-');
        for (actLevel = 0; actLevel <= maxLevel; ++actLevel) {
            childId = getIdOnLevel(id, actLevel);
            node = getChild(node, childId, this['hierarchyColumn']);
            if (!node) {
                return undefined;
            }
        }
        
        return node;
    };
    
    baseTree.parent = function(id) {
        var parentId;
        
        assertId(id, 'parent');
        
        parentId = getParentId(id);
        
        return this.getNode(id);
    };
    
    baseTree.root = function() {
        return this['treeData']['root'];
    };
    
    baseTree.leftSibling = function(id) {
        var parentId;
        var siblingsNodes;
        var i;
        var last;
        
        assertId(id, 'leftSibling');
        
        if ( isRootId(id) ) return undefined;
        
        parentId = getParentId(id);
        siblingsNodes = this.children(parentId);
        last = siblingsNodes.length;
        for (i = 1; i < last; ++i) {
            if (this.nodeId(siblingsNodes[i]) === id) {
                return siblingsNodes[i - 1];
            }
        }
        
        return undefined;
    };
    
    baseTree.rightSibling = function(id) {
        var parentId;
        var siblingsNodes;
        var nextToLast;
        var i;
        
        assertId(id, 'rightSibling');
        
        if ( isRootId(id) ) return undefined;
        
        parentId = getParentId(id);
        siblingsNodes = this.children(parentId);
        nextToLast = siblingsNodes.length - 1;
        for (i = 0; i < nextToLast; ++i) {
            if (this.nodeId(siblingsNodes[i]) === id) {
                return siblingsNodes[i + 1];
            }
        }
        
        return undefined;
    };
    
    baseTree.sibling = function(id, siblingNr) {
        var siblingsNodes;
        
        assertId(id, 'sibling');
        
        if ( isRootId(id) ) return (siblingNr === 0) ? this.root() : undefined;
        
        siblingsNodes = this.children(id);
        if (siblingNr < 0 || siblingsNodes.length <= siblingNr) return undefined;
        
        return siblingsNodes[siblingNr];
    };
    
    baseTree.children = function(id) {
        var node;
        
        assertId(id, 'children');
        
        node = this.getNode(id);
        
        return node['children'];
    };
    
    // it is the same as getNode, because if you have a node, you have subtree,
    // because the node knows about his children and so on
    baseTree.subtree = function(id) {
        assertId(id, 'subtree');
        
        return this.getNode(id);
    };
    
    // warning: if node contains objects, only their references will be copied
    baseTree.value = function(id) {
        var valueCopy;
        var node;
        
        assertId(id, 'value');
        
        valueCopy = {};
        node = this.getNode(id);
        
        if (!node) return undefined;
        
        valueCopy = copyNode(node);
        delete valueCopy['children'];
        
        return valueCopy;
    };
    
    baseTree.next = function(elem) {
        var childrenNodes;
        var rightNode;
        var parentId;
        var id;
        
        if (isIdType(elem)) {
            assertId(this.nodeId(elem), 'next');
            id = elem;
        } else {
            id = this.nodeId(elem);
        }
        
        childrenNodes = this.children(id);
        
        if (childrenNodes.length) return childrenNodes[0];
        
        rightNode = this.rightSibling(id);
        if ( !!rightNode ) return rightNode;
        
        parentId = getParentId(id);
        while ( !!parentId ) {
            rightNode = this.rightSibling(parentId);
            if ( !!rightNode ) return rightNode;
            parentId = getParentId(parentId);
        }
        
        return undefined;
    };
    
    baseTree.iterate = function(fun) {
        var root = this.root();
        var nextNode = this.next(root);
        
        while (!!nextNode) {
            fun(nextNode);
            nextNode = this.next(nextNode);
        }
    };
    
    baseTree.forEach = function(fun) {
        this.iterate(fun);
    };
    
    //TODO after basic creating tree is done
    baseTree.map = function(fun) {
        var root = this.root();
        var nextNode = this.next(root);
        var copiedNode;
        var modifiedNode;
        var copyTree = baseTree.spawnTree();
        
        copyTree['treeData'] = createTreeData(this['hierarchyColumn']);
        copyTree['hierarchyColumn'] = this['hierarchyColumn'];
        
        while (!!nextNode) {
            copiedNode = copyNode(nextNode);
            modifiedNode = fun(copiedNode);
            copyTree.insertNode(modifiedNode);
            nextNode = this.next(nextNode);
        }
        return copyTree;
    };
    
    baseTree.countSubtree = function(rootId) {
        var rootId = rootId || null;
        var counter;
        var nextNode;
        
        assertId(rootId, 'countSubtree');
        
        counter = (!!rootId) ? 1 : 0;
        nextNode = this.next(rootId);
        
        while (!!nextNode && isAncestor(rootId, nextNode)) {
            counter += 1;
            nextNode = this.next( this.nodeId(nextNode) );
        }
        
        return counter;
    };
    
    baseTree.countLevel = function(parentId) {
        assertId(parentId, 'countLevel');
        
        return this.children(parentId).length;
    };
    
    baseTree.spawnTree = function() {
        function BaseTree() {};
        BaseTree.prototype = baseTree;
        return new BaseTree();
    };
    
    baseTree.nodeId = function(node) {
        return node[ this['hierarchyColumn'] ];
    };
    
    baseTree.copy = function() {
        
    };
    
    ///////////////////////////////////////////////////////////////////////////
    //                           Tree creation                               //
    ///////////////////////////////////////////////////////////////////////////
    monkey.createTree = function(data, hierarchyColumn) {
        var newTree;
        
        assertList(data, 'createTree');
        
        newTree = baseTree.spawnTree();
        newTree['treeData'] = createTreeData(hierarchyColumn);
        newTree['hierarchyColumn'] = hierarchyColumn;
        
        data.forEach(function (newNode) {
            newTree.insertNode(newNode);
        });
        
        return newTree;
    }
    
    ///////////////////////////////////////////////////////////////////////////
    //                       TREE CREATION HELPER FUNCTIONS                  //
    ///////////////////////////////////////////////////////////////////////////
    var insertChild = function(parent, child, hierarchyColumn) {
        var childId;
        
        assertNode(parent);
        
        childId = child[hierarchyColumn];
        parent['children'].push(child);
        
        parent['children'].sort(function(el1, el2) {
            var idNr1 = parseInt( lastIdElement(el1[hierarchyColumn]) );
            var idNr2 = parseInt( lastIdElement(el2[hierarchyColumn]) );
            return idNr1 - idNr2;
        });
    };
    
    var getChild = function(node, childId, hierarchyColumn) {
        var childList;
        
        assertNode(node, 'getChild');
        assertNonEmptyString(childId, 'getChild');
        
        childList = node['children'].filter(function(e) {
            return e[hierarchyColumn] === childId;
        });
        
        return (childList.length > 0) ? childList[0] : undefined;
    };
    
    var createTreeData = function(hierarchyColumn) {
        var root = {};
        
        root[hierarchyColumn] = null;
        root['name'] = 'root';
        root['children'] = [];
        
        return { 'root': root };
    }
    
    
    ///////////////////////////////////////////////////////////////////////////
    //                          Tree traversal                               //
    ///////////////////////////////////////////////////////////////////////////
    
    ///////////////////////////////////////////////////////////////////////////
    //                         helper functions                              //
    ///////////////////////////////////////////////////////////////////////////
    var count = function(str, letter) {
        var counter;
        var i;
        var len;
        
        assertString(str, 'count');
        
        counter = 0;
        len = str.length;
        
        for (i = 0; i < len; ++i) {
            if (str[i] === letter) {
                ++counter;
            }
        }
        
        return counter;
    };
    
    var getParentId = function(id) {
        var lastIndex = id.lastIndexOf('-');
        
        return (lastIndex !== -1) ? id.substring(0, lastIndex) : null;
    };
    
    var getIdOnLevel = function(id, level) {
        var i;
        var len;
        
        assertNonEmptyString(id, 'getIdOnLevel');
        
        len = id.length;
        for (i = 0; i < len; ++i) {
            if (id[i] === '-') {
                --level;
                if (level < 0) break;
            }
        }
        
        return id.substring(0, i);        
    };
    
    var lastIdElement = function(id) {
        var lastPosition;
        
        assertNonEmptyString(id);
        
        lastPosition = id.lastIndexOf('-');
        
        return (lastPosition !== -1) ? id.substring(lastPosition + 1) : id;
    };
    
    var isAncestor = function(ancestorId, childId) {
        assertId(ancestorId);
        assertId(childId);
    
        if ( isRootId(ancestorId) ) return true;
        if (ancestorId.length >= childId.length) return false;        
        if (count(ancestorId, '-') >= count(childId, '-')) return false;
        
        return (ancestorId === childId.substring(0, ancestorId.length));
    };
    
    var isRootId = function(id) {
        return id === null;
    };
    
    // TODO
    var copyNode = function(node) {
        var property;
        var copyNode;
        var copyAttr = function(newobj, obj, attr) {
            var toCopy = obj[attr];
            if (typeof toCopy === 'Object') {
                
            } else if (typeof toCopy === 'Array') {
            
            } else {
                // neither Object, nor Array, can be copied in usual way
                newobj[attr] = obj[attr];
            }
        };
        
        copyNode = {};
        for (property in node) {
            if (node.hasOwnProperty(property) && property !== 'children') {
                copyAttr(copyNode, node, property);
            }
        }
        copyNode['children'] = [];
        
        return copyNode;
    };
    
    var isIdType = function(elem) {
        return elem === null || elem.constructor === String;
    };
    
    ///////////////////////////////////////////////////////////////////////////
    //                              asserts                                  //
    ///////////////////////////////////////////////////////////////////////////
    var assertList = function(value, msg) {
        if (value.constructor !== Array) {
            throw 'assertList: ' + msg;
        }
    };
    
    var assertString = function(value, msg) {
        if (value.constructor !== String && value !== '') {
            throw 'assertString' + msg;
        }
    };
    
    var assertNonEmptyString = function(value, msg) {
        if (value.constructor !== String && value !== '') {
            throw 'assertNonEmptyString' + msg;
        }
    };
    
    var assertNodeInTree = function(tree, id, msg) {
        if ( !tree.getNode(id) ) {
            throw 'assertNodeInTree' + msg;
        }
    };
    
    var assertNode = function(node, idColumn, msg) {
        if ( !node.hasOwnProperty(idColumn) &&
             assertList(node['children'], msg + '->assertNode') ) {
            throw 'assertNode(idColumn=' + idColumn + ')' + msg;
        }
    };
    
    var assertId = function(id, msg) {
        if (id !== null) {
            assertNonEmptyString(id, msg + '->assertId');
        }
    };
    
    global.monkey = monkey;
    
})(this);