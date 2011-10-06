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
    
    
    var childrenList = [{'id': '0-1-0', 'name': 'lobo'},
                        {'id': '0-1-1', 'name': 'champion'}
    ];
    var someId = '1-0';
    
    var tree = monkey.createTree(listData, 'id');
    childrenList.forEach( function(el) {
        tree.insertNode(el);
    });
    
    var someData = tree.getNode(someId);
    console.log('someData = {id:' + someData['id'] + ', ' + someData['name'] + '}');
    
    var tree2 = monkey.createTree(rows, 'idef');
})();