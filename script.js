document.addEventListener('DOMContentLoaded', () => {
    const grid       = document.getElementById('blog-posts-grid');
    const pagination = document.getElementById('blog-pagination');
    const prevBtn    = document.getElementById('prevPage');
    const nextBtn    = document.getElementById('nextPage');
    const buttons    = Array.from(document.querySelectorAll('.blog-filter-button'));
    const handles    = buttons.map(b => b.dataset.blog).filter(h => h !== 'all');
    const PER_PAGE   = 16;
  
    let currentBlog  = 'all';
    let currentPage  = 1;
    let allEntries   = [];
  
    async function fetchFeed(handle) {
      const res  = await fetch(`/blogs/${handle}.atom`, { credentials: 'same-origin' });
      const text = await res.text();
      const xml  = new DOMParser().parseFromString(text, 'application/xml');
  
      return Array.from(xml.querySelectorAll('entry')).map(entry => {
        const title = entry.querySelector('title')?.textContent || '';
        const link  = entry.querySelector('link[rel="alternate"]')?.getAttribute('href') 
                    || entry.querySelector('link')?.getAttribute('href') 
                    || '#';
        let content = entry.querySelector('content')?.textContent
                    || entry.querySelector('summary')?.textContent
                    || '';
        content = content.replace(/<[^>]+>/g, '').slice(0, 400) + '…';
        return { title, link, content };
      });
    }
  
    async function loadPosts() {
      // show loading
      grid.innerHTML = '<p>Loading posts…</p>';
      pagination.style.display = 'none';
  
      try {
        // on first page or when blog changes, (re)fetch
        if (currentPage === 1) {
          if (currentBlog === 'all') {
            const batches = await Promise.all(handles.map(fetchFeed));
            allEntries = batches.flat();
          } else {
            allEntries = await fetchFeed(currentBlog);
          }
        }
  
        // nothing found?
        if (!allEntries.length) {
          grid.innerHTML = '<p>No posts found.</p>';
          return;
        }
  
        // calculate pages
        const totalPages = Math.ceil(allEntries.length / PER_PAGE);
  
        // render only this page’s items
        const start = (currentPage - 1) * PER_PAGE;
        const pageItems = allEntries.slice(start, start + PER_PAGE);
  
        grid.innerHTML = '';
        pageItems.forEach((item, idx) => {
          const { title, link, content } = item;
          const card = document.createElement('article');
          card.className = 'blog-card';
        
          // staggered delay: 0ms, 100ms, 200ms, …
          card.style.setProperty('animation-delay', `${idx * 200}ms`);
        
          card.innerHTML = `
            <div class="blog-card-content">
              <h3><a href="${link}" class="blog-card-title">${title}</a></h3>
              <p class="blog-card-textContent">${content}</p>
              <a href="${link}" class="read-more-btn">Read More</a>
            </div>`;
          grid.appendChild(card);
        });
  
        // only show pagination if >1 page
        if (totalPages > 1) {
          pagination.style.display = 'flex';
          prevBtn.disabled = currentPage === 1;
          nextBtn.disabled = currentPage === totalPages;
        }
  
      } catch (err) {
        console.error('Feed error:', err);
        grid.innerHTML = '<p style="color:red;">Failed to load posts.</p>';
      }
    }
  
    // filter buttons
    buttons.forEach(btn =>
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.toggle('active', b === btn));
        currentBlog = btn.dataset.blog;
        currentPage = 1;
        allEntries  = [];
        loadPosts();
      })
    );
  
    // pagination buttons
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) currentPage--, loadPosts();
    });
    nextBtn.addEventListener('click', () => {
      currentPage++, loadPosts();
    });
  
    // kick it off with “All”
    buttons.find(b => b.dataset.blog === 'all').click();
  });