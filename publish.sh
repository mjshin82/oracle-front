cd /home/oracle/work/oracle-front
echo '{"lastUpdated":"' | tr -d '\n' > ./src/Data/LastUpdate.json
date "+%Y-%m-%d %H:%M:%S" | tr -d '\n' >> ./src/Data/LastUpdate.json
echo '"}' >> ./src/Data/LastUpdate.json

cd ../oracle
python crawler.py
python oracle.py KS11
python oracle.py KQ11
python oracle.py KS200
cd ../oracle-front
npm run deploy
