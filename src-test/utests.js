CreationTest = TestCase("CreattionTest");
GetNodeTest = TestCase("GetNodeTest");

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
    
    assertEquals(2, tree['treeData']['root']['children']);
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

CreationTest.prototype.testInsertion = function() {
    var listData = [
        {'id': '0', 'name': 'fruit'},
        {'id': '1', 'name': 'vegetable'},
    ];
    var tree = monkey.createTree(listData, 'id');
    
    assertEquals(2, tree['treeData']['root']['children']);
};

GetNodeTest.prototype.testInsertion = function() {
    var simpleData = [
        {'id': '0', 'name': 'fruit'},
        {'id': '1', 'name': 'vegetable'},
    ];
    var tree = monkey.createTree(simpleData, 'id');
    
    assertEquals(2, tree['treeData']['root']['children']);
};