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
          console.log("evaluateURL[41]: " + csid);
          return resolve(csid)
        }
        else return reject("Not a case")
      })
    }
  )
  return prom;
};


//fetch the case tags from the backend for specific case id.
/*
function getCaseTags(caseID){
  var getCaseTagsEndPoint = apiTagInstanceEndpoint + caseID + '/tags';
  var cTags = fetch(getCaseTagsEndPoint).then(function (response){
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
*/


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


//getAllTags().then((tags)=>{console.log(tags)}).catch((error)=>{console.log(error)});

function updateTags(tagsData, caseID){
  
  isUpdating = true; 

  let dt = tagsData;

  dt.id = caseID;

  let method = "";
  let cid = ""; 
  if (newCase){method = "POST"} else {method = "PUT"; cid = caseID};
  //console.log(newCase);
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
      //console.log('parsed json: ', json)
    }).catch(function(ex) {
      isUpdating = false;
      //console.log('parsing failed: ', ex)
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

  /*
  evaluateURL()
  .then(csid => {
    cid = csid; 
    return Promise.all([getCaseTags(csid),getAllTags()])})
  .then( (results) => {
      ctags = results[0];
      options.data = ctags.tags;
      allTags = results[1];
      console.log("alltags: "  + allTags);
      options.autocompleteOptions.data = allTags;
      const instances = M.Chips.init(elems, options);
    })
  .catch( (error) => {
    console.log(error)
  });
  */

  

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
      //console.log("ctags: ");
      //console.log(ctags);
      //console.log("allTags: ");
      //console.log(allTags);
      
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
      //console.log("MAterialize");
      //console.log( ctagsMaterialize);
      //console.log("MAterialize");
      //console.log( allTagsMaterialize);
      //End mapping
      
      //options.data = ctags;
      //options.autocompleteOptions.data = allTags;
      options.data = ctagsMaterialize;
      options.autocompleteOptions.data = allTagsMaterialize;
      const instances = M.Chips.init(elems, options);
    })
    .catch( (error) => {
      console.log(error);
    })




   /* 
   evaluateURL()
    .then( (csid) => {
      var caseTagEndPoint = apiTagInstanceEndpoint + csid + "/Tags";     
      fetch(caseTagEndPoint)
        .then(
          (response) => {
            if (response.status !==200) {
              console.log("Error: fetch casetagendpoints: " + response.status);
              return
            }
            response.json().then( (data) => {
              options.data = data;
              console.log(options.data);
              return data;
              
            })
          }
        )
        .catch( (err) => {
          console.log("Fetch error: " + err);
        })
    })
    */
    /**
     * Fin epr
     */

    
});

