# Tested on Fedora 37

# Application only takes Tab Separated Value files

# You may use the test file on the flask/server/unittest_file.txt, rename .txt file to .tsv

# Turn off SELinux otherwise containers may have trouble with mounted volumes

sed -i 's/SELINUX\=enforcing/SELINUX\=disabled/' /etc/selinux/config

reboot

# Don't forget to Update system using `dnf update -y` and reboot

# To run build, export the variables below and run setup script, the application will not work if the exported variables are not set

export INPUT_IP=xxx.xxx.xxx.xxx
export DATABASE_PASS='database_password'

./setup.sh

# After script is done start containers with the following

docker-compose up -d

# To stop

docker-compose down

# To view logs

docker-compose logs -f
