# Script builds and launches a Vagrant for running the code
# and/or developing in.

# Install Homebrew
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew update
brew doctor
brew tap phinze/homebrew-cask && brew install brew-cask

# Install vagrant
brew cask install vagrant

# Start Vagrant
vagrant up