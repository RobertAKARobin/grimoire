function Grimoire(){
  var self = this;
  var el = {};
  var all = [];

  var render = {
    el : function(type, html){
      var el = document.createElement(type);
      el.innerHTML = html;
      return el;
    },
    repos : function(){
      var ex, tr, td;
      el.innerHTML = "";
      all.sort(function(a, b){
        if(a.name > b.name) return -1;
        else return 1;
      });
      for(var r = all.length - 1; r >= 0; r--){
        repo = all[r];
        tr = document.createElement("TR");
        tr.appendChild(render.el("TD", repo.render.name()));
        tr.appendChild(render.el("TD", repo.render.desc()));
        tr.appendChild(render.el("TD", repo.render.tags()));
        el.appendChild(tr);
      }
    }
  }

  function Repo(name, desc, tags){
    var repo = this;
    this.name = name;
    this.desc = desc;
    this.tags = tags;
    this.render = {
      desc : function(){
        return "<p>" + (repo.desc ? repo.desc : "") + "</p>";
      },
      name : function(){
        return '<a target="_blank" href="http://github.com/ga-dc/' + repo.name + '">' + repo.name + '</a>';
      },
      tags : function(){
        if(!repo.tags) return "";
        var output = "";
        repo.tags.sort();
        repo.tags.reverse();
        for(var t = repo.tags.length - 1; t >= 0; t--){
          output += '<a>' + repo.tags[t] + '</a>';
        }
        return output;
      }
    }
  }

  this.init = function(){
    el = document.getElementById("exes");
    api().load();
  }

  var api = function(){
    var pageNum = 1,
        perPage = 100;

    function url(){
      return "https://api.github.com/orgs/ga-dc/repos?per_page=" + perPage + "&page=" + pageNum;
    }

    function parse(raw){
      var repo, r, tags, tagMatcher = new RegExp(/\[[^\]]*\]/);
      for(r = raw.length - 1; r >= 0; r--){
        repo = raw[r];
        tags = [];
        if(repo.description){
          tags = repo.description.match(tagMatcher);
          repo.description = repo.description.replace(tagMatcher, "");
          if(tags) tags = tags[0].toLowerCase().replace(/[\[\]]/g, "").split(/,[ ]*/);
        }
        all.push(new Repo(repo.name, repo.description, tags));
      }
    }

    this.load = function(){
      var request = new XMLHttpRequest();
      request.open('GET', url(), true);
      request.onload = function(){
        parse(JSON.parse(request.responseText));
        if(request.getResponseHeader("link")){
          pageNum++;
          api.load();
        }else{
          render.repos();
        }
      }
      request.send();
    }
    return this;
  }

}

window.onload = new Grimoire().init;
