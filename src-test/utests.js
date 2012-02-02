// ------------------------------- TEST CASES ---------------------------------

// Functions tested: monkey.createTree() 
CreationTest = TestCase("CreationTest");

// Functions tested: root(), isRoot(), getNode(), nodeId(), value()
BasicFunctionsTest = TestCase("BasicFunctionsTest");

// Functions tested: parent(), children(), leftSibling(), rightSibling(), sibling(), isAncestor()
TreeTraversingTest = TestCase("TreeTraversingTest");

// Functions tested: insertNode(), removeNode(), updateTree()
ModificationTest = TestCase("ModificationTest");

// Functions tested: next(), iterate(), forEach(), map(), forEach(), toList(), isNodeFiltered(), filter(), sort()
IterationTest = TestCase("IterationTest");

// Functions tested: countLevel(), countSubtree()
CountTest = TestCase("CountTest");

// Functions tested: copy(), subtree()
OtherTest = TestCase("OtherTest");


// ------------------------------- TESTS --------------------------------------


CreationTest.prototype.testEmptyCreation = function() {
    var emptyData = [ ];
    
    var tree = monkey.createTree(emptyData, 'id');
    
    assertEquals('function', typeof tree.insertNode);
    assertEquals('function', typeof tree.updateTree);
    assertEquals('function', typeof tree.removeNode);
    assertEquals('function', typeof tree.getNode);
    assertEquals('function', typeof tree.parent);
    assertEquals('function', typeof tree.topParent);
    assertEquals('function', typeof tree.parents);
    assertEquals('function', typeof tree.root);
    assertEquals('function', typeof tree.isRoot);
    assertEquals('function', typeof tree.isNodeFiltered);
    assertEquals('function', typeof tree.leftSibling);
    assertEquals('function', typeof tree.rightSibling);
    assertEquals('function', typeof tree.sibling);
    assertEquals('function', typeof tree.children);
    assertEquals('function', typeof tree.value);
    assertEquals('function', typeof tree.next);
    assertEquals('function', typeof tree.iterate);
    assertEquals('function', typeof tree.forEach);
    assertEquals('function', typeof tree.map);
    assertEquals('function', typeof tree.filter);
    assertEquals('function', typeof tree.sort);
    assertEquals('function', typeof tree.countSubtree);
    assertEquals('function', typeof tree.countLevel);
    assertEquals('function', typeof tree.nodeId);
    assertEquals('function', typeof tree.copy);
    assertEquals('function', typeof tree.toList);
    assertEquals('function', typeof tree.subtree);
};

CreationTest.prototype.testNotEmptyCreation = function() {
    var listData = [
        {'id': '0', 'name': 'fruit'},
        {'id': '1', 'name': 'vegetable'},
    ];
    var tree = monkey.createTree(listData, 'id');
    
    // check if list data is not changed after tree creation
    assertEquals({'id': '0', 'name': 'fruit'}, listData[0]);
    assertEquals({'id': '1', 'name': 'vegetable'}, listData[1]);
    
    // check if changing values from initial list does not affect tree
    listData[0]['name'] = 'nonfruit';
    assertEquals('fruit', tree.getNode('0')['name']);
};

CreationTest.prototype.testErrors = function() {
    var wrongData = "data";
    var wrongId = 1;
    var goodData = [
        {'id': '0', 'name': 'fruit'},
        {'id': '1', 'name': 'vegetable'},
    ];
    
    // Check if exception is thrown for bad argument: bad data
    assertException(function() {
        monkey.createTree(wrongData, 'id');
    }, undefined);
    
    // bad id
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
    assertEquals('__root__', tree.root().id);
    
    // test root's parent and children
    assertUndefined(tree.root().parent);
    assertArray(tree.root().__children__.get());
    assertEquals(2, tree.root().__children__.length());
    
    // test isRoot function for node argument
    assertTrue(tree.isRoot(tree.root()));
    assertFalse(tree.isRoot(tree.getNode('0')));
    
    // test isRoot function for node id argument
    assertTrue(tree.isRoot(tree.root().__id__));
    assertFalse(tree.isRoot('0'));
};

BasicFunctionsTest.prototype.testGet = function() {
    var simpleData = [
        {'id': '0', 'name': 'fruit'},
        {'id': '1', 'name': 'vegetable'},
    ];
    var tree = monkey.createTree(simpleData, 'id');
    var copy;
    
    // test result for root
    assertEquals('__root__', tree.getNode('__root__').id);
    assertSame(tree.getNode('__root__'), tree.root());
    
    // test result for various level nodes
    assertEquals('0', tree.getNode('0').id);
    assertEquals('1', tree.getNode('1').id);
    
    // test result for not existing nodes
    assertUndefined(tree.getNode('1-0'));
    assertUndefined(tree.getNode('2'));
    assertUndefined(tree.getNode('1-0-3'));
    
    // test if copies are returned properly
    copy = tree.getNode('0', true);
    assertEquals(simpleData[0], copy);
    copy['id'] = '1000';
    assertEquals(simpleData[0], tree.getNode('0', true));
};

BasicFunctionsTest.prototype.testGetId = function() {
    var simpleData = [
        {'id': '0', 'name': 'fruit'},
        {'id': '0-1', 'name': 'apple'},
        {'id': '1', 'name': 'vegetable'}
    ];
    var tree = monkey.createTree(simpleData, 'id');
    var badId = {};
    
    // check result for various level nodes
    assertEquals('0', tree.nodeId(tree.getNode('0')));
    assertEquals('1', tree.nodeId(tree.getNode('1')));
    assertEquals('0-1', tree.nodeId(tree.getNode('0-1')));
    
    // check result for root
    assertEquals('__root__', tree.nodeId(tree.getNode('__root__')));
    
    // test reaction for bad argument: bad id
    assertException(function() {
        tree.getNode(badId);
    }, undefined);
};

BasicFunctionsTest.prototype.testValue = function() {
    var simpleData = [
        {'id': '0', 'name': 'fruit'},
        {'id': '1', 'name': 'vegetable'},
        {'id': '0-0', 'name': 'apple'}
    ];
    var tree = monkey.createTree(simpleData, 'id');
    var badNode = {};
    var badId = {};
    var value;
    var tmpNode;
    
    // check if copies of original values are the same as values of nodes
    // (without parent and children properties)
    assertEquals(simpleData[0], tree.value(tree.getNode('0')));
    assertEquals(simpleData[1], tree.value(tree.getNode('1')));
    assertEquals(simpleData[2], tree.value(tree.getNode('0-0')));
    
    // check if changing value does not affect tree
    tmpNode = tree.value('0');
    tmpNode['name'] = 'notfruit';
    assertEquals(simpleData[0], tree.value(tree.getNode('0')));
    
    // check if value does not copy node properties
    value = tree.value('0');
    assertUndefined(value['children']);
    assertUndefined(value['parent']);
    assertUndefined(value['filtered']);
    
    // check if function works for id argument and node argument
    assertEquals(simpleData[0], tree.value('0'));
    
    // check if undefined is returned for nonexisting nodes
    assertUndefined(tree.value('1213'));
    
    // test reaction for bad argument: bad node
    assertException(function() {
        tree.insertNode(badNode);
    }, undefined);
    // bad id
    assertException(function() {
        tree.insertNode(badId);
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
    var parentNodeCopy;
    var tree = monkey.createTree(data, 'id');
    
    // test if the root has no parent
    assertUndefined(tree.parent(tree.root()));
    
    // test if first level node's parent is the root
    assertSame(tree.root(), tree.parent(tree.getNode('0')));
    
    // test if parent gives the same result for id and for node as an argument
    assertSame(tree.parent(tree.getNode('0')), tree.parent('0'));
    
    // test for second level nodes
    assertSame(tree.parent(tree.getNode('0-1')), tree.getNode('0'));
    assertSame(tree.parent(tree.getNode('1-0')), tree.getNode('1'));
    
    // check if parent is returned for not existing node
    assertUndefined(tree.parent('2'));
    
    // check if parent is properly copied when second argument is passed
    parentNodeCopy = tree.parent('0-1', true);
    assertEquals(tree.value('0'), parentNodeCopy);
    assertNotSame(tree.value('0'), parentNodeCopy);
    
    parentNodeCopy['name'] = 'nonfruit';
    assertNotEquals(tree.value('0'), parentNodeCopy);
    
    // check if parent throws exceptions with bad argument(non-string id)
    assertException(function() {
        tree.parent(badId);
    }, undefined);
};

TreeTraversingTest.prototype.testParents = function() {
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
    assertEquals([], tree.parents(tree.root()));
    
    // test if top level node has no parents
    assertEquals([], tree.parents('0'));
    
    // test if parents gives the same result for id and for node as an argument
    assertEquals(tree.parents('0'), tree.parents(tree.getNode('0')));
    
    // test for deeper nodes
    assertEquals([tree.getNode('0')], tree.parents('0-1'));
    assertEquals([tree.getNode('0'), tree.getNode('0-2')], tree.parents('0-2-2'));
    
   // test if copies are returned if second argument is true
   assertEquals([], tree.parents('0', true));
   assertEquals([tree.getNode('0', true)], tree.parents('0-1', true));
    
    // check if parents throws exceptions with bad argument(non-string id)
    assertException(function() {
        tree.parents(badId);
    }, undefined);
};

TreeTraversingTest.prototype.testTopParent = function() {
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
    var parentNodeCopy;
    var tree = monkey.createTree(data, 'id');
    
    // check result for root and top level node
    assertUndefined(tree.topParent(tree.root()));
    assertUndefined(tree.topParent('0'));
    
    // check result for deeper nodes
    assertEquals(tree.getNode('0'), tree.topParent('0-1'));
    assertEquals(tree.getNode('1'), tree.topParent('1-0'));
    assertEquals(tree.getNode('0'), tree.topParent('0-2-3'));
    
    // test if topParent gives the same result for id and for node as an argument
    assertSame(tree.topParent(tree.getNode('0-2-3')), tree.topParent('0-2-3'));
    
    // test if copies are returned if second argument is true
    assertEquals(tree.getNode('0', true), tree.topParent('0-2-3', true));

    // check if topParent throws exceptions with bad argument(non-string id)
    assertException(function() {
        tree.parent(badId);
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
    var childNodesCopies1, childNodesCopies2;
    var badId = {};
    var badNode = {};
    
    // check id's of root's children
    assertEquals(['0', '1'], getIdsInList(tree.children(tree.root())));
    
    // check ids of first level node's children
    assertEquals(['1-0', '1-1', '1-2'], getIdsInList(tree.children(tree.getNode('1'))));
    
    // check ids of leaf node's children
    assertEquals([], getIdsInList(tree.children(tree.getNode('1-2'))));
    
    // check if the same result is for a node argument and an id argument
    assertEquals(getIdsInList(tree.children(tree.getNode('1'))), getIdsInList(tree.children('1')));
    assertSame(tree.children(tree.getNode('1')), tree.children('1'));
    
    // test for not existing node
    assertEquals([], tree.children('2'));
    
    // check if children() returns copies when second parameter is set to true
    childNodesCopies1 = tree.children('1', true);
    assertEquals(data[4], childNodesCopies1[0]);
    assertNotSame(data[4], childNodesCopies1[0]);
    
    
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
    var leftSiblingNodeCopy, rightSiblingNodeCopy, siblingNodeCopy;
    var badId = {};
    var badNode = {};
    
    //  root's left and right siblings
    assertUndefined(tree.leftSibling(tree.root()));
    assertUndefined(tree.rightSibling(tree.root()));
    
    // check siblings of root by their number
    assertSame(tree.root(), tree.sibling(tree.root(), 0));
    assertUndefined(tree.sibling(tree.root(), 1));
    
    // check first level node's siblings
    assertUndefined(tree.leftSibling(tree.getNode('0')));
    assertSame(tree.getNode('0'), tree.leftSibling('1'));
    
    assertSame(tree.getNode('1'), tree.rightSibling('0'));
    assertUndefined(tree.rightSibling('1'));
    
    // check if sibling is the same for any node on the specified level
    assertSame(tree.getNode('0'), tree.sibling(tree.getNode('0'), 0));
    assertSame(tree.getNode('0'), tree.sibling(tree.getNode('1'), 0));
    
    // check if sibling functions gives the same result for node argument and id argument
    assertSame(tree.leftSibling(tree.getNode('1')), tree.leftSibling('1'));
    assertSame(tree.rightSibling(tree.getNode('0')), tree.rightSibling('0'));
    assertSame(tree.sibling(tree.getNode('0'), 1), tree.sibling('0', 1));
    
    // check if all sibling functions give the same results
    assertSame(tree.leftSibling('1-2'), tree.rightSibling('1-0'));
    assertSame(tree.sibling('1-2', 0), tree.leftSibling('1-1'));
    
    // check if all sibling functions return copies of nodes when last argument is set to true
    leftSiblingNodeCopy = tree.leftSibling('1-2', true);
    rightSiblingNodeCopy = tree.rightSibling('1-0', true);
    siblingNodeCopy = tree.sibling('1-1', 1, true);
    
    assertEquals(leftSiblingNodeCopy, rightSiblingNodeCopy);
    assertNotSame(leftSiblingNodeCopy, rightSiblingNodeCopy);
    assertEquals(leftSiblingNodeCopy, siblingNodeCopy);
    assertNotSame(leftSiblingNodeCopy, siblingNodeCopy);
    assertEquals(rightSiblingNodeCopy, siblingNodeCopy);
    assertNotSame(rightSiblingNodeCopy, siblingNodeCopy);
    
    // check if all functions return undefined for nonexisting node
    assertUndefined(tree.leftSibling('1-5'));
    assertUndefined(tree.rightSibling('1-5'));
    assertUndefined(tree.sibling('1-5', 6));
    
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

TreeTraversingTest.prototype.testAncestor = function() {
    var data = [
        {'id': '0', 'name': 'fruit'},
        {'id': '0-1', 'name': 'apple'},
        {'id': '0-2', 'name': 'pear'},
        {'id': '1', 'name': 'vegetable'},
        {'id': '1-0', 'name': 'carrot'},
        {'id': '1-1', 'name': 'salad'},
        {'id': '1-2', 'name': 'tomato'},
        {'id': '1-2-1', 'name': 'redtomato'}
    ];
    var tree = monkey.createTree(data, 'id');
    var badNode = {};
    
    // check if root is ancestor for various level nodes 
    assertTrue(tree.isAncestor(tree.root(), tree.getNode('0')));
    assertTrue(tree.isAncestor(tree.root(), tree.getNode('1')));
    assertTrue(tree.isAncestor(tree.root(), tree.getNode('1-2')));
    assertFalse(tree.isAncestor(tree.root(), tree.root()));
    
    // check if first level node is ancestor for various level nodes
    assertTrue(tree.isAncestor(tree.getNode('0'), tree.getNode('0-1')));
    assertTrue(tree.isAncestor(tree.getNode('0'), tree.getNode('0-2')));
    assertTrue(tree.isAncestor(tree.getNode('1'), tree.getNode('1-2-1')));
    
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


ModificationTest.prototype.testInsertNode = function() {
    var simpleData = [
        {'id': '0', 'name': 'fruit'},
        {'id': '4', 'name': 'vegetable'}
    ];
    var simpleDataWithParent = [
        {'name': 'fruit', 'parent': null},
        {'name': 'vegetable', 'parent': null},
        {'name': 'apple', 'parent': 'fruit'},
        {'name': 'carrot', 'parent': 'vegetable'},
    ];
    var tree = monkey.createTree(simpleData, 'id');
    var par_tree = monkey.createTree(simpleDataWithParent, 'name', 'parent');
    
    var newNode1 = {'id': '2', 'name': 'other'};
    var newNode2 = {'id': '2-0', 'name': 'other-other'};
    var midNode = {'id': '0-0', 'name': 'deep-fruit'};
    var deepNode = {'id': '0-0-0', 'name': 'very-deep-fruit'};
    var newNode3 = {'name': 'pear', 'parent': 'fruit'};
    var newNode4 = {'name': 'ear', 'parent': 'hu'};
    var badNode = {'another_id': '2-1', 'name': 'other-another'};
    var badNode2 = {'name': 'animal', 'age': 10};
    
    // test if tree is returned
    assertSame(tree, tree.insertNode(newNode1));
    
    // test if node is inserted in the good place
    assertEquals(3, tree.children(tree.root()).length);
    //TODO
    //assertEquals('2', tree.nodeId(tree.children(tree.root())[1]));
    
    // check if node has not changed since insertion
    //TODO
    assertEquals(newNode1, tree.value('2'));
    //assertEquals(newNode1['name'], tree.children(tree.root())[1]['name']);
    
    // test if new node is not reinserted
    tree.insertNode(newNode1);
    assertEquals(3, tree.children(tree.root()).length);
    
    // test if new node is inserted in the good place(correct parent and order)
    tree.insertNode(newNode2);
    assertEquals(1, tree.children(tree.getNode('2')).length);
    
    // test if deep node is not inserted(no direct parent in tree)
    tree.insertNode(deepNode);
    assertEquals([], tree.children('0'));
    assertEquals(0, tree.children(tree.getNode('0')).length);
    
    // test if reinserting deep node works when his direct parent is in tree
    tree.insertNode(midNode);
    assertEquals('0-0', tree.nodeId(tree.children('0')[0]));
    assertEquals('0', tree.nodeId(tree.parent('0-0')));
    tree.insertNode(deepNode);
    assertEquals('0-0-0', tree.nodeId(tree.children('0-0')[0]));
    
    // test insertion with another kind of hierarchy - parent column
    par_tree.insertNode(newNode3);
    assertEquals(par_tree.getNode('fruit'), par_tree.parent('pear'));
    
    // test if node is not inserted when parent does not exist - parent Column hierarchy
    par_tree.insertNode(newNode4);
    assertUndefined(par_tree.getNode('ear'));
    
    // test reaction for bad node
    assertException(function() {
        tree.insertNode(badNode);
    }, undefined);
    
    // bad node for tree with parent column
    assertException(function() {
        par_tree.insertNode(badNode2);
    }, undefined);
};

ModificationTest.prototype.testRemoveNode = function() {
    var getIdsInList = function(list) {
        return list.map( function (e) {
            return e['id'];
        });
    };
    var data = [
        {'id': '0', 'name': 'fruit'},
        {'id': '0-1', 'name': 'apple'},
        {'id': '0-2', 'name': 'pear'},
        {'id': '0-2-1', 'name': 'red-pear'},
        {'id': '0-2-2', 'name': 'yellow-pear'},
        {'id': '0-3', 'name': 'banana'},
        {'id': '1', 'name': 'vegetable'},
        {'id': '1-0', 'name': 'carrot'},
        {'id': '1-1', 'name': 'salad'},
        {'id': '1-2', 'name': 'tomato'},
        {'id': '2', 'name': 'unknown'}
    ];
    var tree = monkey.createTree(data, 'id');
    var newNode = {'id': '0-2', 'name': 'superpear'};
    var badNode = {};
    var badId = {};
    
    // test removing nodes with id argument for various levels
    tree.removeNode('2');
    assertEquals(['0', '1'], getIdsInList(tree.children(tree.root())));
    assertUndefined(tree.getNode('2'));
    
    tree.removeNode('1-2');
    assertEquals(['1-0', '1-1'], getIdsInList(tree.children('1')));
    assertUndefined(tree.getNode('1-2'));
    
    // check if removing node works for node argument
    tree.removeNode(tree.getNode('0-1'));
    assertEquals(['1-0', '1-1'], getIdsInList(tree.children('1')));
    assertUndefined(tree.getNode('0-1'));
    
    // test reaction for removing not existing node
    tree.removeNode('3');
    assertEquals(['0', '1'], getIdsInList(tree.children(tree.root())));
    
    // test if its unable to remove root and rest of tree(first level is checked) is not changed
    tree.removeNode(tree.root());
    assertNotUndefined(tree.root());
    assertEquals(['0', '1'], getIdsInList(tree.children(tree.root())));
    
    // test if exception is thrown for bad argument: bad id
    assertException(function() {
        tree.removeNode(badId);
    }, undefined);
    
    // bad node
    assertException(function() {
        tree.removeNode(badNode);
    }, undefined);
};

ModificationTest.prototype.testUpdateTree = function() {
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
    assertEquals(['red-apple', 'yellow-apple', 'green-apple'], childrenNames);
    
    // check if green apple has still has its child
    childrenNames = tree.children('green-apple', true).map(function(node) {
        return node['name'];
    });
    assertEquals(['big-green-apple'], childrenNames);
    
    // check if sequence of nodes is correct
    allNames = tree.toList().map(function(node) {
        return node['name'];
    });
    assertEquals(['fruit', 'apple', 'red-apple', 'yellow-apple', 'green-apple', 'big-green-apple',
                  'vegetable', 'carrot'], allNames);
    
    // check if new node in the correct place
    tree.insertNode(newNode);
    allNames = tree.toList().map(function(node) {
        return node['name'];
    });
    assertEquals(['fruit', 'apple', 'red-apple', 'yellow-apple', 'small-yellow-apple', 'green-apple',
                  'big-green-apple', 'vegetable', 'carrot'], allNames);

    // check if exception is thrown for bad nodes(no id)
    assertException(function() {
        tree.updateTree(badNewData);
    }, undefined);
    
    // bad nodes(no parent id)
    assertException(function() {
        tree.updateTree(badNewData2);
    }, undefined);
};

IterationTest.prototype.testNext = function() {
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
    var badNode = {};
    var badId = {};
    
    // test root's next node 
    assertSame(tree.next(tree.root()), tree.getNode('0'));
    
    // test if next gives the same result for node argument and for id argument
    assertSame(tree.next(tree.root()), tree.next(tree.nodeId(tree.root())));
    
    // test if no node is passed
    assertSame(tree.next(tree.root()), tree.next());
    
    // test next if the given node has no children, but has right sibling
    assertSame(tree.next(tree.getNode('0-1')), tree.getNode('0-2'));
    
    // test next if the given node has no children and no right sibling, but parent has right sibling
    assertSame(tree.next(tree.getNode('0-2')), tree.getNode('1'));
    
    // test next for the last node in the tree
    assertUndefined(tree.next(tree.getNode('1-2')));
    
    // test next when next node is removed
    tree.removeNode('1');
    assertUndefined(tree.next('0-2'));
    
    // test next for empty tree
    assertUndefined(emptyTree.next(emptyTree.root()));
    
    // test next when given node does not exist in tree
    assertUndefined(tree.next('23'));
    
    // check if next throws exceptions for bad arguments(bad id)
    assertException(function() {
        tree.next(badId);
    }, undefined);
    
    // bad node
    assertException(function() {
        tree.next(badNode);
    }, undefined);
};

IterationTest.prototype.testIterate = function() {
    var addName = function(node) {
        names.push(node['name']);
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
    var names = [];
    var startNode = tree.getNode('0-2');
    var endNode = tree.getNode('1-2');
    var badNode = {'___id': '0', 'name': '____fruit'};
    var badId = '6';
    
    // test iteration for node arguments
    tree.iterate(addName, startNode, endNode);
    assertEquals(['pear', 'vegetable', 'carrot', 'salad'], names);
    
    // test iteration for id arguments
    names = [];
    tree.iterate(addName, '0-1', '1-1');
    assertEquals(['apple', 'pear', 'vegetable', 'carrot'], names);
    
    // test iteration for empty end node argument
    names = [];
    tree.iterate(addName, '1');
    assertEquals(['vegetable', 'carrot', 'salad', 'tomato'], names);
    
    // test iteration for empty first node argument
    names = [];
    tree.iterate(addName, undefined, '1');
    assertEquals(['fruit', 'apple', 'pear'], names);
    
    // test iteration for empty both first and end node arguments
    names = [];
    tree.iterate(addName);
    assertEquals(['fruit', 'apple', 'pear', 'vegetable',
                  'carrot', 'salad', 'tomato'], names);
    
    // test if exception is throw for bad node
    assertException(function() {
        tree.iterate(addName, badNode, badNode);
    }, undefined);
    
    // bad id
    assertException(function() {
        tree.iterate(addName, badId, badId);
    }, undefined);
    
    // bad function
    assertException(function() {
        tree.iterate('not function');
    }, undefined);
};

IterationTest.prototype.testForEach = function() {
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
    assertEquals(['0', '0-1', '0-2', '1', '1-0', '1-1', '1-2'], ids);
    
    // test empty tree iteration
    ids = [];
    emptyTree.forEach(function(node) {
        ids.push(tree.nodeId(node));
    });
    assertEquals([], ids);
    
    // test if tree is changed by forEach function
    tree.forEach(function(node) {
        node['badId'] = node['id'];
    });
    
    assertEquals('0', tree.getNode('0')['badId']);
    
    // test if exception is thrown for bad function
    assertException(function() {
        tree.forEach('not function');
    }, undefined);
};

IterationTest.prototype.testMap = function() {
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
    
    mappedTree.forEach(function(node) {
        tmp_array.push(node['id']);
    });
    assertEquals(['0', '0-1', '0-2', '1', '1-0', '1-1', '1-2'], tmp_array);
    
    tmp_array = [];
    mappedTree.forEach(function(node) {
        tmp_array.push(node['add_arg']);
    });
    assertEquals(['0', '0-1', '0-2', '1', '1-0', '1-1', '1-2'], tmp_array);
    
    // test if original tree is not changed by map
    assertUndefined(tree.root()['add_arg']);
    assertUndefined(tree.getNode('0')['add_arg']);
    
    
    // test result for empty tree
    mappedEmptyTree = emptyTree.map(function(node) {
        node['add_arg'] = node['id'];
        return node;
    });
    
    tmp_array = [];
    mappedEmptyTree.forEach(function(node) {
        tmp_array.push(emptyTree.nodeId(node));
    });
    assertEquals([], tmp_array);
    
    // test if tree is not changed by forEach function
    tree.forEach(function(node) {
        node['badId'] = node['id'];
    });
    
    // test if exception is thrown for bad function
    assertException(function() {
        tree.map('not function');
    }, undefined);
};

IterationTest.prototype.testFilter = function() {
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
    var allNodes;
    
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
    
    assertEquals(filteredNodes, filteredTree.toList());
    
    // check if toList on filtered tree returns all nodes
    // with acceptFiltered set to true
    allNodes = tree.toList().map(function(e) {
        return e['id'];
    });
    filteredNodes = tree.filter(function(e) {
        return e['val'] > 4;
    }).toList(true).map(function(e) {
        return e['id'];
    });
    
    assertEquals(allNodes, filteredNodes);
    
    
    // check if leafs are filtered out properly
    filteredTree = filteredTree.filter(function(node) {
        return node['val'] > 2;
    });
    
    filteredNodes = tree.toList()
                        .filter(function(e) {
                            return e['val'] > 2;
                        });
    assertEquals(filteredNodes, filteredTree.toList());
    assertFalse(filteredTree.isNodeFiltered('0-2'));
    assertTrue(filteredTree.isNodeFiltered('1'));
    
    // check if non-leaf nodes are filtered out properly
    filteredTree = filteredTree.filter(function(node) {
        return node['val'] > 3;
    });
    
    filteredNodes = tree.toList()
                        .filter(function(e) {
                            return e['val'] > 3;
                        });
    assertEquals(filteredNodes, filteredTree.toList());
    assertFalse(filteredTree.isNodeFiltered('1'));
    assertTrue(filteredTree.isNodeFiltered('1-0'));
    
    // check if all nodes can be filtered out properly
    filteredTree = filteredTree.filter(function(node) {
        return node['val'] > 100;
    });
    
    filteredNodes = tree.toList()
                        .filter(function(e) {
                            return e['val'] > 100;
                        });
    assertEquals(filteredNodes, filteredTree.toList());
    assertFalse(filteredTree.isNodeFiltered('0'));
    assertFalse(filteredTree.isNodeFiltered('0-2'));
    
    // test if exception is thrown for bad function
    assertException(function() {
        tree.filter('not function');
    }, undefined);
};

IterationTest.prototype.testSort = function() {
    var sortMin = function(node1, node2) {
        return node1['value'] - node2['value'];
    };
    var sortMax = function(node1, node2) {
        return node2['value'] - node1['value'];
    };
    
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
    
    // check various types of sorting
    sortedTree = tree.sort(sortMin);
    namesList = sortedTree.toList().map(function(node) {
        return node['name'];
    });
    assertEquals(['fruit', 'pear', 'apple', 'vegetable',
                  'carrot', 'tomato', 'salad'], namesList);
    
    sortedTree = tree.sort(sortMax);
    namesList = sortedTree.toList().map(function(node) {
        return node['name'];
    });
    assertEquals(['vegetable', 'salad', 'tomato', 'carrot',
                  'fruit', 'apple', 'pear'], namesList);
    
    // check if original tree is not changed
    namesList = tree.toList().map(function(node) {
        return node['name'];
    });
    assertEquals(['fruit', 'apple', 'pear', 'vegetable',
                  'carrot', 'salad', 'tomato'], namesList);
    
    // test if exception is thrown for bad function
    assertException(function() {
        tree.sort('not function');
    }, undefined);
};

IterationTest.prototype.testToList = function() {
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
    
    // check if copy of original data is the same after converting tree to list
    assertEquals(data, tree.toList());
};

CountTest.prototype.testCountLevel = function() {
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
    assertEquals(0, tree.countLevel(tree.root()));
    
    // test number of first level nodes
    assertEquals(2, tree.countLevel(tree.getNode('0')));
    
    // check if the function gives the same result for id argument and node argument
    assertEquals(2, tree.countLevel('0'));
    
    // check if the fucntion gives the same result for any node on selected level
    assertEquals(tree.countLevel('0'), tree.countLevel('1'));
    
    // check if the function gives correct result for no first level node
    assertEquals(2, tree.countLevel('0-1'));
    
    // test result for not existing node
    assertEquals(0, tree.countLevel('2'));
    assertEquals(0, tree.countLevel('1-3'));
    
    
    // test if function throws exception for bad argument: id
    assertException(function() {
        tree.countLevel(badId);
    }, undefined);
    
    // bad node
    assertException(function() {
        tree.countLevel(badNode);
    }, undefined);
};

CountTest.prototype.testCountSubtree = function() {
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
    assertEquals(7, tree.countSubtree(tree.root()));
    
    // test if the default argument is root
    assertEquals(tree.countSubtree(), tree.countSubtree(tree.root()));
    
    // check result for first/second level subroots
    assertEquals(3, tree.countSubtree(tree.getNode('0')));
    assertEquals(1, tree.countSubtree(tree.getNode('0-1')));
    
    // check if the function gives the same result for id argument and for node argument
    assertEquals(tree.countSubtree(tree.getNode('0')), tree.countSubtree('0'));
    
    // check result for not existing node
    assertEquals(0, tree.countSubtree('3'));
    
    // test if function throws exception for bad argument: id
    assertException(function() {
        tree.countSubtree(badId);
    }, undefined);
    
    // bad node
    assertException(function() {
        tree.countSubtree(badNode);
    }, undefined);
};


OtherTest.prototype.testCopy = function() {
    var data = [
        {'id': '0', 'name': 'fruit'},
        {'id': '0-1', 'name': 'apple'},
        {'id': '0-2', 'name': 'pear'},
        {'id': '1', 'name': 'vegetable'},
        {'id': '1-0', 'name': 'carrot'},
        {'id': '1-1', 'name': 'salad'},
        {'id': '1-2', 'name': 'tomato'}
    ];
    var pData = [
        {'name': 'fruit', 'parent': ''},
        {'name': 'apple', 'parent': 'fruit'},
        {'name': 'pear', 'parent': 'fruit'},
        {'name': 'vegetable', 'parent': ''},
        {'name': 'carrot', 'parent': 'vegetable'},
        {'name': 'salad', 'parent': 'vegetable'},
        {'name': 'tomato', 'parent': 'vegetable'}
    ];
    
    var tree = monkey.createTree(data, 'id');
    var copiedTree = tree.copy();
    var parentTree = monkey.createTree(pData, 'name', 'parent');
    var copiedParentTree = parentTree.copy();
    
    // check if copied values are the same as in list containing copy of original values
    // for both of hierarchy representations
    assertEquals(data, copiedTree.toList());
    assertEquals(pData, parentTree.toList());
};

OtherTest.prototype.testSubtree = function() {
    var getVals = function(list, arg) {
        var ids = [];
        list.forEach(function(node) {
            ids.push(node[arg]);
        });
        return ids;
    };
    var data = [
        {'id': '0', 'name': 'fruit'},
        {'id': '0-1', 'name': 'apple'},
        {'id': '0-1-1', 'name': 'a-apple'},
        {'id': '0-1-2', 'name': 'b-apple'},
        {'id': '0-1-3', 'name': 'c-apple'},
        {'id': '0-2', 'name': 'pear'},
        {'id': '1', 'name': 'vegetable'},
        {'id': '1-0', 'name': 'carrot'},
        {'id': '1-1', 'name': 'salad'},
        {'id': '1-2', 'name': 'tomato'}
    ];
    var parentData = [
        {'id': '0', 'name': 'fruit', 'parent': ''},
        {'id': '0-1', 'name': 'apple', 'parent': 'fruit'},
        {'id': '0-1-1', 'name': 'a-apple', 'parent': 'apple'},
        {'id': '0-1-2', 'name': 'b-apple', 'parent': 'apple'},
        {'id': '0-1-3', 'name': 'c-apple', 'parent': 'apple'},
        {'id': '0-2', 'name': 'pear', 'parent': 'fruit'},
        {'id': '1', 'name': 'vegetable', 'parent': ''},
        {'id': '1-0', 'name': 'carrot', 'parent': 'vegetable'},
        {'id': '1-1', 'name': 'salad', 'parent': 'vegetable'},
        {'id': '1-2', 'name': 'tomato', 'parent': 'vegetable'}
    ];
    
    var tree = monkey.createTree(data, 'id');
    var subtree;
    var parentTree = monkey.createTree(parentData, 'name', 'parent');
    
    // check if subtree returns node with copy set to false(or not set)
    assertEquals(tree.getNode('0'), tree.subtree('0'));
    
    // check if correct nodes are in subtree(for 2 types of trees)
    subtree = tree.subtree('0', true);
    assertEquals(['0', '0-1', '0-1-1', '0-1-2', '0-1-3', '0-2'], getVals(subtree.toList(), 'id'));
    
    subtree = parentTree.subtree('fruit', true);
    assertEquals(['fruit', 'apple', 'a-apple', 'b-apple', 'c-apple', 'pear'], getVals(subtree.toList(), 'name'));
    
    // check if undefined is returned when subtree root does not exist
    assertUndefined(tree.subtree('-23'));
    assertUndefined(tree.subtree('-23', true));
    
    assertUndefined(parentTree.subtree('nothing'));
    assertUndefined(parentTree.subtree('nothing', true));
};