# Notification System Design

## Stage 1

### How I got the top N notifications
For the priority inbox, we need to show the top N unread notifications based on their type and when they came in. 

Here is my logic for the implementation:
1. I fetch all the notifications from the provided API endpoint.
2. I mapped out the weights for the different types. `Placement` gets a 3, `Result` gets a 2, and `Event` gets a 1. 
3. I used the standard javascript `.sort()` method to sort the array. First it compares the weights, and if the weights are the exact same (like two Results), it checks the Timestamp and puts the newer one first.
4. After everything is sorted, I just use `.slice(0, n)` to grab the top ones.
5. Using `.sort()` is fine here since the number of unread notifications isn't going to be huge. If we start getting millions of notifications, we might need a heap or DB query, but for this challenge it works perfectly and keeps the logic simple to read.

I also wrapped everything with the required logging middleware to track the fetches and errors.
