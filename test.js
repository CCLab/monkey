/*

Testing monkey.

*/

(function() {
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
    /*childrenList.forEach( function(el) {
        tree.insertNode(el);
    });*/
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
    tree2.iterate(function(node) { document.write(node['idef'] + '<hr>'); ++count;});
    document.write('count = ' + count);
    
    var treeMaped = tree2.map(function(node){ node['type'] = node['type'] + node['type']; return node;});
    treeMaped.iterate(function(node) { document.write(node['idef'] + '<hr>'); ++count;});
    print('tree2 count = ' + tree2.countSubtree() + '<hr>');
    print('treeMaped count = ' + treeMaped.countSubtree() + '<hr>');
    print('tree2 count 1-1 = ' + tree2.countSubtree('1-1') + '<hr>');
    print('treeMaped count 1-1 = ' + treeMaped.countSubtree('1-1') + '<hr>');
    print('tree2 level-count 1-1 = ' + tree2.countLevel('1-1') + '<hr>');
    print('treeMaped level-count 1-1 = ' + treeMaped.countLevel('1-1') + '<hr>');
    
    var list = tree2.toList();
})();