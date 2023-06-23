#!/bin/sh

cd services/devilbox

# only for windows 
if grep -qi microsoft /proc/version; then
        wt.exe --window 0 new-tab --profile "Ubuntu" --title "Platform" --tabColor "#F00" docker-compose exec -w /shared/httpd/streamlined/app/
else
        gnome-terminal  --tab --title "Plugin" -e "docker-compose exec -w /shared/httpd/query-docs/app/ --user devilbox php bash -l"

fi

