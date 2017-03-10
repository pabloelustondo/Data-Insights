var config = require('../appconfig.json');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var agenda = require('./Agenda');

ManageAgendaService = {
    // ensure job is defined. If not defined, define it
    startAgenda: function (timeInterval) {
        //TODO: Provide a wrapper that allows a user to start agenda/scheduler service

        agenda.on('ready', function () {
           agenda.start();
           agenda.processEvery(timeInterval + ' seconds');
        });
    },

    stopAgenda: function () {
        agenda.stop(function() {
            process.exit(0);
        });
    }

};

module.exports = ManageAgendaService;