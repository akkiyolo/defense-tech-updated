/**
 * Article Loader Script
 * Handles dynamic loading of articles from Netlify CMS
 */

class ArticleManager {
    constructor() {
        this.articlesCache = null;
    }

    /**
     * Load all articles metadata
     * @returns {Promise<Array>} Array of article metadata objects
     */
    async getAllArticles() {
        if (this.articlesCache) {
            return this.articlesCache;
        }

        try {
            // In a production environment, this would be a generated JSON index
            // For now, we'll simulate with a fetch to the articles directory
            const response = await fetch('/admin/config.yml');
            const text = await response.text();
            
            // Parse the articles from the directory listing
            // This is a simplified approach - in production you'd have a proper index
            const articles = [];
            
            // For demo purposes, we'll return some placeholder articles
            // In production, this would be replaced with actual article data
            articles.push({
                slug: '2025-05-28-f-22-raptor-the-pinnacle-of-air-superiority',
                title: 'F-22 Raptor: The Pinnacle of Air Superiority',
                date: '2025-05-28',
                category: 'Air Systems',
                tags: ['Fighter Jets', 'Stealth', 'USAF'],
                summary: 'An in-depth look at the F-22 Raptor, its capabilities, and its role in maintaining air superiority.',
                thumbnail: '/assets/images/f22.jpg'
            });
            
            // Add more placeholder articles
            articles.push({
                slug: '2025-05-27-next-generation-naval-defense-systems',
                title: 'Next Generation Naval Defense Systems',
                date: '2025-05-27',
                category: 'Naval Systems',
                tags: ['Navy', 'Missile Defense', 'Radar'],
                summary: 'Exploring the latest developments in naval defense systems and their impact on maritime security.',
                thumbnail: '/assets/images/naval-systems.jpg'
            });
            
            articles.push({
                slug: '2025-05-26-quantum-computing-in-military-applications',
                title: 'Quantum Computing in Military Applications',
                date: '2025-05-26',
                category: 'Space & Cyber',
                tags: ['Quantum', 'Computing', 'Cybersecurity'],
                summary: 'How quantum computing is revolutionizing military technology and cybersecurity.',
                thumbnail: '/assets/images/quantum-computing.jpg'
            });
            
            this.articlesCache = articles;
            return articles;
        } catch (error) {
            console.error('Error loading articles:', error);
            return [];
        }
    }

    /**
     * Get article by slug
     * @param {string} slug - Article slug
     * @returns {Promise<Object|null>} Article metadata or null if not found
     */
    async getArticleBySlug(slug) {
        const articles = await this.getAllArticles();
        return articles.find(article => article.slug === slug) || null;
    }

    /**
     * Get related articles based on category and tags
     * @param {string} currentSlug - Current article slug to exclude
     * @param {string} category - Article category
     * @param {Array} tags - Article tags
     * @param {number} limit - Maximum number of articles to return
     * @returns {Promise<Array>} Array of related article metadata
     */
    async getRelatedArticles(currentSlug, category, tags, limit = 3) {
        const allArticles = await this.getAllArticles();
        
        // Filter out the current article
        const otherArticles = allArticles.filter(article => article.slug !== currentSlug);
        
        // Score articles based on category and tag matches
        const scoredArticles = otherArticles.map(article => {
            let score = 0;
            
            // Category match is worth more
            if (article.category === category) {
                score += 5;
            }
            
            // Each tag match adds to the score
            if (tags && article.tags) {
                const tagMatches = tags.filter(tag => article.tags.includes(tag));
                score += tagMatches.length * 2;
            }
            
            return { ...article, score };
        });
        
        // Sort by score (highest first) and take the top 'limit' articles
        return scoredArticles
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }

    /**
     * Format date for display
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted date string
     */
    formatDate(dateString) {
        if (!dateString) return 'Unknown date';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            return dateString; // Return as-is if parsing fails
        }
    }

    /**
     * Render article card HTML
     * @param {Object} article - Article metadata
     * @returns {string} HTML for article card
     */
    renderArticleCard(article) {
        return `
            <div class="card article-card">
                <div class="card-img">
                    <img src="${article.thumbnail || 'assets/images/placeholder-article.jpg'}" alt="${article.title}">
                </div>
                <div class="card-content">
                    <span class="article-category">${article.category || 'Uncategorized'}</span>
                    <h3 class="card-title">${article.title}</h3>
                    <p class="article-date">${this.formatDate(article.date)}</p>
                    <p>${article.summary || 'No summary available.'}</p>
                    <div class="article-tags">
                        ${(article.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <a href="/article.html?slug=${article.slug}" class="btn">Read More</a>
                </div>
            </div>
        `;
    }

    /**
     * Populate articles listing page
     * @param {string} containerId - ID of container element
     * @param {Object} filters - Filter options (category, tag, etc.)
     * @param {string} sortBy - Sort method (newest, oldest, etc.)
     * @returns {Promise<void>}
     */
    async populateArticlesListing(containerId, filters = {}, sortBy = 'newest') {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        let articles = await this.getAllArticles();
        
        // Apply filters
        if (filters.category && filters.category !== 'all') {
            articles = articles.filter(article => 
                article.category.toLowerCase() === filters.category.toLowerCase());
        }
        
        if (filters.tag && filters.tag !== 'all') {
            articles = articles.filter(article => 
                article.tags && article.tags.some(tag => 
                    tag.toLowerCase() === filters.tag.toLowerCase()));
        }
        
        // Apply sorting
        switch (sortBy) {
            case 'newest':
                articles.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                articles.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'az':
                articles.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'za':
                articles.sort((a, b) => b.title.localeCompare(a.title));
                break;
        }
        
        // Render articles
        if (articles.length === 0) {
            container.innerHTML = '<p class="no-articles">No articles found matching your criteria.</p>';
            return;
        }
        
        container.innerHTML = articles.map(article => this.renderArticleCard(article)).join('');
    }

    /**
     * Load and display a single article
     * @param {string} slug - Article slug
     * @returns {Promise<boolean>} Success status
     */
    async loadArticle(slug) {
        try {
            // Get article metadata
            const article = await this.getArticleBySlug(slug);
            
            if (!article) {
                throw new Error('Article not found');
            }
            
            // Update page title
            document.title = `${article.title} | Defense Technology`;
            
            // Update article metadata in the DOM
            document.getElementById('article-title').textContent = article.title;
            document.getElementById('article-category').textContent = article.category || 'Uncategorized';
            document.getElementById('article-date').textContent = this.formatDate(article.date);
            
            // Update tags
            const tagsContainer = document.getElementById('article-tags');
            tagsContainer.innerHTML = '';
            if (article.tags && Array.isArray(article.tags)) {
                article.tags.forEach(tag => {
                    const tagElement = document.createElement('span');
                    tagElement.className = 'tag';
                    tagElement.textContent = tag;
                    tagsContainer.appendChild(tagElement);
                });
            }
            
            // Update featured image if available
            if (article.thumbnail) {
                const imgElement = document.querySelector('#article-image img');
                imgElement.src = article.thumbnail;
                imgElement.alt = article.title;
            }
            
            // Fetch and render article content
            // In a real implementation, this would fetch the actual markdown file
            // For demo purposes, we'll simulate content
            const articleBody = document.getElementById('article-body');
            
            // Simulate loading delay
            articleBody.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading article...</div>';
            
            // In a real implementation, you would fetch the actual markdown file:
            // const response = await fetch(`/articles/${slug}.md`);
            // const markdown = await response.text();
            // articleBody.innerHTML = marked.parse(markdown);
            
            // For demo purposes, we'll use placeholder content after a short delay
            setTimeout(() => {
                articleBody.innerHTML = `
                    <h2>Introduction</h2>
                    <p>This is a placeholder for the article content. In a real implementation, this would be loaded from the markdown file created by Netlify CMS.</p>
                    
                    <p>The article would contain rich content about ${article.title}, including:</p>
                    
                    <ul>
                        <li>Detailed technical specifications</li>
                        <li>Historical context and development</li>
                        <li>Current deployment and usage</li>
                        <li>Future prospects and developments</li>
                    </ul>
                    
                    <h2>Technical Details</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.</p>
                    
                    <h2>Strategic Importance</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.</p>
                    
                    <h2>Conclusion</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.</p>
                `;
            }, 1000);
            
            // Load related articles
            this.loadRelatedArticles(slug, article.category, article.tags);
            
            // Setup share buttons
            this.setupShareButtons(article.title);
            
            // Load comments if enabled
            if (article.comments !== false) {
                this.loadDisqusComments(slug);
            } else {
                document.getElementById('comments-section').style.display = 'none';
            }
            
            return true;
        } catch (error) {
            console.error('Error loading article:', error);
            document.getElementById('article-body').innerHTML = `
                <div class="error-message">
                    <h2>Article Not Found</h2>
                    <p>Sorry, we couldn't find the article you're looking for.</p>
                    <p><a href="articles.html">Browse all articles</a></p>
                </div>
            `;
            return false;
        }
    }

    /**
     * Load related articles
     * @param {string} slug - Current article slug
     * @param {string} category - Article category
     * @param {Array} tags - Article tags
     * @returns {Promise<void>}
     */
    async loadRelatedArticles(slug, category, tags) {
        const relatedArticles = await this.getRelatedArticles(slug, category, tags, 3);
        const container = document.getElementById('related-articles');
        
        if (!container) return;
        
        if (relatedArticles.length === 0) {
            container.innerHTML = '<p>No related articles found.</p>';
            return;
        }
        
        container.innerHTML = relatedArticles.map(article => this.renderArticleCard(article)).join('');
    }

    /**
     * Setup share buttons
     * @param {string} title - Article title
     */
    setupShareButtons(title) {
        const pageUrl = encodeURIComponent(window.location.href);
        const pageTitle = encodeURIComponent(title || 'Defense Technology Article');
        
        document.getElementById('share-twitter').href = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
        document.getElementById('share-facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
        document.getElementById('share-linkedin').href = `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=${pageTitle}`;
        document.getElementById('share-email').href = `mailto:?subject=${pageTitle}&body=Check out this article: ${pageUrl}`;
    }

    /**
     * Load Disqus comments
     * @param {string} identifier - Article identifier
     */
    loadDisqusComments(identifier) {
        window.disqus_config = function() {
            this.page.url = window.location.href;
            this.page.identifier = identifier;
        };
        
        const d = document, s = d.createElement('script');
        s.src = 'https://defense-tech.disqus.com/embed.js'; // Replace with your Disqus shortname
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
    }
}

// Initialize the article manager
const articleManager = new ArticleManager();

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the article page
    if (window.location.pathname.includes('article.html')) {
        // Get the article slug from the URL query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');
        
        if (slug) {
            articleManager.loadArticle(slug);
        } else {
            // No slug provided, show error
            document.getElementById('article-body').innerHTML = `
                <div class="error-message">
                    <h2>Article Not Found</h2>
                    <p>No article specified. Please select an article from the <a href="articles.html">articles page</a>.</p>
                </div>
            `;
        }
    }
    
    // Check if we're on the articles listing page
    if (window.location.pathname.includes('articles.html')) {
        // Initialize with default filters
        articleManager.populateArticlesListing('articles-container');
        
        // Set up filter event listeners
        const categoryFilter = document.getElementById('category-filter');
        const tagFilter = document.getElementById('tag-filter');
        const sortFilter = document.getElementById('sort-filter');
        
        if (categoryFilter && tagFilter && sortFilter) {
            const applyFilters = () => {
                const filters = {
                    category: categoryFilter.value,
                    tag: tagFilter.value
                };
                
                articleManager.populateArticlesListing('articles-container', filters, sortFilter.value);
            };
            
            categoryFilter.addEventListener('change', applyFilters);
            tagFilter.addEventListener('change', applyFilters);
            sortFilter.addEventListener('change', applyFilters);
        }
    }
    
    // Check if we're on the homepage
    if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
        // Load featured articles on homepage
        articleManager.populateArticlesListing('featured-articles', {}, 'newest');
    }
});
