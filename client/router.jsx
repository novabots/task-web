FlowRouter.route('/', {
    action: function(){
        if (Meteor.user()) {
            ReactLayout.render(MainLayout, {
                content: <MainLayout />
            });
        } else {
            ReactLayout.render(Auth, {
                content: <Auth />
            });
        }
    }
});
FlowRouter.route('/api', {
    action: function () {
        BlazeLayout.render("apiLayout");
    }
});
