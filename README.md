# pension-scripts

Small collection of script to download pension plan values.

I run these peridocally in a wrapper script and send the options to google drive - 
a google sheet can then read these values for further processing.

## Requirements

* Puppeteer - see https://pptr.dev/
* jq ( for netmeg.sh ) - see https://stedolan.github.io/jq/
* curl ( for nutmeg.sh ) - see https://curl.se/

## Scripts

### aviva.js

Gets an Aviva pension plan value.  Usage :

    AVIVA_USER=myuser AVIVA_PWD=mypassword node aviva.

### moneyfarm.js

Gets a Monefarm pension plan value.  Usage :

    MONEYFARM_USER=myuser MONEYFARM_PWD=mypassword MONEYFARM_TYPE=isa node moneyfarm.js

### nutmeg.js

Gets a Nutmeg pension plan value.  Usage :

    NUTMEG_USER=myuser NUTMEG_PWD=mypassword NUTMEG_NAME="My pension" node nutmeg.js

### nutmeg.sh

Gets a Nutmeg pension plan value via the API.  Usage :

    NUTMEG_USER=myuser NUTMEG_PWD=mypassword NUTMEG_NAME="My pension" ./nutmeg.sh





