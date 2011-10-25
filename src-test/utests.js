// Description
CreationTest = TestCase("CreationTest");

// Description
BasicFunctionsTest = TestCase("BasicFunctionsTest");

// Description
ModificationTest = TestCase("ModificationTest");

// Description
TreeTraversingTest = TestCase("TreeTraversingTest");

// Description
IterationTest = TestCase("IterationTest");

// Description
CountTest = TestCase("CountTest");


CreationTest.prototype.testEmptyCreation = function() {
    var emptyData = [ ];
    var tree = monkey.createTree(emptyData, 'id');
    
    assertEquals('id', tree['idColumn']);
    jstestdriver.console.log("JsTestDriver", 'idColumn = ' + tree['idColumn']);
    
    jstestdriver.console.log(tree['treeData']['root']['children']);
    
    assertEquals('root', tree['treeData']['root']['name']);

    assertEquals(null, tree['treeData']['root']['id']);

    assertArray(tree['treeData']['root']['children']);
    assertEquals(0, tree['treeData']['root']['children'].length);
    
    assertEquals(undefined, tree['treeData']['root']['parent']);

    jstestdriver.console.log("JsTestDriver", 'treeData = ' + tree['treeData']);
};

CreationTest.prototype.testNotEmptyCreation = function() {
    var listData = [
        {'id': '0', 'name': 'fruit'},
        {'id': '1', 'name': 'vegetable'},
    ];
    var tree = monkey.createTree(listData, 'id');
    
    assertEquals(2, tree['treeData']['root']['children'].length);
};

CreationTest.prototype.testId = function() {
    var listDataId = [
        {'id': '0', 'name': 'fruit'},
        {'id': '0-1', 'name': 'apple'},
        {'id': '0-2', 'name': 'pear'},
        {'id': '1', 'name': 'vegetable'},
        {'id': '1-0', 'name': 'carrot'},
        {'id': '1-1', 'name': 'salad'}
    ];
    var listDataIdef = [
        {'idef': '0', 'name': 'fruit'},
        {'idef': '0-1', 'name': 'apple'},
        {'idef': '0-2', 'name': 'pear'},
        {'idef': '1', 'name': 'vegetable'},
        {'idef': '1-0', 'name': 'carrot'},
        {'idef': '1-1', 'name': 'salad'}
    ];
    
    var tree1 = monkey.createTree(listDataId, 'id');
    var tree2 = monkey.createTree(listDataIdef, 'idef');
    
    assertEquals('id', tree1['idColumn']);
    assertEquals('idef', tree2['idColumn']);
    
    jstestdriver.console.log("JsTestDriver", tree1['idColumn']);
};

CreationTest.prototype.testErrors = function() {
    var wrongData = "data";
    var wrongId = 0;
    var goodData = [
        {'id': '0', 'name': 'fruit'},
        {'id': '1', 'name': 'vegetable'},
    ];
    var assertMsg1 = 'assertList(list=' + wrongData + '): createTree';
    var assertMsg2 = 'assertString(str=' + wrongId + '): createTree';
    
    /*assertException(function() {
        monkey.createTree(wrongData, 'id');
    }, assertMsg1);
    
    assertException(function() {
        monkey.createTree(goodData, wrongId);
    }, assertMsg2);*/
    assertException(function() {
        monkey.createTree(wrongData, 'id');
    }, undefined);
    
    assertException(function() {
        monkey.createTree(goodData, wrongId);
    }, undefined);
};


BasicFunctionsTest.prototype.testRoot = function() {
    var simpleData = [
        {'id': '0', 'name': 'fruit'},
        {'id': '1', 'name': 'vegetable'},
    ];
    var tree = monkey.createTree(simpleData, 'id');
    
    // test root's id
    assertEquals(tree.root()['id'], null);
    
    // test root's parent and children
    assertUndefined(tree.root()['parent']);
    assertArray(tree.root()['children']);
    assertEquals(tree.root()['children'].length, 2);
    
    // test isRoot function for node argument
    assertTrue(tree.isRoot(tree.root()));
    assertFalse(tree.isRoot(tree.getNode('0')));
    
    // test isRoot function for node id argument
    assertTrue(tree.isRoot(tree.root()['id']));
    assertFalse(tree.isRoot('0'));
};

BasicFunctionsTest.prototype.testGet = function() {
    var simpleData = [
        {'id': '0', 'name': 'fruit'},
        {'id': '1', 'name': 'vegetable'},
    ];
    var tree = monkey.createTree(simpleData, 'id');
    
    assertEquals('0', tree.getNode('0')['id']);
    assertEquals('1', tree.getNode('1')['id']);

    assertNull(tree.getNode(null)['id']);
    assertUndefined(tree.getNode('1-0'));
    assertUndefined(tree.getNode('2'));
    assertUndefined(tree.getNode('1-0-3'));
    
    assertSame(tree.getNode(null), tree.root());
};

BasicFunctionsTest.prototype.testGetId = function() {
    var simpleData = [
        {'id': '0', 'name': 'fruit'},
        {'id': '1', 'name': 'vegetable'},
    ];
    var tree = monkey.createTree(simpleData, 'id');
    
    assertEquals(tree.nodeId(tree.getNode('0')), '0');
    assertEquals(tree.nodeId(tree.getNode('1')), '1');
    
    assertEquals(tree.nodeId(tree.getNode(null)), null);
};

BasicFunctionsTest.prototype.testValue = function() {
    var simpleData = [
        {'id': '0', 'name': 'fruit'},
        {'id': '1', 'name': 'vegetable'},
        {'id': '0-0', 'name': 'apple'}
    ];
    var tree = monkey.createTree(simpleData, 'id');
    
    // check if values of nodes are the same as in the list used to create tree
    assertEquals(tree.value(tree.getNode('0')), simpleData[0]);
    assertEquals(tree.value(tree.getNode('1')), simpleData[1]);
    assertEquals(tree.value(tree.getNode('0-0')), simpleData[2]);
};


ModificationTest.prototype.testNodeInsertion = function() {
    var simpleData = [
        {'id': '0', 'name': 'fruit'},
        {'id': '4', 'name': 'vegetable'},
    ];
    var tree = monkey.createTree(simpleData, 'id');
    
    var newNode1 = {'id': '2', 'name': 'other'};
    var newNode2 = {'id': '2-0', 'name': 'other-other'};
    var deepNode = {'id': '0-0-0', 'name': 'deep-fruit'};
    var badNode = {'another_id': '2-1', 'name': 'other-another'};
    
    // test if tree is returned
    assertEquals(tree, tree.insertNode(newNode1));
    
    // test if node is inserted in the good place
    assertEquals(tree.root()['children'].length, 3);
    assertEquals(tree.nodeId(tree.root()['children'][1]), '2');
    
    // check if node has not changed since insertion
    assertEquals(tree.root()['children'][2]['id'], newNode1['id']);
    assertEquals(tree.root()['children'][2]['name'], newNode1['name']);
    
    // test if new node is not reinserted
    assertEquals(tree.root()['children'].length, 3);
    
    // test if new node is inserted in the good place(correct parent and order)
    tree.insertNode(newNode2);
    assertEquals(tree.getNode('2')['children'].length, 1);
    
    // test if deep node is inserted properly
    tree.insertNode(deepNode);
    assertEquals(tree.getNode('0')['children'].length, 1);
    assertEquals(tree.nodeId(tree.getNode('0')['children'][0]), '0-0-0');
    
    // test reaction for bad node
    assertException(function() {
        tree.insertNode(badNode);
    }, undefined);
};


TreeTraversingTest.prototype.testParent = function() {
    var data = [
        {'id': '0', 'name': 'fruit'},
        {'id': '0-1', 'name': 'apple'},
        {'id': '0-2', 'name': 'pear'},
        {'id': '1', 'name': 'vegetable'},
        {'id': '1-0', 'name': 'carrot'},
        {'id': '1-1', 'name': 'salad'}
    ];
    var badId = {};
    var badNode = {};
    var tree = monkey.createTree(data, 'id');
    
    // test if the root has no parent
    assertUndefined(tree.parent(tree.root()));
    
    // test if first level node's parent is the root
    assertEquals(tree.root(), tree.parent(tree.getNode('0')));
    
    // test if parent gives the same result for id and for node as an argument
    assertEquals(tree.parent(tree.getNode('0')), tree.parent('0'));
    
    // test for second level nodes
    assertEquals(tree.parent(tree.getNode('0-1')), tree.getNode('0'));
    assertEquals(tree.parent(tree.getNode('1-0')), tree.getNode('1'));
    
    // check if parent is returned for not existing node
    assertUndefined(tree.parent('2'));
    
    // check if parent throws exceptions with bad argument(non-string id)
    assertException(function() {
        tree.parent(badId);
    }, undefined);
    
    // check if parent throws exceptions with bad argument(bad node)
    assertException(function() {
        tree.parent(badNode);
    }, undefined);
};

TreeTraversingTest.prototype.testChildren = function() {
    var getIdsInList = function(list) {
        return list.map( function (e) {
            return e['id'];
        });
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
    var badId = {};
    var badNode = {};
    
    // check id's of root's children
    //assertArray(tree.children(tree.root()));
    //assertEquals(tree.children(tree.root()).length, 2);
    assertEquals(getIdsInList(tree.children(tree.root())), ['0', '1']);
    
    // check ids of first level node's children
    //assertArray(tree.children(tree.getNode('1')));
    //assertEquals(tree.children(tree.getNode('1')).length, 3);
    assertEquals(getIdsInList(tree.children(tree.getNode('1'))), ['1-0', '1-1', '1-2']);
    
    // check if the same result is for a node argument and an id argument
    assertEquals(getIdsInList(tree.children(tree.getNode('1'))), tree.children('1'));
    
    // check ids of leaf node's children
    //assertArray(tree.children(tree.getNode('1-2')));
    //assertEquals(tree.children(tree.getNode('1-2')).length, 0);
    assertEquals(getIdsInList(tree.children(tree.getNode('1-2'))), []);
    
    // check if the same result is for a node argument and an id argument
    assertEquals(getIdsInList(tree.children(tree.getNode('1'))), tree.children('1'));
    
    // test for not existing node
    assertEquals(tree.children('2'), []);
    
    // check if children throws exceptions with bad argument(bad id)
    assertException(function() {
        tree.children(badId);
    }, undefined);
    
    // check if children throws exceptions with bad argument(bad node)
    assertException(function() {
        tree.children(badNode);
    }, undefined);
};

TreeTraversingTest.prototype.testSiblingFunctions = function() {
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
    var badId = {};
    var badNode = {};
    
    //  root's left and right siblings
    assertUndefined(tree.leftSibling(tree.root()));
    assertUndefined(tree.rightSibling(tree.root()));
    
    // check siblings of root by their number
    assertEquals(tree.root(), tree.sibling(tree.root(), 0));
    assertUndefined(tree.sibling(tree.root(), 1));
    
    // check first level node's siblings
    assertUndefined(tree.leftSibling(tree.getNode('0')));
    assertEquals(tree.getNode('0'), tree.leftSibling('1'));
    
    assertEquals(tree.getNode('1'), tree.rightSibling('0'));
    assertUndefined(tree.rightSibling('1'));
    
    // check if sibling is the same for any node on the specified level
    assertEquals(tree.sibling(tree.getNode('0'), 0), tree.getNode('0'));
    assertEquals(tree.sibling(tree.getNode('0'), 0), tree.siblings(tree.getNode('1'), 0));
    
    // check if sibling functions gives the same result for node argument and id argument
    assertEquals(tree.leftSibling(tree.getNode('1')), tree.leftSibling('1'));
    assertEquals(tree.rightSibling(tree.getNode('0')), tree.rightSibling('0'));
    assertEquals(tree.sibling(tree.getNode('0'), 1), tree.sibling('0', 1));
    
    // check if all sibling functions give the same results
    assertEquals(tree.leftSibling('1-2'), tree.rightSibling('1-0'));
    assertEquals(tree.sibling('1-2', 0), tree.leftSibling('1-1'));
    
    // check if sibling functions throw exceptions with bad argument(bad id)
    assertException(function() {
        tree.leftSibling(badId);
    }, undefined);
    assertException(function() {
        tree.rightSibling(badId);
    }, undefined);
    assertException(function() {
        tree.sibling(badId, 0);
    }, undefined);
    
    // bad sibling number
    assertException(function() {
        tree.sibling('0', '0');
    }, undefined);
    
    // check if sibling functions throw exceptions with bad argument(bad node)
    assertException(function() {
        tree.leftSibling(badNode);
    }, undefined);
    assertException(function() {
        tree.rightSibling(badNode);
    }, undefined);
    assertException(function() {
        tree.sibling(badNode, 0);
    }, undefined);
    
    // bad sibling number
    assertException(function() {
        tree.sibling('0', '0');
    }, undefined);
};

TreeTraversingTest.prototype.ancestorTest = function() {
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
    var badNode = {};
    
    // check if root is ancestor for various level nodes 
    assertTrue(tree.isAncestor(tree.root(), tree.getNode('0')));
    assertTrue(tree.isAncestor(tree.root(), tree.getNode('1')));
    assertTrue(tree.isAncestor(tree.root(), tree.getNode('1-2')));
    
    // check if first level node is ancestor for various level nodes
    assertTrue(tree.isAncestor(tree.getNode('0'), tree.getNode('0-1')));
    assertTrue(tree.isAncestor(tree.getNode('0'), tree.getNode('0-2')));
    
    assertFalse(tree.isAncestor(tree.getNode('0'), tree.getNode('1')));
    assertFalse(tree.isAncestor(tree.getNode('0'), tree.root()));
    
    // check result for bad arguments: bad nodes
    assertException(function() {
        tree.isAncestor(tree.root(), badNode);
    }, undefined);
    
    // bad sibling number
    assertException(function() {
        tree.isAncestor(badNode, tree.root());
    }, undefined);
};


IterationTest.prototype.nextTest = function() {
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
    var badNode = {};
    var badId = {};
    
    // test root's next node 
    assertEquals(tree.next(tree.root()), tree.getNode('0'));
    
    // test if next gives the same result for node argument and for id argument
    assertEquals(tree.next(tree.root()), tree.next(tree.nodeId(tree.root())));
    
    // test next if the given node has no children, but has right sibling
    assertEquals(tree.next(tree.getNode('0-1')), tree.getNode('0-2'));
    
    // test next if the given node has no children and no right sibling, but parent has right sibling
    assertEquals(tree.next(tree.getNode('0-2')), tree.getNode('1'));
    
    // test next for the last node in the tree
    assertUndefined(tree.next(tree.getNode('1-2')));
    
    // check if next throws exceptions for bad arguments(bad id)
    assertException(function() {
        tree.next(badId);
    }, undefined);
    
    // bad node
    assertException(function() {
        tree.next(badNode);
    }, undefined);
};

IterationTest.prototype.iterateTest = function() {
    var data = [
        {'id': '0', 'name': 'fruit'},
        {'id': '0-1', 'name': 'apple'},
        {'id': '0-2', 'name': 'pear'},
        {'id': '1', 'name': 'vegetable'},
        {'id': '1-0', 'name': 'carrot'},
        {'id': '1-1', 'name': 'salad'},
        {'id': '1-2', 'name': 'tomato'}
    ];
    var emptyData = [];
    
    var tree = monkey.createTree(data, 'id');
    var emptyTree = monkey.createTree(emptyData, 'id');

    var ids = [];
    
    // test if tree is iterated in the correct order(partially tested by next tests)
    tree.iterate(function(node) {
        ids.push(tree.nodeId(node));
    });
    assertEquals(ids, ['0', '0-1', '0-2', '1', '1-0', '1-1', '1-2']);
    
    // test empty tree iteration
    ids = [];
    emptyTree.iterate(function(node) {
        ids.push(emptyTree.nodeId(node));
    });
    assertEquals(ids, []);
    
    // test if tree is not changed by iterate function
    tree.iterate(function(node) {
        node['badId'] = node['id'];
    });
    assertUndefined(tree.root()['badId']);
    assertUndefined(tree.getNode('0')['badId']);
};

IterationTest.prototype.forEachTest = function() {
    var data = [
        {'id': '0', 'name': 'fruit'},
        {'id': '0-1', 'name': 'apple'},
        {'id': '0-2', 'name': 'pear'},
        {'id': '1', 'name': 'vegetable'},
        {'id': '1-0', 'name': 'carrot'},
        {'id': '1-1', 'name': 'salad'},
        {'id': '1-2', 'name': 'tomato'}
    ];
    var emptyData = [];
    
    var tree = monkey.createTree(data, 'id');
    var emptyTree = monkey.createTree(emptyData, 'id');

    var ids = [];
    
    // test if tree is iterated in the correct order(partially tested by next tests)
    tree.forEach(function(node) {
        ids.push(tree.nodeId(node));
    });
    assertEquals(ids, ['0', '0-1', '0-2', '1', '1-0', '1-1', '1-2']);
    
    // test empty tree iteration
    ids = [];
    emptyTree.forEach(function(node) {
        ids.push(tree.nodeId(node));
    });
    assertEquals(ids, []);
    
    // test if tree is not changed by forEach function
    tree.forEach(function(node) {
        node['badId'] = node['id'];
    });
    assertUndefined(tree.root()['badId']);
    assertUndefined(tree.getNode('0')['badId']);
};

IterationTest.prototype.mapTest = function() {
    var getValues = function(list, property) {
        return list.map(function(e) {
            return e[property];
        });
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
    var emptyData = [];
    
    var tree = monkey.createTree(data, 'id');
    var emptyTree = monkey.createTree(emptyData, 'id');
    
    var mappedTree;
    var mappedEmptyTree;

    var tmp_array = [];
    
    // test if tree is iterated in the correct order(partially tested by next tests)
    mappedTree = tree.map(function(node) {
        node['add_arg'] = node['id'];
        return node;
    });
    
    mappedTree.iterate(function(node) {
        tmp_array.push(node['id']);
    });
    assertEquals(tmp_array, ['0', '0-1', '0-2', '1', '1-0', '1-1', '1-2']);
    
    tmp_array = [];
    mappedTree.iterate(function(node) {
        tmp_array.push(node['add_arg']);
    });
    assertEquals(tmp_array, ['0', '0-1', '0-2', '1', '1-0', '1-1', '1-2']);
    
    // test if original tree is not changed by map
    assertUndefined(tree.root()['add_arg']);
    assertUndefined(tree.getNode('0')['add_arg']);
    
    
    // test result for empty tree
    tmp_array = [];
    emptyTree.forEach(function(node) {
        tmp_array.push(emptyTree.nodeId(node));
    });
    assertEquals(tmp_array, []);
    
    // test if tree is not changed by forEach function
    tree.forEach(function(node) {
        node['badId'] = node['id'];
    });
};

IterationTest.prototype.toListTest = function() {
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
    
    // check if list data is the same after converting tree to list
    assertEquals(data, tree.toList());
};

CountTest.prototype.countLevelTest = function() {
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
    
    // test number of tree not-root nodes on root level
    assertEquals(tree.countLevel(tree.root()), 0);
    
    // test number of first level nodes
    assertEquals(tree.countLevel(tree.getNode('0')), 2);
    
    // check if the function gives the same result for id argument and node argument
    assertEquals(tree.countLevel('0'), 2);
    
    // check if the fucntion gives the same result for any node on selected level
    assertEquals(tree.countLevel('0'), tree.countLevel('1'));
    
    // check if the function gives correct result for no first level node
    assertEquals(tree.countLevel('0-1'), 2);
    
    // test result for not existing node
    assertEquals(tree.countLevel('2'), 0);
    
    // test if function throws exception for bad argument: id
    assertException(function() {
        tree.countLevel(badId);
    }, undefined);
    
    // bad node
    assertException(function() {
        tree.countLevel(badNode);
    }, undefined);
};

CountTest.prototype.countSubtreeTest = function() {
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
    var badId = {};
    var badNode = {};
    
    // test number of nodes in full tree
    assertEquals(tree.countSubtree(tree.root()), 7);
    
    // test if the default argument is root
    assertEquals(tree.countSubtree(), tree.countSubtree(tree.root()));
    
    // check result for first level subroot
    assertEquals(tree.countSubtree(tree.getNode('0')), 3);
    
    // check if the function gives the same result for id argument and for node argument
    assertEquals(tree.countSubtree(tree.getNode('0')), tree.countSubtree('0'));
    
    // check result for not existing node
    assertEquals(tree.countSubtree('3'), 0);
    
    // test if function throws exception for bad argument: id
    assertException(function() {
        tree.countSubtree(badId);
    }, undefined);
    
    // bad node
    assertException(function() {
        tree.countSubtree(badNode);
    }, undefined);
};
