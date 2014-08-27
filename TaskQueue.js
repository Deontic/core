/* jshint esnext: true */

export default function TaskQueue() {

    var tasks = [];

    this.add = function add(task) {
        if (tasks.push(task) === 1) this.cue();
    };

    this.cue = function cue() {
        this.flush();
    };

    this.flush = function flush() {
        var i = 0;
        while (i < tasks.length) {
            tasks[i].run();

        }
    };



    this.flush = function flush() {
        try {
            while (head.next) {
                head = head.next;
                head.run();
            }
        }
    };

}
