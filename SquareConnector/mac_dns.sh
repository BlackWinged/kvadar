#!/bin/bash

# Define the addresses you want to add
ADDRESS1="127.0.0.1 example1.com"
ADDRESS2="127.0.0.1 example2.com"

# Define the path to the hosts file
HOSTS_FILE="/etc/hosts"

# Function to add an entry to the hosts file if it doesn't already exist
add_to_hosts() {
    if ! grep -q "$1" "$HOSTS_FILE"; then
        echo "Adding $1 to the hosts file..."
        echo "$1" | sudo tee -a "$HOSTS_FILE" > /dev/null
    else
        echo "$1 already exists in the hosts file."
    fi
}

# Add the addresses
add_to_hosts "$ADDRESS1"
add_to_hosts "$ADDRESS2"

echo "Done."


# make it runnable
# chmod +x add_hosts.sh


# run it
# ./add_hosts.sh