'use strict';
(function (module) {
  try {
    module = angular.module('awelzijn.downloadfileservice');
  } catch (e) {
    module = angular.module('awelzijn.downloadfileservice', []);
  }
  module.factory('aWelzijnDownloadFileService', ['$http', 'aWelzijnNotificationService', function ($http, notificationService) {

        function _downloadBestand(requestUrl, options, naam, callback) {

            var httpConfig = { method: "GET", url: requestUrl, responseType: 'arraybuffer' };
            if (options.params) httpConfig.params = options.params;
            
            $http.get(requestUrl, httpConfig).success(function (data, status, headers, config, statusText) {

                var octetStreamMime = 'application/octet-stream';
                var success = false;

                headers = headers();
                var filename = headers['x-filename'] || naam;
                var contentType = headers['content-type'] || octetStreamMime;

                try {
                    console.log("saveBlob methode proberen...");
                    var blob = new Blob([data], { type: contentType });
                    if (navigator.msSaveBlob)
                        navigator.msSaveBlob(blob, filename);
                    else {
                        var saveBlob = navigator.webkitSaveBlob || navigator.mozSaveBlob || navigator.saveBlob;
                        if (saveBlob === undefined) throw "Not supported";
                        saveBlob(blob, filename);
                    }
                    success = true;
                } catch (ex) {
                    console.log(ex);
                }

                if (!success) {
                    var urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
                    if (urlCreator) {
                        var link = document.createElement('a');
                        if ('download' in link) {
                            try {
                                console.log("download-link methode met gesimuleerde click proberen...");
                                var blob = new Blob([data], { type: contentType });
                                var url = urlCreator.createObjectURL(blob);

                                link.setAttribute('href', url);
                                link.setAttribute("download", filename);

                                var event = document.createEvent('MouseEvents');
                                event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
                                link.dispatchEvent(event);
                                success = true;
                            } catch (ex) {
                                console.log(ex);
                            }
                        }

                        if (!success) {
                            try {
                                console.log("download-link methode met window.location proberen...");
                                var blob = new Blob([data], { type: octetStreamMime });
                                var url = urlCreator.createObjectURL(blob);
                                window.location = url;
                                success = true;
                            } catch (ex) {
                                console.log(ex);
                            }
                        }
                    }
                }

                if (!success) {
                    notificationService.addError("Het bestand kon niet worden gedownload {" + filename + "}.");
                }

                if (callback) {
                    callback();
                }
            })
            .error(function (data, status, headers, config, statusText) {
                notificationService.createErrorMessages(data, status, requestUrl);
            });
        };

        return {
            downloadBestand: _downloadBestand
        };
  }]);
})();;
