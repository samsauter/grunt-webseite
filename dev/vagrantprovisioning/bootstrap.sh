#!/usr/bin/env bash


## Apache - Vhosts
####################################################
sudo cp /project/dev/vagrantprovisioning/vhosts/* /etc/apache2/sites-enabled/
sudo rm /etc/apache2/sites-enabled/000-default.conf

## Apache - Restart
####################################################
sudo /etc/init.d/apache2 restart
