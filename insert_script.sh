RED=$(tput setaf 1)
NORMAL=$(tput sgr0)
# $1 is the path to presentation main html file
# $2 is the path to the slave's script
printf "$1"
if [ -z "$1" ]
then
    printf "${RED} You should specify the path to your presentation\'s index/html${NORMAL}\n"
else
    slaveDir=assets/js/
    slaveName=slave.js
    # Remove script line if there is one already
    sed '/talkcontrol/d' $1 > tmp && cat tmp > $1 && rm tmp
    # Add script line in file
    awk -v script="<script src=\"./${slaveDir}${slaveName}\" talkcontrol></script>" '/<\/body>/ && c == 0 {c = 1; print script}; {print}' $1 > tmp \
    && cat tmp > $1 && rm tmp
    # Add slave's script to the assets
    mkdir -p ${slaveDir}
    cp $2 $(dirname "$1")/${slaveDir}${slaveName}

fi
