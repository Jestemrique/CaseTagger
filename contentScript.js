// create an observer instance

var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        console.log(mutation);
        /*
        var p = document.createElement("p");
        p.innerHTML = "type: " + mutation.type + "<br />" +
            "target id: " + mutation.target.id + "<br />" +
            "target attribute foo: " + mutation.target.attributes['foo'].value + "<br />";
            
        document.querySelector('.console').appendChild(p);
        */
    });
});
//target
var target = document.body;
// configuration of the observer:
var config = {
    attributes: true,
    childList: true,
    characterData: true
};

// pass in the target node, as well as the observer options
observer.observe(target, config);

// later, you can stop observing
//observer.disconnect();


/*
document.addEventListener('readystatechange', event => {
    if (event.target.readyState === 'interactive') {
      //initLoader();
      console.log("Interactive: " + document.readyState);
    }
    else if (event.target.readyState === 'complete') {
      //initApp();
      console.log("Complete: " + document.readyState);  
      var usuario = window.Aura.initConfig.context.globalValueProviders[0].values.CurrentUser.Email;
      console.log("USuario: " + usuario);
    }
  });
*/
/*
console.log("Start logging!");
  document.addEventListener("load",() => {
    console.log ("hola");
} )
*/





//userID: 005E0000007WyZOIA0




/*
function DOMtoString(document_root) {
    var html = '',
        node = document_root.firstChild;
    while (node) {
        switch (node.nodeType) {
        case Node.ELEMENT_NODE:
            html += node.outerHTML;
            break;
        case Node.TEXT_NODE:
            html += node.nodeValue;
            break;
        case Node.CDATA_SECTION_NODE:
            html += '<![CDATA[' + node.nodeValue + ']]>';
            break;
        case Node.COMMENT_NODE:
            html += '<!--' + node.nodeValue + '-->';
            break;
        case Node.DOCUMENT_TYPE_NODE:
            // (X)HTML documents are identified by public identifiers
            debugger;
            html += "<!DOCTYPE " + node.name + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') + (!node.publicId && node.systemId ? ' SYSTEM' : '') + (node.systemId ? ' "' + node.systemId + '"' : '') + '>\n';
            break;
        }
        node = node.nextSibling;
    }
    return html;
}
debugger;
const source = DOMtoString(document);
console.log("HERE'S THE MATCH");
console.log(source.match(/"@microstrategy.com"/));
console.log(document);

*/

