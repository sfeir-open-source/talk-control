RED=$(tput setaf 1)
BLUE=$(tput setaf 4)
NORMAL=$(tput sgr0)

# npm run build-slave && npm run build-master && npm run build-server
presentationPath=""
while [[ "$presentationPath" != /* ]]; do
    read -p "${BLUE}Absolute path to your presentation: ${NORMAL}" presentationPath
    if [[ "$presentationPath" != /* ]]; then
        printf "${RED}please give an absolute path.${NORMAL}\n"
    fi
done
scriptPath=$(pwd)/dist/client/slave/index.js
./insert_script.sh ${presentationPath} ${scriptPath}
