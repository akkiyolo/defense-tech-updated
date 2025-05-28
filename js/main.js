/* Main JavaScript file for Defense Technology Website */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
    }
    
    // Dropdown Menu Toggle for Mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });
    
    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Image Gallery Lightbox
    const galleryItems = document.querySelectorAll('.gallery-item');
    const body = document.body;
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            const caption = this.querySelector('.gallery-caption').textContent;
            
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <img src="${imgSrc}" alt="${caption}">
                    <p>${caption}</p>
                    <button class="lightbox-close">&times;</button>
                </div>
            `;
            
            body.appendChild(lightbox);
            body.style.overflow = 'hidden';
            
            setTimeout(() => {
                lightbox.style.opacity = '1';
            }, 10);
            
            lightbox.querySelector('.lightbox-close').addEventListener('click', function() {
                lightbox.style.opacity = '0';
                setTimeout(() => {
                    body.removeChild(lightbox);
                    body.style.overflow = '';
                }, 300);
            });
        });
    });
    
    // Technology Comparison Tool
    const comparisonForm = document.getElementById('comparison-form');
    
    if (comparisonForm) {
        comparisonForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const category = document.getElementById('category').value;
            const item1 = document.getElementById('item1').value;
            const item2 = document.getElementById('item2').value;
            
            // In a real application, this would fetch data from a database
            // For this demo, we'll use hardcoded data
            updateComparisonTable(category, item1, item2);
        });
    }
    
    // Featured Technology Slider
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slider-item');
    const totalSlides = slides.length;
    const nextBtn = document.querySelector('.slider-next');
    const prevBtn = document.querySelector('.slider-prev');
    
    if (slides.length > 0) {
        // Initialize slider
        updateSlider();
        
        // Auto slide every 5 seconds
        const slideInterval = setInterval(nextSlide, 5000);
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                clearInterval(slideInterval);
                nextSlide();
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                clearInterval(slideInterval);
                prevSlide();
            });
        }
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    }
    
    function updateSlider() {
        slides.forEach((slide, index) => {
            if (index === currentSlide) {
                slide.style.display = 'block';
                setTimeout(() => {
                    slide.style.opacity = '1';
                }, 10);
            } else {
                slide.style.opacity = '0';
                setTimeout(() => {
                    slide.style.display = 'none';
                }, 500);
            }
        });
    }
    
    // Search Functionality
    const searchForm = document.getElementById('search-form');
    const searchResults = document.getElementById('search-results');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const searchTerm = document.getElementById('search-input').value.toLowerCase();
            
            if (searchTerm.length < 2) {
                searchResults.innerHTML = '<p>Please enter at least 2 characters</p>';
                searchResults.style.display = 'block';
                return;
            }
            
            // In a real application, this would search through actual content
            // For this demo, we'll use hardcoded search results
            const results = performSearch(searchTerm);
            
            if (results.length === 0) {
                searchResults.innerHTML = '<p>No results found</p>';
            } else {
                let resultsHTML = '<ul>';
                results.forEach(result => {
                    resultsHTML += `
                        <li>
                            <a href="${result.url}">
                                <h4>${result.title}</h4>
                                <p>${result.excerpt}</p>
                            </a>
                        </li>
                    `;
                });
                resultsHTML += '</ul>';
                searchResults.innerHTML = resultsHTML;
            }
            
            searchResults.style.display = 'block';
        });
        
        // Close search results when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchForm.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }
    
    // Timeline Animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (timelineItems.length > 0) {
        // Check if element is in viewport
        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
        
        // Add animation class when scrolled into view
        function checkTimelineItems() {
            timelineItems.forEach(item => {
                if (isInViewport(item)) {
                    item.classList.add('animate');
                }
            });
        }
        
        // Initial check
        checkTimelineItems();
        
        // Check on scroll
        window.addEventListener('scroll', checkTimelineItems);
    }
});

// Comparison Tool Functions
function updateComparisonTable(category, item1, item2) {
    const comparisonTable = document.getElementById('comparison-table');
    
    if (!comparisonTable) return;
    
    // Sample data - in a real application, this would come from a database
    const data = {
        'tanks': {
            'M1 Abrams': {
                'Weight': '73.6 tons',
                'Main Gun': '120mm smoothbore',
                'Speed': '42 mph',
                'Range': '265 miles',
                'Crew': '4'
            },
            'T-14 Armata': {
                'Weight': '55 tons',
                'Main Gun': '125mm smoothbore',
                'Speed': '50 mph',
                'Range': '310 miles',
                'Crew': '3'
            },
            'Leopard 2': {
                'Weight': '68.7 tons',
                'Main Gun': '120mm smoothbore',
                'Speed': '45 mph',
                'Range': '340 miles',
                'Crew': '4'
            }
        },
        'fighters': {
            'F-35 Lightning II': {
                'Max Speed': 'Mach 1.6',
                'Range': '1,200 miles',
                'Ceiling': '50,000 ft',
                'Armament': 'Various missiles and bombs',
                'Stealth': 'Yes'
            },
            'Su-57': {
                'Max Speed': 'Mach 2',
                'Range': '2,175 miles',
                'Ceiling': '65,000 ft',
                'Armament': 'Various missiles and cannon',
                'Stealth': 'Yes'
            },
            'F-22 Raptor': {
                'Max Speed': 'Mach 2.25',
                'Range': '1,840 miles',
                'Ceiling': '65,000 ft',
                'Armament': 'Various missiles and cannon',
                'Stealth': 'Yes'
            }
        },
        'ships': {
            'Gerald R. Ford Class': {
                'Displacement': '100,000 tons',
                'Length': '1,106 ft',
                'Aircraft': '75+',
                'Propulsion': 'Nuclear',
                'Crew': '4,550'
            },
            'Type 055 Destroyer': {
                'Displacement': '13,000 tons',
                'Length': '590 ft',
                'Weapons': 'Missiles and guns',
                'Propulsion': 'Gas turbine',
                'Crew': '300+'
            },
            'Zumwalt Class': {
                'Displacement': '15,995 tons',
                'Length': '610 ft',
                'Weapons': 'Advanced Gun System, missiles',
                'Propulsion': 'Integrated power system',
                'Crew': '175'
            }
        }
    };
    
    // Check if category exists
    if (!data[category]) {
        comparisonTable.innerHTML = '<tr><td>Category not found</td></tr>';
        return;
    }
    
    // Check if items exist
    if (!data[category][item1] || !data[category][item2]) {
        comparisonTable.innerHTML = '<tr><td>One or more items not found</td></tr>';
        return;
    }
    
    // Build table
    let tableHTML = `
        <tr>
            <th>Specification</th>
            <th>${item1}</th>
            <th>${item2}</th>
        </tr>
    `;
    
    // Get all specs from both items
    const specs = new Set();
    Object.keys(data[category][item1]).forEach(spec => specs.add(spec));
    Object.keys(data[category][item2]).forEach(spec => specs.add(spec));
    
    // Add rows for each spec
    specs.forEach(spec => {
        const value1 = data[category][item1][spec] || 'N/A';
        const value2 = data[category][item2][spec] || 'N/A';
        
        tableHTML += `
            <tr>
                <td>${spec}</td>
                <td>${value1}</td>
                <td>${value2}</td>
            </tr>
        `;
    });
    
    comparisonTable.innerHTML = tableHTML;
}

// Search Function
function performSearch(term) {
    // Sample search data - in a real application, this would search through actual content
    const searchData = [
        {
            title: 'M1 Abrams Main Battle Tank',
            excerpt: 'The M1 Abrams is a third-generation American main battle tank designed by Chrysler Defense and named after General Creighton Abrams.',
            url: 'pages/land.html#abrams'
        },
        {
            title: 'F-35 Lightning II',
            excerpt: 'The F-35 Lightning II is a family of single-seat, single-engine, all-weather stealth multirole fighters.',
            url: 'pages/air.html#f35'
        },
        {
            title: 'Gerald R. Ford Class Aircraft Carrier',
            excerpt: 'The Gerald R. Ford class is a class of nuclear powered aircraft carriers, intended to eventually replace the Nimitz-class carriers.',
            url: 'pages/naval.html#ford'
        },
        {
            title: 'Hypersonic Weapons',
            excerpt: 'Hypersonic weapons travel at speeds of Mach 5 or higher, making them difficult to detect and intercept with current defense systems.',
            url: 'pages/future.html#hypersonic'
        },
        {
            title: 'Military Satellites',
            excerpt: 'Military satellites provide communications, navigation, early warning, and intelligence capabilities to armed forces around the world.',
            url: 'pages/space-cyber.html#satellites'
        }
    ];
    
    // Filter results based on search term
    return searchData.filter(item => {
        return item.title.toLowerCase().includes(term) || 
               item.excerpt.toLowerCase().includes(term);
    });
}
