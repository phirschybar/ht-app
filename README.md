## HackTrack (HT)

...

## Running in Production

Post deployment of app code files, run `npm run build` 

If memory is an issue: 

```
sudo npm cache clean -f
sudo npm install -g n
sudo npm install -g npm@latest
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Database Backups 

Use `/scripts/db_backup.sh` on a cron: 

`crontab -e` 

Add job: 


```
0 2 * * * /var/www/hacktrack/scripts/db_backup.sh >> /var/log/db_backup.log 2>&1
```

Make sure script is executable: 

```
chmod +x /var/www/hacktrack/scripts/db_backup.sh
```