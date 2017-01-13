'use strict';

const zlib = require('zlib');

module.exports = {
    messageBus: null,
    configuration: null,

    compress: function (data, callback) {
        zlib.gzip(data, callback);
    },

    create: function (messageBus, configuration) {
        this.messageBus = messageBus;
        this.configuration = configuration;

        return true;
    },

    receive: function (message) {
        var data = message.content ? Buffer.from(message.content) : [];
        var self = this;

        var callback = (err, compressed) => {
            if (!err) {
                message.content = new Uint8Array(compressed);
                self.messageBus.publish(message);
            } else {
                throw new Error('Error running gzip compression for data blob: %s', data);
            }
        };

        self.compress(data, callback);
    },

    destroy: function () {
        console.log('compressor.destroy');
    }
};