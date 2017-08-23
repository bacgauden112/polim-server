import {ProcessManager} from "./background/ProcessManager";
import {EventManager} from "../domains/System/EventProcess/EventManager";
/**
 * Created by Piggat on 8/1/2017.
 */
let pm = new ProcessManager();
pm.onExit = function() {
    process.exit();
};

//to enable zero-down-time reload, we need to prcess SIGNIT event of this process
process.on('SIGINT', function() {
    EventManager._canRun = false; //disable event manager process running
    pm.shutdownAll();
    //then we wait for all process to shutdown successful
});

EventManager.getInstance().run().then(()=> {
    console.info('Event manager is stopped')
});