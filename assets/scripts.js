/* This code is ugly. You know it and I know it. */

function el(type, html){
  var el = document.createElement(type);
  el.innerHTML = html;
  return el;
}

var Ex = {
  el : {},
  fil : false,
  all : [],
  filters : {},
  select : {},
  parse : function(filter){
    var all = raw.split("\\"), line, repo, tags;
    for(var x = all.length - 1; x >= 0; x--){
      line = all[x].split("*");
      if(line[0] === "") continue;
      this.all.push({
        name: line[0],
        tags: line[1].split(","),
        note: line[2] ? line[2] : null 
      });
    }
  },
  sortRepos : function(){
    this.all.sort(function(a, b){
      if(a.name > b.name) return -1;
      else return 1;
    });
  },
  sortTags : function(){
    var repo;
    for(var r = this.all.length - 1; r >= 0; r--){
      this.all[r].tags.sort();
      this.all[r].tags.reverse();
      tags = this.all[r].tags;
      for(var t = tags.length - 1; t >= 0; t--){
        this.filters[tags[t]] = true;
      }
    }
  },
  shouldFilter: function(repo, filter){
    for(var t = repo.tags.length - 1; t >= 0; t--){
      if(repo.tags[t] === filter) return false;
    }
    return true;
  },
  renderRepos : function(filter){
    var ex, tr, td;
    this.el.innerHTML = "";
    for(var r = this.all.length - 1; r >= 0; r--){
      repo = this.all[r];
      if(filter && filter !== "none" && this.shouldFilter(repo, filter)) continue;
      tr = document.createElement("TR");
      tr.appendChild(el("TD", this.renderRepo(repo)));
      tr.appendChild(el("TD", this.renderNote(repo)));
      tr.appendChild(el("TD", this.renderTags(repo)));
      this.el.appendChild(tr);
    }
    this.listenTags();
  },
  renderFilters : function(){
    this.filters = Object.keys(this.filters);
    this.filters.sort().reverse();
    for(var f = this.filters.length - 1; f >= 0; f--){
      this.select.appendChild(el("OPTION", this.filters[f]));
    }
  },
  renderNote : function(repo){
    return "<p>" + (repo.note ? repo.note : "") + "</p>";
  },
  renderRepo : function(repo){
    return '<a target="_blank" href="http://github.com/ga-dc/' + repo.name + '">' + repo.name + '</a>';
  },
  renderTags : function(repo){
    var output = "";
    for(var t = repo.tags.length - 1; t >= 0; t--){
      var tag = repo.tags[t];
      output += '<a class="tag" href="#">' + tag + "</a>";
    }
    return output;
  },
  listenTags : function(){
    var els = document.querySelectorAll(".tag");
    for(var e = els.length - 1; e >= 0; e--){
      els[e].addEventListener("click", function(){
        Ex.renderRepos(this.innerText);
      });
    }
  },
  listenFilters : function(){
    this.select.addEventListener("change", function(){
      Ex.renderRepos(this.value);
    });
  },
  go : function(){
    Ex.el = document.getElementById("exes");
    Ex.select = document.getElementById("filters"),
    Ex.parse();
    Ex.listenFilters();
    Ex.sortRepos();
    Ex.sortTags();
    Ex.renderFilters();
    Ex.renderRepos();
  }
}

window.onload = Ex.go;
