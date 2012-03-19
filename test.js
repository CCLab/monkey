/*

Testing monkey.

*/

(function() {
        var sortMin = function(node1, node2) {
        return node1['value'] - node2['value'];
    };
    var sortMax = function(node1, node2) {
        return node2['value'] - node1['value'];
    };


    var data = [
        {'id': '0', 'name': 'fruit'},
        {'id': '0-1', 'name': 'apple'},
        {'id': '0-2', 'name': 'pear'},
        {'id': '1', 'name': 'vegetable'},
        {'id': '1-0', 'name': 'carrot'},
        {'id': '1-1', 'name': 'salad'},
        {'id': '1-2', 'name': 'tomato'}
    ];
    var tree = monkey.createTree(data, 'id');
    var leftSiblingNodeCopy, rightSiblingNodeCopy, siblingNodeCopy;
    var badId = {};
    var badNode = {};
    
    //  root's left and right siblings
    var x = tree.leftSibling(tree.root());
    x = (tree.rightSibling(tree.root())); // undefined
    
    // check siblings of root by their number
    x = tree.sibling(tree.root(), 0); // tree.root()
    x = (tree.sibling(tree.root(), 1)); // undefined
    
    // check first level node's siblings
    x = (tree.leftSibling(tree.getNode('0'))); // undefined
    x = tree.getNode('0') ===  tree.leftSibling('1');
    
    x = (tree.getNode('1') === tree.rightSibling('0'));
    x = (tree.rightSibling('1')); // undefined
    
    // check if sibling is the same for any node on the specified level
    x = (tree.getNode('0') === tree.sibling(tree.getNode('0'), 0));
    x = (tree.getNode('0') === tree.sibling(tree.getNode('1'), 0));
    
    // check if sibling functions gives the same result for node argument and id argument
    x = (tree.leftSibling(tree.getNode('1')) === tree.leftSibling('1'));
    x = (tree.rightSibling(tree.getNode('0')) === tree.rightSibling('0'));
    x = (tree.sibling(tree.getNode('0'), 1) === tree.sibling('0', 1));
    
    // check if all sibling functions give the same results
    x = (tree.leftSibling('1-2') === tree.rightSibling('1-0'));
    x = (tree.sibling('1-2', 0) === tree.leftSibling('1-1'));
    
    // check if all sibling functions return copies of nodes when last argument is set to true
    leftSiblingNodeCopy = tree.leftSibling('1-2', true);
    rightSiblingNodeCopy = tree.rightSibling('1-0', true);
    siblingNodeCopy = tree.sibling('1-1', 1, true);
    
    x = leftSiblingNodeCopy;
    var y = rightSiblingNodeCopy;
    var z = siblingNodeCopy;
    // x == y == z, but not same
    
    // check if all functions return undefined for nonexisting node
    x = (tree.leftSibling('1-5')); // undefined
    x = (tree.rightSibling('1-5')); // undefined
    x = (tree.sibling('1-5', 6)); // undefined



    var simpleData = [
        {'id': '0', 'name': 'fruit'},
        {'id': '0-1', 'name': 'apple'},
        {'id': '1', 'name': 'vegetable'}
    ];
    var tree = monkey.createTree(simpleData, 'id');
    var badId = {};
    
    // check result for various level nodes
    console.log(tree.nodeId(tree.getNode('0'))); // 0
    console.log(tree.nodeId(tree.getNode('1'))); // 1
    console.log(tree.nodeId(tree.getNode('0-1'))); // 0-1

    var simpleDataWithParent = [ 
        {'name': 'fruit', 'parent': ''},
        {'name': 'vegetable', 'parent': ''},
        {'name': 'apple', 'parent': 'fruit'},
        {'name': 'carrot', 'parent': 'vegetable'},
        {'name': 'red-apple', 'parent': 'apple'},
        {'name': 'green-apple', 'parent': 'apple'},
        {'name': 'big-green-apple', 'parent': 'green-apple'}
    ];
    var newData = [
        {'name': 'red-apple', 'parent': 'apple'},
        {'name': 'yellow-apple', 'parent': 'apple'},
        {'name': 'green-apple', 'parent': 'apple'}
    ];
    var newNode = {'name': 'small-yellow-apple', 'parent': 'yellow-apple'};
    var badNewData = [
        {'name': 'red-apple', 'parent': 'apple'},
        {'no-name': 'unidentified', 'abc': 'xyz'},
        {'name': 'yellow-apple', 'parent': 'apple'},
        {'name': 'green-apple', 'parent': 'apple'},
        {'no-name': 'unidentified2', 'abc': 'qwe'}
    ];
    var badNewData2 = [
        {'name': 'red-apple', 'parent': 'apple'},
        {'name': 'yellow-apple', 'parent': 'apple'},
        {'name': 'dog', 'age': 10},
        {'name': 'green-apple', 'parent': 'apple'},
        {'name': 'cat', 'age': 6}
    ];
    
    var expectedValues = ['red-apple', 'yellow-apple', 'green-apple'];
    var childrenNames;
    var allNames;
    
    var tree = monkey.createTree(simpleDataWithParent, 'name', 'parent');
    
    tree.updateTree(newData);
    
    // check if yellow apple was inserted inside
    childrenNames = tree.children('apple', true).map(function(node) {
        return node['name'];
    });
    
    var data = [
        {'id': '0', 'name': 'fruit', 'value': 10},
        {'id': '0-1', 'name': 'apple', 'value': 15},
        {'id': '0-2', 'name': 'pear', 'value': 13},
        {'id': '1', 'name': 'vegetable', 'value': 100},
        {'id': '1-0', 'name': 'carrot', 'value': 2},
        {'id': '1-1', 'name': 'salad', 'value': 7},
        {'id': '1-2', 'name': 'tomato', 'value': 3}
    ];
    var tree = monkey.createTree(data, 'id');
    var namesList;
    var sortedTree;
    var sortedFilteredTree;
    
    // check various types of sorting
    sortedTree = tree.sort(sortMin);
    namesList = sortedTree.toList().map(function(node) {
        return node['name'];
    });
    // assertEquals(['fruit', 'pear', 'apple', 'vegetable',
                  // 'carrot', 'tomato', 'salad'], namesList);
    
    sortedTree = tree.sort(sortMax);
    namesList = sortedTree.toList().map(function(node) {
        return node['name'];
    });
    // assertEquals(['vegetable', 'salad', 'tomato', 'carrot',
                  // 'fruit', 'apple', 'pear'], namesList);
    
    // check if original tree is not changed
    namesList = tree.toList().map(function(node) {
        return node['name'];
    });
    
    sortedFilteredTree = tree.filter(function(node) {
        return node['value'] > 9;
    }).sort(sortMin);
    namesList = tree.toList().map(function(node) {
        return node['name'];
    });
    
    
    var data = [
        {'id': '0', 'name': 'fruit'},
        {'id': '0-1', 'name': 'apple'},
        {'id': '0-2', 'name': 'pear'},
        {'id': '0-2-1', 'name': 'big-pear'},
        {'id': '0-2-2', 'name': 'small-pear'},
        {'id': '0-2-3', 'name': 'medium-pear'},
        {'id': '1', 'name': 'vegetable'},
        {'id': '1-0', 'name': 'carrot'},
        {'id': '1-1', 'name': 'salad'}
    ];
    var badId = {};
    var tree = monkey.createTree(data, 'id');
    
    // test if the root has no parents
    var x1 = tree.parents(tree.root()); // []
    
    // test if top level node has no parents
    var x2 = tree.parents('0'); // []
    
    // test if parents gives the same result for id and for node as an argument
    var x3 = tree.parents(tree.getNode('0')); // []
    
    // test for deeper nodes
    var x4 = tree.parents('0-1'); // tree.getNode('0')
    var x5 = tree.parents('0-2-2'); // [tree.getNode('0'), tree.getNode('0-2')]
    
   // test if copies are returned if second argument is true
   var x6 = tree.parents('0', true); // []
   var x7 = tree.parents('0-1', true); // [tree.getNode('0', true)]
   
   var x8 = tree.topParent('0-2-3', true);
    
    var data = [
        {'id': '0', 'name': 'fruit', 'val': 4},
        {'id': '0-1', 'name': 'apple', 'val': 5},
        {'id': '0-2', 'name': 'pear', 'val': 2},
        {'id': '1', 'name': 'vegetable', 'val': 3},
        {'id': '1-0', 'name': 'carrot', 'val': 4},
        {'id': '1-1', 'name': 'salad', 'val': 5},
        {'id': '1-2', 'name': 'tomato', 'val': 6}
    ];
    var data2 = [
        {'id': '0', 'name': '0', 'val': 4},
        {'id': '0-1', 'name': '0-1', 'val': 5},
        {'id': '0-2', 'name': '0-2', 'val': 2},
        {'id': '0-1-1', 'name': '0-1-1', 'val': 30},
        {'id': '0-1-2', 'name': '0-1-2', 'val': 40},
        {'id': '0-1-3', 'name': '0-1-3', 'val': 50},
        {'id': '0-1-1-1', 'name': '0-1-1-1', 'val': 60}
    ];
    var ftree = monkey.createTree(data2, 'id');
    var fitree = ftree.filter(function(node) {
        return node['val'] > 10;
    });
    
    var tree;
    var filteredTree;
    var filteredNodes;
    
    // give filter conditition that is satisfied by every node and check
    // if none nodes are filtered
    tree = monkey.createTree(data, 'id');
    filteredTree = tree.filter(function(node) {
        return node['val'] > 1;
    });
    filteredNodes = tree.toList()
                        .filter(function(e) {
                            return e['val'] > 1;
                        });
    /*var x = filteredTree.toList();
    
    // check if leafs are filtered out properly
    var z = filteredTree.filter(function(node) {
        return node['val'] > 2;
    });*/
    filteredTree = filteredTree.filter(function(node) {
        return node['val'] > 2;
    });
    //var a = z.toList();
    //var b = filteredTree.toList();
    
    filteredNodes = tree.toList()
                        .filter(function(e) {
                            return e['val'] > 2;
                        });
    //var y = filteredTree.toList();
    filteredTree = filteredTree.filter(function(node) {
        return node['val'] > 100;
    });
    var n = filteredTree.getNode('0');
    n = filteredTree.getNode('0-2');
    
    
    var data = [
        {'id': '0', 'name': 'fruit', 'val': 4},
        {'id': '0-1', 'name': 'apple', 'val': 5},
        {'id': '0-2', 'name': 'pear', 'val': 2},
        {'id': '1', 'name': 'vegetable', 'val': 3},
        {'id': '1-0', 'name': 'carrot', 'val': 4},
        {'id': '1-1', 'name': 'salad', 'val': 5},
        {'id': '1-2', 'name': 'tomato', 'val': 6}
    ];
    var tree;
    var filteredTree;
    var filteredNodes;
    
    // give filter conditition that is satisfied by every node and check
    // if none nodes are filtered
    tree = monkey.createTree(data, 'id');
    filteredTree = tree.filter(function(node) {
        return node['val'] > 1;
    });
    filteredNodes = tree.toList()
                        .filter(function(e) {
                            return !e['filtered'];
                        });
                        /*.map(function(e) {
                            return e;
                        })*/
    
    // check if leafs are filtered out properly
    fileteredTree = filteredTree.filter(function(node) {
        return node['val'] > 2;
    });
    
    filteredNodes = filteredTree.toList()
                                .filter(function(e) {
                                    return e['val'] > 2;
                                });
    
    data = [
        {'idef': '0', 'name': 'fruit', 'val': 4},
        {'idef': '0-1', 'name': 'apple', 'val': 5},
        {'idef': '0-2', 'name': 'pear', 'val': 2},
        {'idef': '1', 'name': 'vegetable', 'val': 3},
        {'idef': '1-0', 'name': 'carrot', 'val': 4},
        {'idef': '1-1', 'name': 'salad', 'val': 5},
        {'idef': '1-2', 'name': 'tomato', 'val': 6}
    ];
    var emptyData = [];
    
    var tree = monkey.createTree(data, 'idef');
    var emptyTree = monkey.createTree(emptyData, 'idef');
    
    var mappedTree;
    var mappedEmptyTree;

    var tmp_array = [];
    
    // test if tree is iterated in the correct order(partially tested by next tests)
    mappedTree = tree.map(function(node) {
        node['add_arg'] = node['id'];
        return node;
    });
    
    var listData = [{'id': '0', 'name': 'fruit'},
                    {'id': '0-1', 'name': 'apple'},
                    {'id': '0-2', 'name': 'pear'},
                    {'id': '1', 'name': 'vegetable'},
                    {'id': '1-0', 'name': 'carrot'},
                    {'id': '1-1', 'name': 'salad'}
    ];
    
    var print = function(x){
        document.write(x);
    };
    
    var childrenList = [{'id': '0-1-0', 'name': 'lobo'},
                        {'id': '0-1-1', 'name': 'champion'}
    ];
    var someId = '1-0';
    
    var tree = monkey.createTree(listData, 'id');
    var v = tree.value('0');
    v['name'] = 'tepiczek';
    
    console.log(tree.getNode(tree.root().id));
    childrenList.forEach( function(el) {
        tree.insertNode(el);
    });
    tree.insertNode(childrenList[0])
        .insertNode(childrenList[1]);
    
    var someData = tree.getNode(someId);
    console.log('someData = {id:' + someData['id'] + ', ' + someData['name'] + '}');
    
    var tree2 = monkey.createTree(rows, 'idef');
    var someId2 = '1-3-2';
    var someData2 = tree2.getNode(someId2);
    console.log('someData2 = {idef:' + someData2['idef'] + ', name:' + someData2['name'] +
                ', v_eu:' + someData2['v_eu'] + ', v_total:' + someData2['v_total'] +
                ', v_nation' + someData2['v_nation'] + ', type:' + someData2['type']);
    
    
    var count = 0;
    //tree2.forEach(function(node) { document.write(node['idef'] + '<hr>'); ++count;});
    document.write('count = ' + count);
    
    var treeMaped = tree2.map(function(node){ node['type'] = node['type'] + node['type']; return node;});
    treeMaped.forEach(function(node) { document.write(node['idef'] + '<hr>'); ++count;});
    print('tree2 count = ' + tree2.countSubtree() + '<hr>');
    print('treeMaped count = ' + treeMaped.countSubtree() + '<hr>');
    print('tree2 count 1-1 = ' + tree2.countSubtree('1-1') + '<hr>');
    print('treeMaped count 1-1 = ' + treeMaped.countSubtree('1-1') + '<hr>');
    print('tree2 level-count 1-1 = ' + tree2.countLevel('1-1') + '<hr>');
    print('treeMaped level-count 1-1 = ' + treeMaped.countLevel('1-1') + '<hr>');

    var list = tree2.toList();
})();
