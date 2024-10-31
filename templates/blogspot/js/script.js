function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('#category-navigation a');
    const allPostsElement = document.getElementById('all-posts');

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            navLinks.forEach((otherLink) => {
                otherLink.classList.remove('active');
            });
            link.classList.add('active');

            const selectedCategory = link.dataset.category.toLowerCase();
            loadAndFilterPosts(selectedCategory);
        });
    });

    loadAndFilterPosts('blogging');
}

async function loadAndFilterPosts(selectedCategory) {
    try {
        let postsJsonPath = 'assets/posts.json';
        if (window.location.pathname.includes('/blog/')) {
            postsJsonPath = '../assets/posts.json';
        }

        const response = await fetch(postsJsonPath);
        const postsData = await response.json();

        const pinnedPost = postsData.find(post => post.post_type === "pinned");
        const pinnedPostElement = document.getElementById('pinned-post');

        if (pinnedPost) {
            pinnedPostElement.innerHTML = `
            <div class="main-post">
                <p class="post-image"><img src="${pinnedPost.social_image || 'assets/default-image.avif'}" alt="${pinnedPost.title} image" class="main-image"></p>
                <div class="main-top">
                    <div class="post-info">
                        <p class="category">${pinnedPost.category || 'Blogging'}</a></p>
                        <p class="main-post-pub-date">${formatDate(pinnedPost.published)}</p>
                    </div>
                    <h2 class="main-post-heading"><a href="${pinnedPost.file}">${pinnedPost.title}</a></h2>
                    <p class="main-post-subtitle">${pinnedPost.description}</p>
                </div>
  
                <a href="${pinnedPost.file}">
                    <button class="read-btn">
                        Read<i class="ph ph-caret-right"></i>
                    </button>
                </a>
            </div>
        `;
        } else {
            pinnedPostElement.innerHTML = '';
        }

        const otherPosts = postsData.filter(post => post.post_type !== "pinned");
        otherPosts.sort((a, b) => new Date(b.published) - new Date(a.published));

        const allPostsElement = document.getElementById('all-posts');
        allPostsElement.innerHTML = '';

        const filteredPosts = otherPosts.filter(post => {
            if (selectedCategory === 'blogging') {
                return true;
            } else {
                return post.category && post.category.toLowerCase() === selectedCategory;
            }
        });

        if (filteredPosts.length === 0) {
            const noPostsMessage = document.createElement('p');
            noPostsMessage.textContent = "Hmm... Nothing to read in this category right now.";
            noPostsMessage.className = 'normal-post-subtitle';
            allPostsElement.appendChild(noPostsMessage);
        } else {
            filteredPosts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.innerHTML = `
                <div class="normal-post">
                    <p class="post-image"><img src="${post.social_image || 'assets/default-image.avif'}" alt="${post.title} image" class="normal-image"></p>
                    <div class="normal-top">
                        <div class="post-info">
                            <p class="category"><a href="#">${post.category || 'Blogging'}</a></p>
                            <p class="main-post-pub-date">${formatDate(post.published)}</p>
                        </div>
                        <h5 class="normal-post-heading"><a href="${post.file}">${post.title}</a></h5>
                        <p class="normal-post-subtitle">${post.description}</p>
                    </div>
                </div>
            `;
                allPostsElement.appendChild(postElement);
            });
        }

    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('index.html')) {
        setupNavigation();
    }

    window.addEventListener('scroll', function () {
        const progressBar = document.querySelector('.progress-bar');

        if (progressBar) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;

            progressBar.style.width = scrolled + '%';
        }
    });
});