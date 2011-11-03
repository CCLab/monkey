/*

Monkey is a very simple library used for traversing tree,
like an agile monkey.

Form of created tree:
-- creates new root node without value
-- all tree nodes are objects
-- children nodes are in a list 'children' parameter
-- parent node is in 'parent' parameter
-- data in node is in other parameters

*/

/*
Monkey version with parent attribute in nodes.
*/

(function(global) {
    var __version = 1.0;
    var monkey = {};
    var baseTree = {};
    
    // trees will inherit from this object
    var baseTree = {
        'idColumn': undefined,
        'treeData': undefined
    };
    
    ///////////////////////////////////////////////////////////////////////////
    //                           TREE CREATION                               //
    ///////////////////////////////////////////////////////////////////////////
    
    // Creates a new tree and copies data in it. Initial data is not changed.
    // Uses idColumn to define hierarchy.
    // Returns new tree.
    monkey.createTree = function(data, idColumn) {
        var newTree;
        var idColumn = idColumn || 'id';
        
        assertList(data, 'createTree');
        assertString(idColumn, 'createTree');
        
        newTree = baseTree.spawnTree();
        newTree['treeData'] = createTreeData(idColumn);
        newTree['idColumn'] = idColumn;
        
        data.forEach(function (newNode) {
            newTree.insertNode(newNode);
        });
        
        return newTree;
    };
    
    ///////////////////////////////////////////////////////////////////////////
    //                        TREE INTERFACE                                 //
    ///////////////////////////////////////////////////////////////////////////
    
    // Inserts value into this tree. Finds direct parent of a new node
    // by comparing id. If such node is not in tree, does not insert node.
    // If new node should be inserted in place where exists removed node,
    // then removed node is replaced with the new node.
    // Returns tree after insertion.
    baseTree.insertNode = function(value) {
        var replaceNode = function(oldNode, newNode) {
            var i;
            var parentNode;
            
            parentNode = oldNode['parent'];
            newNode['parent'] = parentNode;
            newNode['children'] = oldNode['children'];
            for (i = 0; i < parentNode['children'].length; ++i) {
                if (parentNode['children'][i] === oldNode) {
                    parentNode['children'][i] = newNode;
                    break;
                }
            }
            
            oldNode['children'].forEach(function(childNode) {
                childNode['parent'] = newNode;
            });
        };
        
        var id = this.nodeId(value);
        var parentId;
        var parentNode;
        var newNode;
        
        parentId = getParentId(id);
        parentNode = this.getNode(parentId);
        if (!parentNode) return this;        
        
        newNode = valueToNode(value, parentNode);
        
        if (this.isNodeRemoved(id)) {
            replaceNode(this.getNode(id, false), newNode);
        } else {        
            insertChild(parentNode, newNode, this['idColumn']);
        }
        
        return this;
    };
    
    // Removes a node or a subtree from this tree.
    // Returns tree after an element removal.
    baseTree.remove = function(elem, type) {
        var parentNode;
        var childNodes;
        var node;
        
        isIdType(elem) ? assertId(elem, 'removeNode') : assertNodeInTree(this, this.nodeId(elem), false, 'removeNode');
        assertRemoveType(type, 'baseTree.remove');
        
        parentNode = this.parent(elem);
        if (!parentNode) return this;
        
        node = isIdType(elem) ? this.getNode(elem) : elem;
        
        type === 'node' ? removeNode(parentNode, node, this['idColumn']) :
                          removeSubtree(parentNode, node, this['idColumn']);
        
        return this;
    };
    
    // Removes node from this tree. Will not remove the root node.
    // If this node has not removed children, it will be marked as removed but
    // it will remain in the tree until all his descendants are removed or
    // new node replaces it.
    // Returns tree after node removal.
    baseTree.removeNode = function(elem) {
        this.remove(elem, 'node');
        
        return this;
    };
    
    // Removes subtree from this tree. Will not remove subtree with
    // root the same as tree's root. Removes nodes without marking them as removed
    // (like in removeNode function).
    // Returns tree after subtree removal.
    baseTree.removeSubtree = function(elem) {
        this.remove(elem, 'subtree');
        
        return this;
    };
    
    // Finds node with specified id and returns it. If ignoreRemoved is true(default value),
    // then if node exists in the tree but was removed, undefined will be returned,
    // otherwise this node will be returned.
    // If node is not in the tree, undefined will be returned.
    baseTree.getNode = function(id, ignoreRemoved) {    
        var node;
        var ignoreRemoved = (ignoreRemoved === undefined) ? true : ignoreRemoved;
        
        assertId(id, 'getNode');
        
        node = this['treeData']['root'];
        if (id === null) return node;

        while (!!node && this.nodeId(node) !== id) {
            node = getChild(node, id, this['idColumn']);
        }
        
        if (!!node && this.isNodeRemoved(node) && ignoreRemoved) return undefined;
        
        return node;
    };
    
    // Returns parent node of element being a node or a node's id.
    // If copy is set to false(default value), reference is returned, otherwise
    // returns copy of parent without tree hierarchy info(parent and children).
    baseTree.parent = function(elem, copy) {
        var node;
        var copy = copy || false;
        
        if (isIdType(elem)) {
            assertId(elem, 'parent');
            
            node = this.getNode(elem);
        } else {
            assertNode(elem);
            
            node = elem;
        }
        
        //return (!!node) ? node['parent'] : undefined;
        if (copy) {
            return (!!node) ? deepCopy(node['parent']) : undefined;
        } else {
            return (!!node) ? node['parent'] : undefined;
        }
    };
    
    // Returns the root node of this tree.
    baseTree.root = function() {
        return this['treeData']['root'];
    };
    
    // Checks if elem(node or node's id) specifies the root node of this tree.
    baseTree.isRoot = function(elem) {
        var id = (isIdType(elem)) ? elem : this.nodeId(elem);
        
        return id === this.nodeId( this.root() );
    };
    
    // Returns true if node is marked to be removed, otherwise false
    baseTree.isNodeRemoved = function(elem) {
        var node;
        
        isIdType(elem) ? assertId(elem, 'isNodeRemoved') :
                         assertNode(elem, this['idColumn'], 'isNodeRemoved');
        
        node = isIdType(elem) ? this.getNode(elem, false) : elem;
        
        return (!!node) ? !!node['removed'] : false;
    };
    
    // Checks if ancestorNode is a ancestor of childNode.
    // Returns true if yes, otheriwse false.
    baseTree.isAncestor = function(ancestorNode, childNode) {
        var parentNode;
        
        assertNode(ancestorNode, this['idColumn'], 'isAncestor');
        assertNode(childNode, this['idColumn'], 'isAncestor');
        
        if (this.isRoot(ancestorNode)) {
            return !this.isRoot(childNode);
        }
        else if (this.isRoot(childNode)) {
            return false;
        }
        
        parentNode = this.parent(childNode);
        while (!this.isRoot(parentNode)) {
            if (this.nodeId(ancestorNode) === this.nodeId(parentNode)) return true;
            parentNode = this.parent(parentNode);
        }
        
        return false;
    };
    
    // Returns left sibling of node specified by elem(node or its id).
    // If the node has no left sibling, return undefined.
    // If copy is set to false(default value), reference is returned, otherwise
    // returns copy of left sibling node without tree hierarchy info(parent and children).
    baseTree.leftSibling = function(elem, copy) {
        var parentNode;
        var siblingsNodes;
        var i;
        var last;
        var id;
        var copy = copy || false;
        
        isIdType(elem) ? assertId(elem, 'leftSibling') : assertNodeInTree(this, this.nodeId(elem), false, 'leftSibling');
        
        if (this.isRoot(elem)) return undefined;
        
        id = isIdType(elem) ? elem : this.nodeId(elem);
        parentNode = this.parent(elem);
        siblingsNodes = this.children(parentNode);
        last = siblingsNodes.length;
        for (i = 1; i < last; ++i) {
            if (this.nodeId(siblingsNodes[i]) === id) {
                if (copy) {
                    return deepCopy(siblingsNodes[i - 1]);
                } else {
                    return siblingsNodes[i - 1];
                }
            }
        }
        
        return undefined;
    };
    
    // Returns right sibling of node specified by elem(node or its id).
    // If the node has no right sibling, return undefined.
    // If copy is set to false(default value), reference is returned, otherwise
    // returns copy of right sibling node without tree hierarchy info(parent and children).
    baseTree.rightSibling = function(elem, copy) {
        var parentNode;
        var siblingsNodes;
        var i;
        var nextToLast;
        var id;
        var copy = copy || false;
        
        isIdType(elem) ? assertId(elem, 'leftSibling') : assertNodeInTree(this, this.nodeId(elem), false, 'leftSibling');
        
        if ( this.isRoot(elem) ) return undefined;
        
        id = isIdType(elem) ? elem : this.nodeId(elem);
        parentNode = this.parent(elem);
        siblingsNodes = this.children(parentNode);
        nextToLast = siblingsNodes.length - 1;
        for (i = 0; i < nextToLast; ++i) {
            if (this.nodeId(siblingsNodes[i]) === id) {
                if (copy) {
                    return deepCopy(siblingsNodes[i + 1]);
                } else {
                    return siblingsNodes[i + 1];
                }
            }
        }
        
        return undefined;
    };
    
    // Returns sibling of node specified by elem(node or its id),
    // sibling is specified by number which is number of it on
    // his parent's list. If such a node can not be found, returns undefined.
    // If copy is set to false(default value), reference is returned, otherwise
    // returns copy of sibling node without tree hierarchy info(parent and children).
    baseTree.sibling = function(elem, siblingNr, copy) {
        var siblingsNodes;
        var copy = copy || false;
        
        isIdType(elem) ? assertId(elem, 'sibling') : assertNodeInTree(this, this.nodeId(elem), false, 'sibling');
        assertNumber(siblingNr, 'sibling');
        
        if ( this.isRoot(elem) ) return (siblingNr === 0) ? this.root() : undefined;
        
        siblingsNodes = this.children(this.parent(elem));
        
        if (0 <= siblingNr && siblingNr < siblingsNodes.length) {
            if (copy) {
                return deepCopy(siblingsNodes[siblingNr]);
            } else {
                return siblingsNodes[siblingNr];
            }
        } else {
            return undefined;
        }
    };
    
    // Returns children nodes of a node specified by elem(node or its id).
    // If copy is set to false(default value), references are returned, otherwise
    // returns copies of nodes, each copy without tree hierarchy info(parent and children).
    baseTree.children = function(elem, copy) {
        var node;
        var copy = !!copy || false;
        
        isIdType(elem) ? assertId(elem, 'children') : assertNodeInTree(this, this.nodeId(elem), false, 'children');
        
        node = isIdType(elem) ? this.getNode(elem) : elem;
        
        if (copy) {
            return (!!node) ? node['children'].map(function(childNode) {
                                  return deepCopy(childNode);
                              }) : [];
        } else {
            return (!!node) ? node['children'] : [];
        }
    };
    
    // Return subtree which root is node specified by elem(node or its id).
    // If copy is set to false(default value), reference is returned, otherwise
    // returns new tree with nodes from subtree and changed ids.
    baseTree.subtree = function(elem, copy) {
        var copySubtree = function(srcTree, dstTree, node) {
            dstTree.insertNode(srcTree.value(node));
            
            srcTree.children(node).forEach( function(childNode) {
                copySubtree(srcTree, dstTree, childNode);
            });
            
            // must be done after inserting his children
            if (srcTree.isNodeRemoved(node)) {
                dstTree.removeNode(node);
            }
        };
        var cutId = function(id, level) {
            var idx = 0;
            
            // remove part of higher levels (higher than new first level node)
            while (!!level) {
                if (id[idx] === '-') --level;
                ++idx;
            }
            id = id.substring(idx);
            
            // replace first level id number with 1
            while (id[idx] !== '-' && idx < id.length) ++idx;
            id = id.substring(idx);
            
            return '1-' + id;
        };
        
        var copy = copy || false;
        var newTree;
        var subtreeNode;
        var level;
        
        isIdType(elem) ? assertId(elem, 'subtree') : assertNodeInTree(this, this.nodeId(elem), false, 'subtree');
        subtreeNode = isIdType(elem) ? this.getNode(elem) : elem;
        
        if (!copy) {
            return subtreeNode;
        } else {
            level = count(srcTree.nodeId(subtreeNode));
            newTree = this.spawnTree();
            newTree['treeData'] = createTreeData(this['idColumn']);
            newTree['idColumn'] = this['idColumn'];
            copySubtree(this, newTree, subtreeNode);
            
            return newTree.map(function(node) {
                node[newTree['idColumn']] = cutId(node[newTree['idColumn']], level);
                return node;
            });
        }
    };
    
    // Returns value of node specified by elem(node or its id).
    baseTree.value = function(elem) {
        var valueCopy;
        var node;
        
        isIdType(elem) ? assertId(elem, 'value') : assertNodeInTree(this, this.nodeId(elem), false, 'value');
        
        node = isIdType(elem) ? this.getNode(elem) : elem;
        
        if (!node) return undefined;

        valueCopy = deepCopy(node, false);
        
        return valueCopy;
    };
    
    // Returns next node of node specified by elem(node or its id). Next node is chosen
    // according to parent-left-right traversing direction. If it is the last node,
    // returns undefined. If ignoreRemoved is true(default value), then next will return next
    // not removed node, otherwise removed attribute will not matter.
    baseTree.next = function(elem, ignoreRemoved) {
        var getNextNode = function(tree, elem) {
            var childNodes;
            var rightSiblingNode;
            var ancestorNode;
            
            childNodes = tree.children(elem);
            if (childNodes.length) return childNodes[0];
            
            rightSiblingNode = tree.rightSibling(elem);
            if ( !!rightSiblingNode ) return rightSiblingNode;
            
            if ( tree.isRoot(elem) ) return undefined;
            
            ancestorNode = tree.parent(elem);
            while ( !tree.isRoot(ancestorNode) ) {
                rightSiblingNode = tree.rightSibling(ancestorNode);
                if ( !!rightSiblingNode ) return rightSiblingNode;
                ancestorNode = tree.parent(ancestorNode);
            }
            
            return undefined;
        };
        var nextNode;
        var ignoreRemoved = (ignoreRemoved === undefined) ? true : ignoreRemoved;
        
        isIdType(elem) ? assertId(elem, 'next') : assertNodeInTree(this, this.nodeId(elem), false, 'next');
        
        nextNode = getNextNode(this, elem);
        while (ignoreRemoved && !!nextNode && this.isNodeRemoved(nextNode)) {
            nextNode = getNextNode(this, nextNode);
        }
        
        return nextNode;
    };
    
    // Iterates over this tree and calls fun function, which is given
    // one argument: actual node. Returns the tree.
    baseTree.iterate = function(fun) {
        var nextNode = this.next(this.root());
        var copiedNode;
        
        while (!!nextNode) {
            copiedNode = this.value(nextNode);
            fun(copiedNode);
            nextNode = this.next(nextNode);
        }
        
        return this;
    };
    
    // Does the same as iterate. Returns the tree.
    baseTree.forEach = function(fun) {
        this.iterate(fun);
        
        return this;
    };
    
    // Equivalent of map for lists. Creates new tree and inserts into it nodes
    // that are results of passed function fun, which gets actual node as argument.
    // Returns new tree.
    baseTree.map = function(fun) {
        var nextNode = this.next(this.root());
        var copiedNode;
        var modifiedNode;
        var copiedTree = baseTree.spawnTree();
        
        copiedTree['treeData'] = createTreeData(this['idColumn']);
        copiedTree['idColumn'] = this['idColumn'];
        
        while (!!nextNode) {
            copiedNode = deepCopy(nextNode, true);
            modifiedNode = fun(copiedNode);
            copiedTree.insertNode(modifiedNode);
            nextNode = this.next(nextNode);
        }
        
        return copiedTree;
    };
    
    // Returns number of nodes in subtree with root specified by elem(node or its id).
    baseTree.countSubtree = function(elem) {
        var elem = elem || this.root();
        var subtreeRoot;
        var counter;
        var nextNode;
        
        isIdType(elem) ? assertId(elem, 'countSubtree') : assertNodeInTree(this, this.nodeId(elem), false, 'countSubtree');
        
        subtreeRoot = isIdType(elem) ? this.getNode(elem) : elem;
        if (!subtreeRoot) return 0;
        
        counter = this.isRoot(subtreeRoot) ? 0 : 1;
        nextNode = this.next(subtreeRoot);
        
        while (!!nextNode && this.isAncestor(subtreeRoot, nextNode)) {
            counter += 1;
            nextNode = this.next(nextNode);
        }
        
        return counter;
    };
    
    // Returns number of nodes on level of elem(node or its id).
    baseTree.countLevel = function(elem) {
        var siblings;
        var parentNode;
        
        isIdType(elem) ? assertId(elem, 'countLevel') :
                         assertNodeInTree(this, this.nodeId(elem), false, 'countLevel');

        if (this.isRoot(elem)) return 0;
        
        parentNode = this.parent(elem);
        if (!parentNode) return 0;
        siblings = this.children(parentNode);
        
        return siblings.length;
    };
    
    // Returns id of a node.
    baseTree.nodeId = function(node) {
        return node[ this['idColumn'] ];
    };
    
    // Copies tree and returns copied instance.
    baseTree.copy = function(tree) {
        return this.map(function(node) {
            return node;
        });
    };
    
    // Copies nodes' values(no hierarchy information) from this tree to
    // a list in order specified by next function.
    // Returns created list.
    baseTree.toList = function() {
        var saveInList = function(node) {
            list.push(nodeToValue(node));
        };
        
        var list = [];
        
        this.forEach(saveInList);
        
        return list;
    }
    
    // Creates and returns an object with tree methods.
    baseTree.spawnTree = function() {
        function BaseTree() {};
        BaseTree.prototype = baseTree;
        return new BaseTree();
    };
    
    
    ///////////////////////////////////////////////////////////////////////////
    //                       TREE CREATION HELPER FUNCTIONS                  //
    ///////////////////////////////////////////////////////////////////////////
    
    // Inserts childNode to parentNodes children collection.
    // Sorts nodes after insertion.
    var insertChild = function(parentNode, childNode, idColumn) {
        assertNode(parentNode);
        
        parentNode['children'].push(childNode);
        
        sortNodes(parentNode['children'], idColumn);
    };
    
    // Removes subtree with root childNode or only childNode from
    // parentNode's children collection. IdColumn contains ids,
    // type specifies type of removal: 'node' or 'subtree'.
    var remove = function(parentNode, childNode, idColumn, type) {
        var canBeRemoved = function(node) {
            var childNodes;
            var allChildrenRemoved;
            var i;
            
            assertNode(node);
            assertId(idColumn);
            
            allChildrenRemoved = true;
            for (i = 0; i < node['children'].length; ++i) {
                if (!node['children'][i]['removed']) {
                    allChildrenRemoved = false;
                    break;
                } else {
                    allChildrenRemoved &= canBeRemoved(node['children'][i]);
                }
            }
            
            return allChildrenRemoved;
        };
        var i;
        var childNodes;
        
        assertNode(parentNode);
        assertNode(childNode);
        assertRemoveType(type);
        
        childNodes = parentNode['children'];
        id = childNode[idColumn];
        
        for (i = 0; i < childNodes.length; ++i) {
            if (id === childNodes[i][idColumn]) {
                break;
            }
        }
        
        if (type === 'subtree') {
            childNodes.splice(i, 1);
        } else {
            if (canBeRemoved(childNodes[i])) {
                childNodes.splice(i, 1);
                if (!!parentNode['removed']) {
                    remove(parentNode['parent'], parentNode, idColumn, 'node');
                }
            } else {
                childNodes[i]['removed'] = true;
            }
        }
    };
    
    // Removes node childNode from parentNodes children collection,
    // idColumn is name of attribute with node's ids.
    var removeNode = function(parentNode, childNode, idColumn) {
        remove(parentNode, childNode, idColumn, 'node');
    };
    
    // Removes subtree with root childNode from parentNode's children collections,
    // idColumn is name of attribute with node's ids.
    var removeSubtree = function(parentNode, childNode, idColumn) {
        remove(parentNode, childNode, idColumn, 'subtree');
    };
    
    // Returns childNode with id = childId from node's children collection,
    // idColumn is name of attribute with node's ids.
    var getChild = function(node, childId, idColumn) {
        var childrenList;
        
        assertNode(node, 'getChild');
        assertNonEmptyString(childId, 'getChild');
        
        childrenList = node['children'].filter(function(e) {
            var level = count(e[idColumn], '-');
            var levelId = getIdOnLevel(childId, level);
            return e[idColumn] === levelId;
        });
        
        return (childrenList.length > 0) ? childrenList[0] : undefined;
    };
    
    // Creates tree hierarchy with root node,
    // idColumn is name of attribute with node's ids.
    var createTreeData = function(idColumn) {
        var root = {};
        
        root[idColumn] = null;
        root['name'] = 'root';
        root['children'] = [];
        root['parent'] = undefined;
        
        return { 'root': root };
    };
    
    ///////////////////////////////////////////////////////////////////////////
    //                      OTHER HELPER FUNCTIONS                           //
    ///////////////////////////////////////////////////////////////////////////
    
    // Returns number of occurences of letter in string str.
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
    
    // Returns id that will have the closest possible parent of node
    // with id = id.
    var getParentId = function(id) {
        var lastIndex = id.lastIndexOf('-');
        
        return (lastIndex !== -1) ? id.substring(0, lastIndex) : null;
    };
    
    // Returns id on specified level(returns id cut off in place when
    // separator number level+1 starts, separator is "-")
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
    
    // Returns copy of a node without children collection and parent node.
    var copyNode = function(node) {
        var property;
        var copyNode;
        var copyAttr = function(newobj, obj, attr) {
            var toCopy = obj[attr];
            if (typeof toCopy !== 'Object' && typeof toCopy !== 'Array') {
                // neither Object, nor Array, can be copied in usual way
                newobj[attr] = obj[attr];
            }
        };
        
        copyNode = {};
        for (property in node) {
            // parent and children properties will not copied(look at copyAttr)
            if (node.hasOwnProperty(property)) {
                copyAttr(copyNode, node, property);
            }
        }
        copyNode['children'] = [];
        copyNode['parent'] = undefined;
        
        return copyNode;
    };
    
    // Returns deep copy of value.
    // if copyAll is set to true, then also children and parent attributes
    // will be copied, default is false.
    var deepCopy = function(value, copyAll) {
        var property;
        var objectCopy;
        var arrayCopy;
        var copyAll = copyAll || false;
        
        if (value === undefined || value === null)
            return value;
        else if (value.constructor !== Object && value.constructor !== Array) {
            return value;
        }
        else if (value.constructor === Object) {
            objectCopy = {};
            for (property in value) {
                if (value.hasOwnProperty(property)) {
                    if (!copyAll && (property === 'children' || property === 'parent'))
                        continue;
                        
                    objectCopy[property] = deepCopy(value[property]);
                }
            }
            return objectCopy;
        }
        else {
            arrayCopy = [];
            value.forEach(function(e) {
                arrayCopy.push(deepCopy(e, copyAll));
            });
            return arrayCopy;
        }
    };
    
    // Returns true if elem can be id, otherwise false.
    var isIdType = function(elem) {
        return elem === null || elem.constructor === String;
    };
    
    // Returns node that is created from value, parent node is set.
    var valueToNode = function(value, parentNode) {
        var node;
        
        node = deepCopy(value, true);
        node['parent'] = parentNode;
        node['children'] = [];
        
        return node;
    };
    
    // Returns value of node, does not contain children collection and parent node.
    var nodeToValue = function(node) {
        return deepCopy(node, true);
    };
    
    // Sorts nodes by their ids, that are kept in idColumn attribute in each node.
    var sortNodes = function(nodes, idColumn) {
        var compareId = function(id1, id2) {
            var i;
            var idPart1;
            var idPart2;
            var minLength = Math.min(id1.length, id2.length);
            
            for (i = 0; i < minLength; ++i) {
                idPart1 = parseInt(id1[i]);
                idPart2 = parseInt(id2[i]);
                if (idPart1 !== idPart2) {
                    return idPart1 - idPart2;
                }
            }
            return 0;
        };
        
        assertList(nodes, 'sortNodes');
        
        nodes.sort(function(node1, node2) {
            var idNr1 = node1[idColumn].split('-');
            var idNr2 = node2[idColumn].split('-');
            
            return compareId(idNr1, idNr2);
        });
    };
    
    ///////////////////////////////////////////////////////////////////////////
    //                            ASSERTIONS                                 //
    ///////////////////////////////////////////////////////////////////////////
    var assertList = function(list, msg) {
        if (list.constructor !== Array) {
            throw 'assertList(list=' + list + '): ' + msg;
        }
    };
    
    var assertString = function(str, msg) {
        if (str.constructor !== String) {
            throw 'assertString(str=' + str + '): ' + msg;
        }
    };
    
    var assertNonEmptyString = function(str, msg) {
        if (str.constructor !== String && str !== '') {
            throw 'assertNonEmptyString(str=' + str + '): ' + msg;
        }
    };
    
    var assertNumber = function(number, msg) {
        if (number.constructor != Number) {
            throw 'assertNumber(number=' + number + '): ' + msg;
        }
    };
    
    var assertNodeInTree = function(tree, id, ignoreRemoved, msg) {
        if ( !tree.getNode(id, ignoreRemoved) ) {
            throw 'assertNodeInTree(id=' + id + '): ' + msg;
        }
    };
    
    var assertNode = function(node, idColumn, msg) {
        if ( !node.hasOwnProperty(idColumn) && !node.hasOwnProperty('parent') &&
             assertList(node['children'], msg + '->assertNode') ) {
            throw 'assertNode(idColumn=' + idColumn + ')' + msg;
        }
    };
    
    var assertId = function(id, msg) {
        if (id !== null) {
            assertNonEmptyString(id, 'assertId( ' + msg + ' )');
        }
    };
    
    var assertRemoveType = function(type, msg) {
        if (type !== 'node' && type !== 'subtree') {
            throw 'assertRemoveType(type=' + type + ') ' + msg;
        }
    };
    
    global.monkey = monkey;
    
})(this);