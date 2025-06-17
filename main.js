import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://noslenasuiaiwwfgzpsv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vc2xlbmFzdWlhaXd3Zmd6cHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMzUzNzksImV4cCI6MjA2NTcxMTM3OX0.PqGebpcklqgvDbgrIIInIfuieXO5FsfHq48ttAijLr4';
const supabase = createClient(supabaseUrl, supabaseKey);

const status = document.getElementById('status');

const updateStatus = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  status.innerText = user ? `Logged in as ${user.email}` : 'Not logged in';
};

document.getElementById('signup-btn').onclick = async () => {
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) alert(error.message);
  await updateStatus();
};

document.getElementById('login-btn').onclick = async () => {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
  await updateStatus();
};

document.getElementById('submit-review').onclick = async () => {
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) {
    alert("Log in first!");
    return;
  }

  const rating = parseInt(document.getElementById('rating').value);
  const comment = document.getElementById('comment').value;

  const { error } = await supabase.from('reviews').insert({
    user_id: user.id,
    rating,
    comment,
  });

  if (error) {
    alert(error.message);
  } else {
    alert("Review submitted!");
  }
};

updateStatus();