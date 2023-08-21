
sed -i "s/HOST_IP/${INPUT_IP}/g" react/client/src/components/AddTask.js
sed -i "s/HOST_IP/${INPUT_IP}/g" react/client/src/App.js
sed -i "s/HOST_IP/${INPUT_IP}/g" flask/server/main.py
sed -i "s/HOST_IP/${INPUT_IP}/g" react/server.js
sed -i "s/DB_PASS/${DATABASE_PASS}/g" database_setup.sql
sed -i "s/DB_PASS/${DATABASE_PASS}/g" react/server.js
sed -i "s/DB_PASS/${DATABASE_PASS}/g" flask/server/main.py

nmcli con up ens160

dnf install docker docker-compose mariadb-server python3-pip -y

pip3 install numpy scipy matplotlib pandas werkzeug flask flask_debug wget


systemctl enable mariadb
systemctl start mariadb

mysql -u root -e "DELETE FROM mysql.global_priv WHERE User=''"
mysql -u root -e "DELETE FROM mysql.global_priv WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1')"
mysql -u root -e "DROP DATABASE IF EXISTS test"
mysql -u root -e "DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%'"
mysql -u root -e "FLUSH PRIVILEGES"

mysql -sfu root < "database_setup.sql"
mysql -u root -e "UPDATE mysql.user SET Password=PASSWORD('$DATABASE_PASS') WHERE User='root'"
mysql -u root -e "FLUSH PRIVILEGES"

cd react

docker build -t react-app .

cd ../flask/

docker build -t flask-app .

cd ..

python3 flask/server/unit_test.py
