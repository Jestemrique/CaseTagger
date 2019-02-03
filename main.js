//globals

var cid = "";
var ctags = "";
var cData = "";
var isUpdating = false;
var backendIP = "10.27.73.135"
const apiCaseEndpoint = 'http://' + backendIP + ':3000/data/';
const apiTagEndpoint = 'http://' +backendIP +':3000/tags/';
var allTags = "";
var newCase = false;


function evaluateURL(){
  
  var prom = new Promise(
    (resolve,reject) => {
      chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        var url=tabs[0].url;
        var a = url.split("/");    
        var ind = a.indexOf("Case");
        var csid = "NOT_A_CASE";
        if (ind>=0){csid = a[ind+1]; isCase = true
        //console.log(csid);
        return resolve(csid)}
        else return reject("Not a case")
      })
    }
  )
  return prom;

};


//fetch the case tags from the backend for specific case id.
function getCaseTags(caseID){

  var cTags = fetch(apiCaseEndpoint+caseID).then(function (response){

      if(response.ok){
        newCase = false;
        return response.json();
      } else {
        if (response.status == 404){
            //assume the 404 was due to non existent case entry.
            newCase = true; 
            return new Promise((resolve)=>{return resolve({"tags" : []})});
        } else throw new Error("Request unsuccessful")};
    })
    return cTags;

};

function getAllTags(){
  //console.log(caseID);
  var aTags = fetch(apiTagEndpoint).then(function (response){
     
      if(response.ok){
        return response.json();
      } else {throw new Error("Request unsuccessful")};
    })
    return aTags;

};


//getAllTags().then((tags)=>{console.log(tags)}).catch((error)=>{console.log(error)});


 
function updateTags(tagsData, caseID){
  
  isUpdating = true; 

  let dt = tagsData;

  dt.id = caseID;

  let method = "";
  let cid = ""; 
  if (newCase){method = "POST"} else {method = "PUT"; cid = caseID};
  console.log(newCase);
  fetch(apiCaseEndpoint + cid, {
  method: method,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(dt)
}).then(function(response) {
      return response.json()
    }).then(function(json) {
      newCase = false;
      isUpdating = false;
      console.log('parsed json: ', json)
    }).catch(function(ex) {
      isUpdating = false;
      console.log('parsing failed: ', ex)
    });
};


function updateCTags(e){
  
  let data = M.Chips.getInstance(e[0]).chipsData;
  if (data!=undefined){
    ctags.tags = data;
    return data;
  } else {
    throw new Error("Error updating local data store")
  }

};


///hooks:

document.addEventListener('DOMContentLoaded', function() {
    const elems = document.querySelectorAll('.chips');
    const options = {
    autocompleteOptions : { data: {},
                            limit: 5 },
    data: [],
    onChipDelete: function(e, data){
      try {

      updateCTags(e);
      updateTags(ctags,cid);
      }
      catch(e){console.log(e)}
    },
    onChipAdd: function(e, data){
      try {
      updateCTags(e);
      updateTags(ctags,cid);
      }
      catch(e){console.log(e)}
    }
  };

  evaluateURL()
  .then(csid => {cid = csid; return Promise.all([getCaseTags(csid),getAllTags()])})
  .then((results)=>{ctags = results[0]; 
 //   console.log(results[0]);   
    options.data = ctags.tags;
//    console.log(options);
    allTags = results[1];
    options.autocompleteOptions.data = allTags;
    const instances = M.Chips.init(elems, options);
 //   M.Chips.getInstance(elems[0]).onChipDelete = function(){console.log("callback invoked")};

  })
  .catch((error)=>{console.log(error)});


});

