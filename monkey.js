/*

Monkey is a very simple library used for traversing tree,
like an agile monkey.

Requirements for tree data:
-- tree nodes are objects
-- children nodes are in a list under 'children' parameter
-- data in node is in 'item' parameter

*/

(function() {
    var __version = 0.01,
        that = {};
    
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
        if
    }
    
    var getMyNumber = function(node) {
        var parent = getParent(node);
        if (!parent) {
            return undefined;
        }
        
        var children = parent['children'],
            children_count = parent['children'].length,
            i;
            
        for (i = 0; i < children_count; ++i) {
            if (node['item'] == parent['children']) {
                return i;
            }
        }
        
    }
    
    var getChild = function(node, child_nr) {
        
    }
    
    var getChildren = function(node) {
        return node['children'];
    }
    
    var getSubtree = function(node) {
        
    }
    
    var getItem = function(node) {
        return node['item'];
    }
    
    return that;
})();