#!/bin/bash
#
# NUTMEG_USER=myuser NUTMEG_PWD=mypassword NUTMEG_NAME="My pension" ./nutmeg.sh
#

jar=/tmp/nutmeg$$

auth=$(curl --silent --request POST --data "{\"email\": \"${NUTMEG_USER}\", \"password\": \"${NUTMEG_PWD}\"}" --cookie ${jar} --cookie-jar ${jar} --header "Content-Type: application/json"  "https://api.nutmeg.com/users/authenticate")
uuid=$(echo ${auth} | jq --raw-output '.uuid')
token=$(echo ${auth} | jq --raw-output '.token')

pots=$(curl --silent --cookie ${jar} --cookie-jar ${jar} --header "AUTH-TOKEN: Bearer ${token}" --header "API-CLIENT: WEB" --header "API-CONSUMER: MOBILE" "https://api.nutmeg.com/customers/${uuid}/pots")

# echo $pots | jq .

for encodedpot in $(echo "${pots}" | jq  --raw-output '.pots[] | @base64')
do
	pot=$(echo ${encodedpot} | base64 --decode)
	if [ "${NUTMEG_NAME}" == "$(echo "${pot}" | jq --raw-output '.name')" ]
	then
		currentValue=$(echo "${pot}" | jq --raw-output '.currentValue')
		pendingValue=$(echo "${pot}" | jq --raw-output '.pendingValue')
		echo "${currentValue}+${pendingValue}" | bc
	fi
done

rm -f ${jar}
