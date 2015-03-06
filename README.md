# syncd
Synchronize directories across CoreOS clusters leveraging etcd

### Launch as a standalone container

```shell
docker run -d \
	--name watch_test \
	-e "ETCD_ENDPOINT=http://blog.jacob.uk.com:4001/" \
	-e "ETCD_SERVICE_KEY=blog-jacob-uk-com" \
	-e "DIRECTORY_TO_SYNC=/home/core/persistence/blog.jacob.uk.com" \
	-e "CURRENT_HOST_IP=178.62.17.230" \
	imjacobclark/syncd
```