'use strict';

const zlib = require('zlib');

module.exports = {
    messageBus: null,
    configuration: null,

    decompress: function (data, callback) {
        zlib.gunzip(data, callback);
    },

    create: function (messageBus, configuration) {
        this.messageBus = messageBus;
        this.configuration = configuration;

        return true;
    },

    receive: function (message) {
        var data = message.content ? Buffer.from(message.content) : [];
        var self = this;
        
        var callback = (err, decompressed) => {
            if (!err) {
                message.content = new Uint8Array(decompressed);
                self.messageBus.publish(message);
            } else {
                throw new Error('Error running gzip decompression for data blob: %s', data);
            }
        };

        self.decompress(data, callback);

    },

    destroy: function () {
        console.log('decompressor.destroy');
    }
};