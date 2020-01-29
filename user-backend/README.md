# YACS User Backend
## Description
The backend API for the user management system of YACS Project.

## Getting Started

### Step 0 : Make sure you have docker installed

### Step 1 : clone the repo
```bash
git clone https://github.com/YACS-RCOS/yacs-user-backend
cd yacs-user-backend
cp config.py.example config.py
vim config.py # Modify the database connection
```

### Step 2 : edit the config file to setup auth for the DB



### Docker
```bash
git clone https://github.com/YACS-RCOS/yacs-user-backend
cd yacs-user-backend
cp config.py.example config.py
vim config.py # Modify the database connection
docker build -t userbackend .
docker run -d --name userbackend -p 5674:80 userbackend
```

### Development
```bash
git clone https://github.com/YACS-RCOS/yacs-user-backend
cd yacs-user-backend
pip3 install -r requirements.txt
cp config.py.example config.py
vim config.py # Modify the database connection
python3 app.py
```


docker cp init.sql user_psql:/home

docker exec -ti -u root user_psql sh

psql -U root -d yacs -a -f init.sql