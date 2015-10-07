#!/bin/bash

echo "Provisioning the VM..."

echo "Installing Ruby dependencies"
sudo apt-get update
sudo apt-get -y install git-core curl zlib1g-dev build-essential libssl-dev libreadline-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev python-software-properties libffi-dev

echo "Installing rbenv and ruby-build"


git clone git://github.com/sstephenson/rbenv.git .rbenv
echo "git clone git://github.com/sstephenson/rbenv.git .rbenv : SUCCESS"
touch ~/.bashrc
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo "export PATH='$HOME/.rbenv/bin:$PATH' >> ~/.bashrc : SUCCESS"
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
echo "'eval "$(rbenv init -)"' >> ~/.bashrc : SUCCESS"
source ~/.bashrc
echo "source ~/.bashrc: SUCCESS"

git clone https://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build
git clone https://github.com/sstephenson/rbenv-gem-rehash.git ~/.rbenv/plugins/rbenv-gem-rehash

sudo -H -u vagrant bash -i -c 'rbenv install 2.2.3'
sudo -H -u vagrant bash -i -c 'rbenv rehash'
sudo -H -u vagrant bash -i -c 'rbenv global 2.2.3'
sudo -H -u vagrant bash -i -c 'gem install bundler --no-ri --no-rdoc'
sudo -H -u vagrant bash -i -c 'rbenv rehash'

echo "Installing rails"
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get -y install nodejs
sudo -H -u vagrant bash -i -c 'gem install rails -v 4.2.4'
sudo -H -u vagrant bash -i -c 'rbenv rehash'

echo "Installing PostgreSQL"
sudo sh -c "echo 'deb http://apt.postgresql.org/pub/repos/apt/ precise-pgdg main' > /etc/apt/sources.list.d/pgdg.list"
wget --quiet -O - http://apt.postgresql.org/pub/repos/apt/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update
sudo apt-get -y install postgresql-common
sudo apt-get -y install postgresql-9.3 libpq-dev

sudo -H -u vagrant bash -i -c 'bundle install --gemfile=/vagrant/Gemfile'