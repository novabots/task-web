Template.createTimeEntry.onCreated(function () {
    this.showTimeEntryModal = new ReactiveVar("hide");
});

Template.createTimeEntry.events({
    "click .time-entry-btn": function (e, template) {
        template.showTimeEntryModal.set("show");
    }
});

Template.createTimeEntry.helpers({
    showTimeEntryModal: function (what) {
        return what === Template.instance().showTimeEntryModal.get();
    }
});
