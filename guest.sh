# Guest script which runs inside the Vagrant and sets up
# dependencies / starts the Node.js servers

sudo apt-get update

# Trust Github
ssh-keyscan github.com >> ~/.ssh/known_hosts
sudo apt-get -y install git curl

# Install n and use it install the version of nodejs we want
if [ ! -d "/tmp/n" ]; then
  git clone https://github.com/tj/n.git /tmp/n
fi;
cd /tmp/n; sudo make install
sudo n 0.12.2

# Install bower
echo "Installing bower, may take a few moments...."
sudo npm install -g bower

# Install bower dependencies needed by the client
cd /vagrant/client; bower install

echo "Vagrant ready. Access server at htp://localhost:8080, or SSH in using: `vagrant ssh`"