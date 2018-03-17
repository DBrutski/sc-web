import Locker from "./Locker";
import Server from "../Core/Server";
const TaskPanel = {
    _container: '#task_panel',
    _text_container: '#task_num',
    _task_num: 0,

    init: function (callback) {
        const dfd = new jQuery.Deferred();

        Server.appendListener(this);
        dfd.resolve();

        return dfd.promise();
    },

    /*!
     * Updates task panel view
     */
    updatePanel: function () {
//        if (this._task_num == 0) {
//            $(this._container).removeClass('active');
//        }else{
//            $(this._container).addClass('active');
//        }
//        var text = ''
//        if (this._task_num > 0)
//            text = this._task_num.toString();
//        $(this._text_container).text(text);
    },

    // ------- Server listener --------
    taskStarted: function () {
        this._task_num++;
        this.updatePanel();
        //Locker.show();
    },

    taskFinished: function () {
        this._task_num--;
        this.updatePanel();
        //Locker.hide();
    }
};
export default TaskPanel
