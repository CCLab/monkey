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
    
    
    ///////////////////////////////////////////////////////////////////////////
    //                           Tree creation                               //
    ///////////////////////////////////////////////////////////////////////////
    monkey.createTree = function(data, hierarchyColumn) {
        assertList(data, 'createTree');
        
        var treeData = {
            'root': {hierarchyColumn: null, 'name': 'root', 'children': []}
        };
        /*var tree = {
            data: treeData,
            insertNode: function(node) {
                return insertNode.call(tree, treeData, hierarchyColumn, node);
            },
            getNode: function(id) {
                return getNode.call(tree, treeData, hierarchyColumn, id);
            }
        };*/
        tree = createTreeObject(treeData, hierarchyColumn);
        
        data.forEach(function (newNode) {
            insertNode(treeData, hierarchyColumn, newNode);
        });
        
        return tree;
    }
    
    var insertNode = function(treeData, hierarchyColumn, newNode) {
        var id = newNode[hierarchyColumn];
        var parentId = getParentId(id);
        
        if (!!parentId) {
            assertNodeInTree(treeData, hierarchyColumn, parentId, 'createTree');
        }
        
        var parentNode = getNode(treeData, hierarchyColumn, parentId);
        newNode['children'] = [];
        insertChild(parentNode, newNode, hierarchyColumn);
    }
    
    var insertChild = function(parent, child, hierarchyColumn) {
        assertNode(parent);
        var childId = child[hierarchyColumn];
        parent['children'].push(child);
        parent['children'].sort(function(el1, el2) {
            var idNr1 = parseInt( lastIdElement(el1[hierarchyColumn]) );
            var idNr2 = parseInt( lastIdElement(el2[hierarchyColumn]) );
            return idNr1 - idNr2;
        });
    }
    
    var getNode = function(treeData, hierarchyColumn, id) {
        assertId(id, 'getNode');
        
        var node = treeData['root'];
        if (id === null) return node;
        
        var maxLevel = count(id, '-');
        var childId;
        var actLevel;
        for (actLevel = 0; actLevel <= maxLevel; ++actLevel) {
            childId = getIdOnLevel(id, actLevel);
            node = getChild(node, childId, hierarchyColumn);
            if (!node) {
                return undefined;
            }
        }
        return node;
    }
    
    var getChild = function(node, childId, hierarchyColumn) {
        assertNode(node, 'getChild');
        assertNonEmptyString(childId, 'getChild');
        
        var childList = node['children'].filter(function(e) {
            return e[hierarchyColumn] === childId;
        });
        
        return (childList.length > 0) ? childList[0] : undefined;
    }
    
    var createTreeObject = function(treeData, hierarchyColumn) {
        return {
            data: treeData,
            insertNode: function(node) {
                return insertNode.call(tree, treeData, hierarchyColumn, node);
            },
            getNode: function(id) {
                return getNode.call(tree, treeData, hierarchyColumn, id);
            },
            parent: function(id, nodeData) {
                return parent.call(tree, treeData, hierarchyColumn, id, nodeData);
            },
            root: function(id) {
                return root.call(tree, treeData, hierarchyColumn, id);
            },
            leftSibling: function(id) {
                return leftSibling.call(tree, treeData, hierarchyColumn, id);
            },
            rightSibling: function(id) {
                return rightSibling.call(tree, treeData, hierarchyColumn, id);
            },
            sibling: function(id, siblingNr) {
                return sibling.call(tree, treeData, hierarchyColumn, id, siblingNr);
            },
            children: function(id) {
                return children.call(tree, treeData, hierarchyColumn, id);
            },
            subtree: function(id) {
                return subtree.call(tree, treeData, hierarchyColumn, id);
            },
            value: function(id) {
                return value.call(tree, treeData, hierarchyColumn, id);
            }
        };
    }
    
    
    ///////////////////////////////////////////////////////////////////////////
    //                          Tree traversal                               //
    ///////////////////////////////////////////////////////////////////////////
    // TODO
    var parent = function(treeData, hierarchyColumn, id, nodeData) {
        assertId(id, 'parent');
        
        var parentId = getParentId(id);
        if (!data) {
            
        }
        return getNode(treeData, hierarchyColumn, id);
    }
    
    var root = function(treeData, hierarchyColumn, id) {
        asssertId(id, 'root');
        
        if ( isRootId(id) ) return treeData['root'];
        
        var lastNode = getNode(treeData, hierarchyColumn, id);
        var lastId = id;
        while ( !!parent(treeData, hierarchyColumn, lastId, lastNode) ) {
            lastNode = parent(treeData, hierarchyColumn, id);
            lastId = lastNode[hierarchyColumn];
        }
        
        return lastNode;
    }
    
    var leftSibling = function(treeData, hierarchyColumn, id) {
        assertId(id, 'leftSibling');
        if ( isRootId(id) ) return undefined;
        
        var siblingsNodes = children(treeData, hierarchyColumn, id);
        var i;
        var last = siblingsNodes.length - 1;
        for (i = 1; i < last; ++i) {
            if (siblingsNodes[i][hierarchyColumn] === id) {
                return siblingsNodes[i - 1];
            }
        }
        return undefined;
    }
    
    var rightSibling = function(treeData, hierarchyColumn, id) {
        assertId(id, 'rightSibling');
        if ( isRootId(id) ) return undefined;
        
        var siblingsNodes = children(treeData, hierarchyColumn, id);
        var i;
        var nextToLast = siblingsNodes.length - 2;
        for (i = 0; i < nextToLast; ++i) {
            if (siblingsNodes[i][hierarchyColumn] === id) {
                return siblingsNodes[i + 1];
            }
        }
        return undefined;
    }
    
    var sibling = function(treeData, hierarchyColumn, id, siblingNr) {
        assertId(id, 'sibling');
        if ( isRootId(id) ) return (siblingNr === 0) ? treeData['root'] : undefined;
        
        var siblingsNodes = children(treeData, hierarchyColumn, id);
        if (siblingNr < 0 || siblingsNodes.length <= siblingNr) return undefined;
        
        return siblingsNodes[siblingNr];
    }
    
    var children = function(treeData, hierarchyColumn, id) {
        assertId(id, 'children');
        var node = getNode(treeData, hierarchyColumn, id);
        return node['children'];
    }
    
    // it is the same as getNode, because if you have a node, you have subtree,
    // because the node knows about his children and so on
    var subtree = function(treeData, hierarchyColumn, id) {
        assertId(id, 'subtree');
        return getNode(treeData, hierarchyColumn, id);
    }
    
    // warning: if node contains objects, only their references will be copied
    var value = function(treeData, hierarchyColumn, id) {
        assertId(id, 'value');
        var node = getNode(treeData, hierarchyColumn, id);
        if (!node) return undefined;
        var valueCopy = {};
        var key;
        for (key in node) {
            if ( node.hasOwnProperty(key) && key !== 'children') {
                valueCopy[key] = node[key];
            }
        }
        return valueCopy;
    }
    
    var next = function(treeData, hierarchyColumn, id) {
        assertId(id, 'next');
        
        var childrenNodes = children(treeData, hierarchyColumn, id);
        if (childrenNodes.length) return childrenNodes[0];
        
        var rightNode = rightSibling(treeData, hierarchyColumn, id);
        if ( !!rightNode ) return rightNode;
        
        var parentId = getParentId(id);
        while ( !parentId ) {
            rightNode = rightSibling(treeData, hierarchyColumn, parentId);
            if ( !!rightNode ) return rightNode;
            
            parentId = getParentId(parentId);
        }
        return undefined;
    }
    
    var iterate = function(treeData, hierarchyColumn, fun, id) {
        if (!id) {
            assertId(id, 'iterate');
            
            
        }
        var root = treeData['root'];
        // TODO
    }
    
    ///////////////////////////////////////////////////////////////////////////
    //                         helper functions                              //
    ///////////////////////////////////////////////////////////////////////////
    var count = function(str, letter) {
        assertString(str, 'count');
        
        var counter = 0;
        var i;
        var len = str.length;
        
        for (i = 0; i < len; ++i) {
            if (str[i] === letter) {
                ++counter;
            }
        }
        
        return counter;
    }
    
    var getParentId = function(id) {
        var lastIndex = id.lastIndexOf('-');
        return (lastIndex !== -1) ? id.substring(0, lastIndex) : null;
    }
    
    var getIdOnLevel = function(id, level) {
        assertNonEmptyString(id, 'getIdOnLevel');
        
        var i;
        var len = id.length;
        for (i = 0; i < len; ++i) {
            if (id[i] === '-') {
                --level;
                if (level < 0) break;
            }
        }
        return id.substring(0, i);        
    }
    
    var lastIdElement = function(id) {
        assertNonEmptyString(id);
        
        var lastPosition = id.lastIndexOf('-');
        return (lastPosition !== -1) ? id.substring(lastPosition + 1) : id;
    }
    
    var isRootId = function(id) {
        return id === null;
    }
    
    ///////////////////////////////////////////////////////////////////////////
    //                              asserts                                  //
    ///////////////////////////////////////////////////////////////////////////
    var assertList = function(value, msg) {
        if (value.constructor !== Array) {
            throw 'assertList: ' + msg;
        }
    }
    
    var assertString = function(value, msg) {
        if (value.constructor !== String && value !== '') {
            throw 'assertString' + msg;
        }
    }
    
    var assertNonEmptyString = function(value, msg) {
        if (value.constructor !== String && value !== '') {
            throw 'assertNonEmptyString' + msg;
        }
    }
    
    var assertNodeInTree = function(treeData, hierarchyColumn, id, msg) {
        if ( !getNode(treeData, hierarchyColumn, id) ) {
            throw 'assertNodeInTree' + msg;
        }
    }
    
    var assertNode = function(node, id_column, msg) {
        if ( !node.hasOwnProperty(id_column) &&
             assertList(node['children'], msg + '->assertNode') ) {
            throw 'assertNode(id_column=' + id_column + ')' + msg;
        }
    }
    
    var assertId = function(id, msg) {
        if (id !== null) {
            assertNonEmptyString(id, msg + '->assertId');
        }
    }
    
    
    global.monkey = monkey;
})(this);