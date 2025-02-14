Secure Web Application Deployment and Monitoring
This project demonstrates the deployment of a secure web application framework. It uses technologies like Nginx, Squid, Suricata, and Firebase for a layered security setup, and includes tools like Burp Suite, Wireshark, and Kali Linux for testing. Follow the steps below to configure and run the application as provided in the project files.

Table of Contents
Project Structure
Prerequisites
Configuration
Linux Server
Windows Backend
Running the Application
Testing and Monitoring
FAQ

Project Structure

C:.
├───backend
│   ├───app.js
│   ├───middleware
│   │   └───auth.js
│   ├───routes
│   │   ├───authRoutes.js
│   │   └───fileRoutes.js
│   └───utils
│       ├───db.js
│       ├───firebase.js
│       └───firebase-config.json
├───database
│   └───user.db
├───files
│   ├───audio
│   ├───images
│   ├───text
│   └───videos
├───Public
│   ├───index.html
│   ├───login.html
│   ├───register.html
│   └───scripts
│       ├───firebaseclient.js
│       ├───login.js
│       └───register.js
└───scripts
    ├───login.js
    └───register.js


Prerequisites
Ensure the following software is installed on your machines:

Linux Server:

Ubuntu 20.04 or later
Nginx
Squid Proxy
Suricata
iptables

Windows Server:

Node.js (v16 or later)
SQLite

Tools:

Wireshark
Burp Suite
Kali Linux (for Nmap and hping3)


Configuration

Linux Server
Firewall Configuration (iptables):

Use the provided iptables rules (iptables.rules) and apply them:

sudo iptables-restore < iptables.rules

Nginx Configuration:

Copy the provided nginx.conf to /etc/nginx/sites-available/default:

sudo cp nginx.conf /etc/nginx/sites-available/default
sudo nginx -s reload

Squid Proxy Setup:

Copy the squid.conf file to /etc/squid/:

sudo cp squid.conf /etc/squid/
sudo systemctl restart squid

Suricata Setup:

Update the suricata.yaml file in /etc/suricata/:

sudo cp suricata.yaml /etc/suricata/
sudo systemctl restart suricata
Add rules for SQL injection and DDoS detection.


Windows Backend
Database Configuration:

The SQLite database (user.db) is pre-configured. Place it in the database folder.
Backend Setup:

Install dependencies for the backend application:

cd backend
npm install

Start the backend server:

node app.js
Firebase Configuration:

Place your Firebase service account key (firebase-config.json) in the backend/utils/ folder.
Ensure Firebase project details are updated in firebase.js.
Frontend Setup:

The HTML files are available in the Public folder. Host them on the Linux server via Nginx.
Running the Application


Start Linux Services:

Start Nginx, Squid, and Suricata:

sudo systemctl start nginx
sudo systemctl start squid
sudo systemctl start suricata

Start Windows Backend:

Run the backend using Node.js:

node app.js

Access the Application:

Open a browser and navigate to the Linux server's IP address.
Testing and Monitoring
Functional Testing
Login and Registration: Test secure user sessions using login.html and register.html.
File Handling: Use files_display.html to upload and manage files.
Vulnerability Testing
SQL Injection (Burp Suite):

Modify login credentials to inject malicious payloads and observe backend responses.
Check Suricata alerts for detected attempts.
DDoS Attack (hping3):

Simulate a DDoS attack from Kali Linux:

sudo hping3 -S -p 80 <Server_IP> --flood
Network Scanning (Nmap):

Scan for open ports:

nmap -sS <Server_IP>


Monitoring Tools

Wireshark:
Analyze network traffic for performance and security validation.

Suricata Logs:
Check alerts in /var/log/suricata/eve.json.



FAQ
How do I reset the database?

Replace user.db in the database folder with a fresh copy.
What if Nginx doesn't start?

Check the configuration file syntax:
sudo nginx -t
Where can I find Suricata logs?

Logs are stored in /var/log/suricata/eve.json.


for configuration codes of Linux machine open Files_Project_Report/Linux Server Configurations and look for word document for code snippet's 