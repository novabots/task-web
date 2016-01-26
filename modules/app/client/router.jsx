
import App from './app';

FlowRouter.route('/', {
    action() {
        ReactLayout.render(App, {

        });
    }
});

FlowRouter.route('/api', {

});
