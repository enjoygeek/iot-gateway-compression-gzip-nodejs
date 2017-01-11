# iot-gateway-compression-gzip-nodejs
NodeJS GZip Compression Module for Azure IoT Gateway

Using this mopdule, developers can build Azure IoT Gateway solutions that send compressed mesages to Azure IoT Hub.  This module is designed to read and re-publish messages to the gateway's message broker.

### Installation 

`npm install iot-gateway-compression-gzip-nodejs --save`

### Usage

Add the following module to the `modules` section of your gateway JSON configuration file:

```javascript 
{
    "modules": [
        {
        "name": "compressor",
            "loader": {
                "name": "node",
                "entrypoint": {
                    "main.path": "node_modules//iot-gateway-compression-gzip-nodejs//compressor.js"
                }
            },
            "args": null
        },
        ...
```

Then in the `links` section, patch the module into the message flow:

```javascript 
    ],
    "links": [
        {"source": "{reader_module}", "sink": "compressor"},
        {"source": "compressor", "sink": "{writer_module}"},
        ...
    ]
}
```

### Tests

`npm test`

### License

This project is licensed under the [MIT License](LICENSE).

### Contributing

When contributing to this repository, please create a GitHub issue to discuss the change you would like to make.

Please note we have a [code of conduct](CONTRIBUTING.md), please follow it in all your interactions with the project.

## Release History

* 0.1.2 ReadMe Updates, removed base64 encoding of compressed messages.
* 0.1.1 URL Updates
* 0.1.0 Initial release

## Maintainers

- [@williamberryiii](https://github.com/WilliamBerryiii)