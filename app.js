(function(){
    window.App = {
        Models: {},
        Views: {},
        Collections: {},
        Router: {}
    }
    function template(id) {
        return _.template($('#'+id).html());
    }

    App.Models.Task = Backbone.Model.extend({
        validate: function(attrs){
            console.log("here");
            if(!attrs.title)
                alert("title cannot be empty!");
        }
    });


    App.Views.Task = Backbone.View.extend({
        tagName : 'li',
        initialize: function() {
            this.model.on("change",this.render,this);
            this.model.on("destroy",this.remove,this);
        },
        render : function() {
            var template = this.template(this.model.toJSON());
            this.$el.html(template);
            return this;
        },

        events: {
            'click .edit' : 'editTask',
            'click .delete' : 'destroyTask'
        },
        editTask : function() {
            var newTask = prompt("Enter the new item!",this.model.get('title'));
            this.model.set('title',newTask,{validate:true});
        },
        showAlert : function() {
            alert(this.model.get('title')+"task was clicked!");
        },
        template : new template("taskTemplate"),
        destroyTask: function() {
            this.model.destroy();
            console.log(tasksCollection);
        },
        remove: function() {
            this.$el.remove();
        }

    });

    App.Views.AddTask = Backbone.View.extend({
        el : "#form",
        events :{
            'submit': 'submit_func'
        },
        submit_func: function(e){
            e.preventDefault();
            var newTask = $(e.currentTarget).find("input[type=text]").val();
            console.log(newTask);
            var task = new App.Models.Task({title: newTask});
            this.collection.add(task);
            console.log(tasksCollection);
        }
    });

    App.Collections.Tasks = Backbone.Collection.extend({

    });

    App.Views.Tasks = Backbone.View.extend({
        tagName : 'ul',
        initialize: function(){
            this.collection.on("add",this.addOne,this);
        },
        render : function() {
            this.collection.each(this.addOne,this);
            return this;
        },
        addOne: function(task) {
            var taskView = new App.Views.Task({model:task});
            this.$el.append(taskView.render().el);
        }
    });


    var tasksCollection = new App.Collections.Tasks([
        {
            title: 'Go to the shop'
        },
        {
            title: 'Go watch cosmos'
        },
        {
            title: 'Go eat'
        }
    ]);

    var tasksView = new App.Views.Tasks({collection: tasksCollection});

    var addTaskView = new App.Views.AddTask({collection: tasksCollection});

    $(document.body).append(tasksView.render().el);

    App.Router = Backbone.Router.extend({
        routes : {
            '' : 'backbone',
            'show/:id' : 'show',
            'download/*filename': 'download',
            'search/:query': 'search'
        },
        backbone: function(){
            console.log("In backbone.html!");
        },
        show: function(id) {
            console.log("In show route!"); //logs when URI is, for eg, backbone.html#show/40
            console.log("The value of id is: "+id); // shows 40
        },
        download: function(filename) {
            console.log("Filename is: "+filename); // shows the filename when URI is for eg, backbone.html#download/abcd.pdf
        },
        search: function(query) {
            console.log("search query is: "+query);
        }
    });

    new App.Router;
    Backbone.history.start();

})();