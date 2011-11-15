/*

Testing monkey.

*/

(function() {
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