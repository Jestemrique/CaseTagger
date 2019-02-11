//globals
/* Old globals.
var cid = "";
var ctags = "";
var cData = "";
var isUpdating = false;
var backendIP = "10.27.73.135"
const apiCaseEndpoint = 'http://' + backendIP + ':3000/data/';
const apiTagEndpoint = 'http://' +backendIP +':3000/tags/';
var allTags = "";
var newCase = false;
*/

/**
 * new Globals
 */
var cid = "";
var ctags = "";
var cData = "";
var isUpdating = false;
var backendIP = "localhost"
const apiCaseEndpoint = 'http://' + backendIP + ':3000/api/';
const apiTagEndpoint = 'http://' +backendIP +':3000/api/tags/';
const apiTagInstanceEndpoint = 'http://' +backendIP +':3000/api/TagInstances/';
var allTags = "";
var newCase = false;
//End new config options.

function evaluateURL(){
  var prom = new Promise(
    (resolve,reject) => {
      chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        var url=tabs[0].url;
        var a = url.split("/");    
        var ind = a.indexOf("Case");
        var csid = "NOT_A_CASE";
        if (ind>=0){
          csid = a[ind+1]; 
          isCase = true
          return resolve(csid)
        }
        else return reject("Not a case")
      })
    }
  )
  return prom;
};


function getAllTags(){
  var aTags = fetch(apiTagEndpoint)
                .then( (response) => {
                                      if(response.ok){
                                      return response.json();
                                      } 
                                      else {
                                        throw new Error("Request unsuccessful")
                                      };
    })
    return aTags;
};


function updateTags(tagsData, caseID){
  
  isUpdating = true; 
  let dt = tagsData;
  dt.id = caseID;
  let method = "";
  let cid = ""; 

  if (newCase){method = "POST"} else {method = "PUT"; cid = caseID};
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
      
    }).catch(function(ex) {
      isUpdating = false;
      
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


function getCaseTags(caseID){
  var getCaseTagsEndPoint = apiTagInstanceEndpoint + caseID + '/tags';
  var cTags = fetch(getCaseTagsEndPoint)
    .then( (response) => {
                          if(response.ok){
                            newCase = false;
                            return response.json();
                          }
                          else {
                                if (response.status == 404) {
                                  //assume the 404 was due to non existent case entry.
                                  newCase = true; 
                                  return new Promise((resolve)=>{return resolve({"tags" : []})});
                                } 
                                else 
                                  throw new Error("Request unsuccessful")};
    })
    return cTags;
};




///hooks:

document.addEventListener('DOMContentLoaded', function() {
    
    const elems = document.querySelectorAll('.chips');
    const options = {
                      autocompleteOptions : { 
                                              data: {},
                                              limit: 5 
                                            },
                      data: [],
                      onChipDelete: (e, data) => {
                                                  try {
                                                    updateCTags(e);
                                                    updateTags(ctags,cid);
                                                  }
                                                  catch(e){
                                                    console.log(e)
                                                    }
                       },
                       onChipAdd: (e, data) => {
                                                try {
                                                  updateCTags(e);
                                                  updateTags(ctags,cid);
                                                }
                                                catch(e){console.log(e)}
                                              }
                     };//End options.


  /**
   * epr
   */
  evaluateURL().
    then( (csid) => {
      return Promise.all([getCaseTags(csid), getAllTags()])
    })
    .then( (results) => {
      ctags = results[0];
      allTags = results[1];
      
      //Map to Materialize ctags.
      let ctagsMaterialize = ctags.map( (item) => {
        const container = {};
        container.tag = item.name;
        return container;
      })

      //Map to Materialize alltags.
      let allTagsMaterialize = allTags.map( (item) => {
        const container = {};
        container.tag = item.name;
        return container;
      })
      //End mapping
      
      options.data = ctagsMaterialize;
      options.autocompleteOptions.data = allTagsMaterialize;
      const instances = M.Chips.init(elems, options);
    })
    .catch( (error) => {
      console.log(error);
    })
});

