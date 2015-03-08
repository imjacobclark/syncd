# syncd
syncd: Synchronize directories across clusters leveraging etcd

syncd is available on the [Docker Hub Registry](https://registry.hub.docker.com/u/imjacobclark/syncd/) as a prebuilt container

[syncd](http://github.com/imjacobclark/syncd) is a simple Node.js app which watches a particular folder you wish to sync cross cluster for change events. When a directory change is detected syncd contacts the etcd HTTP API for details of the nodes your service is running on, syncd expects etcd to be aware of your currently running instances holding a key of the service name and a value of the IP and port. Once syncd has this information it simply transferred static content via [scp](http://en.wikipedia.org/wiki/Secure_copy) to all running nodes.

### Launch as a standalone container

```shell
docker run -d \
    --name watch_test \
    -e "ETCD_ENDPOINT=http://<public_ip>:4001/" \
    -e "ETCD_SERVICE_KEY=<service_key>" \
    -e "DIRECTORY_TO_SYNC=<fully_qualified_path>" \
    -e "CURRENT_HOST_IP=<public_ip>" \
    imjacobclark/syncd
```

### Launch via Fleet

```shell
[Unit]
Description=Sync assets of service_name
After=docker.service
After=etcd.service
BindsTo=service_name@%i.service

[Service]
KillMode=none
EnvironmentFile=/etc/environment
ExecStartPre=-/usr/bin/docker kill syncd%i
ExecStartPre=-/usr/bin/docker rm syncd%i
ExecStartPre=/usr/bin/docker pull imjacobclark/syncd
ExecStart=/usr/bin/docker run -d --name watch_test -e "ETCD_ENDPOINT=http://<public_ip>:4001/" -e "ETCD_SERVICE_KEY=<service_key>" -e "DIRECTORY_TO_SYNC=<fully_qualified_path>" -e "CURENT_HOST_IP=<public_ip>" imjacobclark/syncd
ExecStop=/usr/bin/docker stop syncd
TimeoutStartSec=0
Restart=always
RestartSec=10s

[X-Fleet]
X-ConditionMachineOf=service_name@%i.service
```