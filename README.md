# syncd
Synchronize directories across CoreOS clusters leveraging etcd

### Launch as a standalone container

```shell
$ git clone https://github.com/imjacobclark/syncd.git && cd syncd
$ docker build -t imjacobclark/syncd .
$ docker run -d \
	--name watch_test \
	-e "ETCD_ENDPOINT=http://<public_ip>:4001/" \
	-e "ETCD_SERVICE_KEY=<service_key>" \
	-e "DIRECTORY_TO_SYNC=<fully_qualified_path>" \
	-e "CURRENT_HOST_IP=<public_ip>" \
	imjacobclark/syncd
```
