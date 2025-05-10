# Shopify Atom Blog Listing with Filters

A lightweight, reusable Shopify theme **section** that:

- Fetches blog posts via the Shopify **Atom feed**
- Provides **client-side filtering** by blog handle (`All`, `Care`, `Style`, etc.)
- Adds **pagination** (Prev/Next) when more than 16 posts are available
- Includes **staggered fade-in & up** animations for cards
- Fully **responsive** across mobile, tablet, and desktop

---

## Features

- **Zero dependencies**: Vanilla JavaScript & CSS
- **Filter buttons** dynamically generated from blog handles
- **Atom feed parsing** to circumvent JSON endpoint restrictions in preview
- **Client-side pagination**: only shows controls when needed
- **Card animations**: smooth fade-in with staggered delays
- **Fully responsive**: 1, 2, 3, or 4 columns at different breakpoints

---

## 🚀 Installation

1. **Copy** `sections/blog-list.liquid` into your theme’s `sections/` folder.
2. **Open** your theme layout or page template (e.g. `templates/page.blog.liquid`) and add the section:

   ```liquid
   {% section 'blog-list' %}
   ```

3. **Customize** in the Shopify Theme Editor:
   - Add the **Blog Listing** section to your page.
   - Click **Add block**, choose **Blog**, and select which blogs to include.
   - Reorder or add up to 10 blog blocks.

---

## ⚙️ Configuration & Usage

### Block Settings

Each **Blog** block corresponds to one `<blog handle>`. The UI will render one button per block, plus an **All** button.

- **All**: Fetches and merges entries from *all* selected blogs.
- **Individual**: Fetches entries from only that handle.

The grid displays **up to 16** posts per page; pagination appears if more are available.

### Markup Overview

```liquid
<div class="blog-section">
  <!-- Breadcrumbs & Title -->
  <div class="page-title">…</div>

  <!-- Filter Buttons -->
  <div class="blog-filters">
    <button data-blog="all">All</button>
    {% for block in section.blocks %}
      {% assign h = block.settings.blog %}
      {% if blogs[h] %}
        <button data-blog="{{h}}">{{ blogs[h].title }}</button>
      {% endif %}
    {% endfor %}
  </div>

  <!-- Grid & Pagination -->
  <div id="blog-posts-grid"></div>
  <div id="blog-pagination">…</div>
</div>
```

---

## 🎨 Customization

- **Excerpt Length**: In `fetchFeed()`, adjust `slice(0, 400)` to your desired character count.
- **Animation Delay**: In JS, change `idx * 100` (ms) for faster/slower staggers.
- **Cards per Row**: Modify CSS grid breakpoints at the bottom of the `<style>` block.
- **Card Height**: Tweak `.blog-card { min-height: 380px }` for uniform sizing.

---

## 📝 License

Distributed under the [MIT License](LICENSE).

---

## 🙏 Credits

- Built by Plusky IT Solutions LLC
- Inspired by real-world Shopify Atom feed constraints.
