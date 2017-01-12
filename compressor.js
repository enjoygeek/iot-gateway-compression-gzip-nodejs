'use strict';

const zlib = require('zlib');

module.exports = {
    messageBus: null,
    configuration: null,

    create: function (messageBus, configuration) {
        this.messageBus = messageBus;
        this.configuration = configuration;

        return true;
    },

    receive: function (message) {
        var data = message.content ? Buffer.from(message.content) : [];
        var self = this;
        //console.log(data);
        zlib.gzip(data, function(err, compressed){
            if(!err){ 
                //console.log(compressed);
                message.content = new Uint8Array(compressed);
                self.messageBus.publish(message);
            }else{
                throw new Error('Error running gzip compression for data blob: %s', data);
            }
            
        });
    },

    destroy: function () {
        console.log('compressor.destroy');
    }
};