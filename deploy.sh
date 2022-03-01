cd /data/wwwroot/staging.domain-name.com
wget https://global-acc-bj.oss-cn-beijing.aliyuncs.com/project-name_admin/dist.tar.gz
rm -rf ./bak
mkdir ./bak
mv web-admin bak
tar -xvf dist.tar.gz
mv dist web-admin
rm -rf dist.tar.gz
cd ~
