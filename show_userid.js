// Run this in the browser console to show your user ID
const userData = localStorage.getItem('user');
if (userData) {
  const user = JSON.parse(userData);
  console.log('Your user ID is:', user.customer_id);
  alert('Your user ID is: ' + user.customer_id);
} else {
  console.log('No user data found in localStorage');
  alert('Not logged in! No user data found.');
} 