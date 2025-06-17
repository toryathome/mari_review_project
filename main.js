import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://noslenasuiaiwwfgzpsv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vc2xlbmFzdWlhaXd3Zmd6cHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMzUzNzksImV4cCI6MjA2NTcxMTM3OX0.PqGebpcklqgvDbgrIIInIfuieXO5FsfHq48ttAijLr4';
const supabase = createClient(supabaseUrl, supabaseKey);

const statusText = document.getElementById('status');

// Sign up
document.getElementById('signup-btn').addEventListener('click', async () => {
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    alert("Signup failed: " + error.message);
  } else {
    alert("Signup successful! Check your email for confirmation.");
  }
  updateStatus();
});

// Log in
document.getElementById('login-btn').addEventListener('click', async () => {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    alert("Login failed: " + error.message);
  } else {
    alert("Login successful!");
  }
  updateStatus();
});

// Log out
document.getElementById('logout-btn').addEventListener('click', async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    alert("Logout failed: " + error.message);
  } else {
    alert("Logged out");
  }
  updateStatus();
});

updateStatus();

const PRODUCTS = [
    { id: 'dragon-toy', name: 'Fire-Breathing Dragon Plush' },
    { id: 'magic-wand', name: 'Sparkling Magic Wand' },
  ];
  
  // Create cards
  function renderProducts(user) {
    const container = document.getElementById('products');
    container.innerHTML = '';
  
    PRODUCTS.forEach((product) => {
      const div = document.createElement('div');
      div.innerHTML = `
        <h3>${product.name}</h3>
        ${user ? `
          <label>Rating:
            <input type="number" min="1" max="5" id="rating-${product.id}">
          </label>
          <input type="text" id="comment-${product.id}" placeholder="Your comment">
          <button onclick="submitReview('${product.id}')">Submit Review</button>
        ` : `<p>Log in to review.</p>`}
        <div id="reviews-${product.id}"><em>Loading reviews...</em></div>
        <hr>
      `;
      container.appendChild(div);
    });
  
    PRODUCTS.forEach((p) => loadReviews(p.id));
  }
  
  // Submit review
  window.submitReview = async function (productId) {
    const { data: { user } } = await supabase.auth.getUser();
    const rating = parseInt(document.getElementById(`rating-${productId}`).value);
    const comment = document.getElementById(`comment-${productId}`).value;
  
    const { error } = await supabase.from('reviews').insert({
        user_id: user.id,
        user_email: user.email,
        product_id: productId,
        rating,
        comment,
      });
  
    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Review submitted!");
      loadReviews(productId);
    }
    document.getElementById(`rating-${productId}`).value = '';
    document.getElementById(`comment-${productId}`).value = '';
  };
  
  // Load reviews
  async function loadReviews(productId) {
    console.log("Fetching reviews for", productId)
    const { data, error } = await supabase
      .from('reviews')
      .select('rating, comment, user_email, product_id')
      .eq('product_id', productId)
      .order('id', { ascending: false });
    console.log("Results for", productId, data);
    const container = document.getElementById(`reviews-${productId}`);
    if (error) {
      container.innerHTML = `<p>Error loading reviews.</p>`;
      return;
    }
  
    if (!data.length) {
      container.innerHTML = `<p>No reviews yet.</p>`;
      return;
    }
  
    container.innerHTML = data.map(r => `
      <div>
        <strong>${r.user_email || 'Anonymous'}</strong>
        — ⭐${r.rating}
        <br>${r.comment}
      </div>
    `).join("<hr>");
  }
  
  // Render products and show current user info
  async function updateStatus() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (user) {
      statusText.textContent = `Logged in as: ${user.email}`;
    } else {
      statusText.textContent = 'Not logged in';
    }
    renderProducts(user); // Include this here always
  }