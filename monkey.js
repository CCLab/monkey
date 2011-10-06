/*

Monkey is a very simple library used for traversing tree,
like an agile monkey.

Requirements for tree data:
-- tree nodes are objects
-- children nodes are in a list under 'children' parameter
-- data in node is in 'item' parameter

*/

(function(glob) {
    var __version = 0.01;
    var monkey = {};
    
    
        
    monkey.createTree = function(data, hierarchyColumn) {
        assertList(data, 'createTree');
        
        var treeData = {
            'root': {hierarchyColumn: null, 'name': 'root', 'children': []}
        };
        var tree = {
            data: treeData,
            insertNode: function(node) {
                return insertNode.call(tree, treeData, hierarchyColumn, node);
            },
            getNode: function(id) {
                return getNode.call(tree, treeData, hierarchyColumn, id);
            }
            //insertNode.call(tree, treeData, hierarchyColumn)
        };
        
        data.forEach(function (newNode) {
            /*var id = child[hierarchyColumn];
            var parentId = getParentId(id);
            
            if (!!parentId) {
                assertNodeInTree(treeData, parentId, 'createTree');
            }
            
            //var parentNode = getNode(treeData, parentId);
            var parentNode = getNode(treeData, parentId);
            child['children'] = [];
            insertChild(parentNode, child);*/
            insertNode(treeData, hierarchyColumn, newNode);
        });
        
        return tree;
    }
    
    var insertNode = function(treeData, hierarchyColumn, newNode) {
        var id = newNode[hierarchyColumn];
        var parentId = getParentId(id);
        
        if (!!parentId) {
            assertNodeInTree(treeData, parentId, 'createTree');
        }
        
        //var parentNode = getNode(treeData, parentId);
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
        //assertList(treeData, 'getNode');
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
        
        /*var i;
        var children = node['children'];
        var len = children.length;
        for (i = 0; i < len; ++i) {
            if (children[i]['id'] === childId) {
                return children[i];
            }
        }
        return undefined;*/
    }
    
    // hierarchy traversing functions
    
    var getParent = function(node) {
        return node['parent'];
    }
    
    var getRoot = function(node) {
        if (!getParent(node)) {
            return node;
        }
        
        var lastNode = node;
        while ( getParent(lastNode) ) {
            lastNode = getParent(lastNode);
        }
        
        return lastNode;
    }
    
    var getLeftSibling = function(node) {
    }
    
    var getRightSibling = function(node) {
    
    }
    
    var getSibling = function(node, sibling_nr) {
    }
    
    var getChildren = function(node) {
        return node['children'];
    }
    
    var getSubtree = function(node) {
        
    }
    
    var getItem = function(node) {
        return node['item'];
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
    
    var assertNodeInTree = function(treeData, id, hierarchyColumn, msg) {
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
    
    glob.monkey = monkey;
})(this);