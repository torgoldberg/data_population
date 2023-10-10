# data_population
create data on env before testing

Run 'npm i' command from the root folder in order to install all the relevant third-party code packages based on dependencies specified in package.json.
Data to be loaded resides under test-data folder in the respective .json files.  
Run 'npm run [entities type]' command from the root folder in order to run the creation

* When creating api keys, keys and secrets of the created entities will be output into api-key-users.txt file under 'output' folder.

1. For load purposes, set MASSIVE_LOAD in .env to the number of entities you want to create. 
    In this case the first entity in the respective test-data file will be duplicated with the running number (starting from START_INDEX (default setting is 1)) appended to the entity name.
    The default setting is 0 which means that the entities will be created according to the JSONs array as defined in the respective test-data file.

2. To speed up execution time, set VERIFY_CREATION_DELETION in .env to 0. 
    In this case the entities will be [deleted and] created with no verification.
    The default setting is 1 which means that verification will take place.

3. To only delete the entities, set DELETE_ONLY in .env to 1.
    In this case data creation will be skipped.
    The default setting is 0 which means that the data will be re-created unless specified otherwise.
   
Run 'npm run latency' command from the main project directory in order to run the creation
   
Flow description and .env parameters:
The script will trigger parallel jobs based on NUM_USERS.
Each job will run for RUN_TIME_MIN (in minutes) creating sessions (API request /auth/local/1/stage/1) for user USER_BASENAME followed by a running number starting with START_INDEX with password as specified in USER_PASSWORD.
Each iteration will be suspended for a random number of seconds to simulate real use case. 
In the end the process will output the results into output/LatencyReport-[region].csv where region is defined by the REGION parameter. The following information will be output: Region, User, Session, Response success, Response time in sec, Error.

project data:
* package.json file will hold all scripts, to add new sciprts use this file.
* main file is index.js we will run the create command from its location.
* the oreder of export in index.js is important because of dependencies.
* validation scripts will use schema_validation folder.
* creation scripts will use json_data folder.
