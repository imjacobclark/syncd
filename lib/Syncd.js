var q       = require('q'),
    http    = require('http')
    watch   = require('watch'),
    sys     = require('sys'),
    exec    = require('child_process').exec;

var Syncd = function(){
    this.etcd_endpoint              = process.env.ETCD_ENDPOINT
    this.etcd_services_directory    = (process.env.ETCD_SERVICES_DIRECTORY != null) ? process.env.ETCD_SERVICES_DIRECTORY : "services"
    this.etcd_service_key           = "/v2/keys/" + this.etcd_services_directory + "/" + process.env.ETCD_SERVICE_KEY;
    this.directory_to_sync          = process.env.DIRECTORY_TO_SYNC;
    this.current_host_ip            = process.env.CURRENT_HOST_IP;

    this.init();
}

Syncd.prototype.getServices = function(){
    var deferred = q.defer();

    http.get(this.etcd_endpoint + this.etcd_service_key, function(res) {
        var body = '';

        res.on('data', function(chunk) {
            body += chunk;
        });

        res.on('end', function() {
            deferred.resolve(JSON.parse(body));
        });
    }).on('error', function(e) {
        deferred.reject(e);
    });

    return deferred.promise;
} 

Syncd.prototype.log = function(error, stdout, stderr){
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
}

Syncd.prototype.init = function(){
    _this = this;

    watch.watchTree(this.directory_to_sync, function (f, curr, prev) {
        if (typeof f != "object" && prev !== null && curr !== null) {
            _this.getServices().then(function(data){
                for(var i = 0; i < data.node.nodes.length; i++){
                    var portPos     = data.node.nodes[i].value.indexOf(":");
                    var ip          = data.node.nodes[i].value.substring(0, portPos);

                    if(ip != _this.current_host_ip){
                        exec("scp -r " + this.directory_to_sync + " core@" + ip + ":" + this.directory_to_sync, this.log);
                    }
                }
            });
        }
    })
};
 
module.exports = Syncd;
