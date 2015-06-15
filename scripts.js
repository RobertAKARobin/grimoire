/* This code is ugly. You know it and I know it. */


var Ex = {
  el : {},
  fil : false,
  all : [],
  filters : {},
  select : {},
  pageNum : 1,
  makeEl : function(type, html){
    var el = document.createElement(type);
    el.innerHTML = html;
    return el;
  },
  get : function(){
    var request = new XMLHttpRequest();
    request.open('GET', "https://api.github.com/orgs/ga-dc/repos?per_page=100&page=" + Ex.pageNum, true);
    request.onload = function(){
      Ex.parse(JSON.parse(request.responseText));
      if(request.getResponseHeader("link")){
        Ex.pageNum++;
        Ex.get();
      }else{
        Ex.render();
      }
    }
    request.send();
  },
  parse: function(raw){
    for(var r = raw.length - 1; r >= 0; r--){
      var repo = raw[r];
      this.all.push({
        name: repo.name,
        desc: repo.description
      });
    }
  },
  sortRepos : function(){
    this.all.sort(function(a, b){
      if(a.name > b.name) return -1;
      else return 1;
    });
  },
  renderRepos : function(filter){
    var ex, tr, td;
    this.el.innerHTML = "";
    for(var r = this.all.length - 1; r >= 0; r--){
      repo = this.all[r];
      tr = document.createElement("TR");
      tr.appendChild(this.makeEl("TD", this.renderRepo(repo)));
      tr.appendChild(this.makeEl("TD", this.renderDesc(repo)));
      this.el.appendChild(tr);
    }
  },
  renderDesc : function(repo){
    return "<p>" + (repo.desc ? repo.desc : "") + "</p>";
  },
  renderRepo : function(repo){
    return '<a target="_blank" href="http://github.com/ga-dc/' + repo.name + '">' + repo.name + '</a>';
  },
  fetch : function(){
    Ex.el = document.getElementById("exes");
    Ex.select = document.getElementById("filters"),
    Ex.get();
  },
  render : function(){
    Ex.sortRepos();
    Ex.renderRepos();
  }
}

window.onload = Ex.fetch;
