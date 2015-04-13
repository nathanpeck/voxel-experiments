# Guest script which runs inside the Vagrant and sets up
# dependencies / starts the Node.js servers

sudo apt-get update
sudo apt-get -y install git curl nginx

# Configure nginx to server the client and server
sudo rm -rf /etc/nginx/sites-available/*
sudo rm -rf /etc/nginx/sites-enabled/*
sudo cp /vagrant/conf/nginx/client /etc/nginx/sites-available/client
sudo cp /vagrant/conf/nginx/server /etc/nginx/sites-available/server
sudo ln -s /etc/nginx/sites-available/client /etc/nginx/sites-enabled/client
sudo ln -s /etc/nginx/sites-available/server /etc/nginx/sites-enabled/server
sudo service nginx reload

# Trust Github
ssh-keyscan github.com >> ~/.ssh/known_hosts

# Install n and use it install the version of nodejs we want
if [ ! -d "/tmp/n" ]; then
  git clone https://github.com/tj/n.git /tmp/n
fi;
cd /tmp/n; sudo make install
sudo n 0.12.2

# Install bower
echo "Installing bower via npm, may take a few moments...."
sudo npm install -g beefy browserify