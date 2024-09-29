- [ ] Create pages for training, preparing and analyzing
- [ ] Plan how you are going to store your data
- [ ] Add offline data persistance
- [ ] Add offline auth persistance
- [ ] Test launch speeds on mobile
- [ ] Test offline mode on mobile

# Notes
## Database structure:
1. Exercises table, simply a list of available exercises
2. Plans table, Plans that have a plan name, weeks and days with specific exercises
3. Users table that holds current day, week, plan
4. Exercises log table that holds exercise data for each user, each table is a separate exercise type that holds the log
