
// Global variables
const fileInput = document.getElementById('fileInput');
const uploadArea = document.querySelector('.upload-area');
const controlsSection = document.getElementById('controlsSection');
const previewSection = document.getElementById('previewSection');
const sizesGrid = document.getElementById('sizesGrid');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const statsBar = document.getElementById('statsBar');

let originalFile = null;
let generatedAssets = [];
let selectedAssets = new Set();
let currentFilter = 'all';

// Complete Asset definitions
const allAssetSizes = [
    {
        name: 'iOS App Icon',
        filename: 'ios-app-icon-1024x1024.png',
        width: 1024,
        height: 1024,
        description: 'Required for App Store submission',
        usage: 'iOS app icon, App Store listing',
        platform: 'ios',
        category: 'app',
        icon: '📱'
    },
    {
        name: 'iOS App Icon (512px)',
        filename: 'ios-app-icon-512x512.png',
        width: 512,
        height: 512,
        description: 'Alternative iOS app icon size',
        usage: 'iOS app icon backup',
        platform: 'ios',
        category: 'app',
        icon: '📱'
    },
    {
        name: 'Android Adaptive Icon',
        filename: 'android-adaptive-icon-432x432.png',
        width: 432,
        height: 432,
        description: 'Foreground image for adaptive icons',
        usage: 'Android app icon foreground',
        platform: 'android',
        category: 'app',
        icon: '🤖'
    },
    {
        name: 'Android Chrome Icon',
        filename: 'android-chrome-192x192.png',
        width: 192,
        height: 192,
        description: 'Android Chrome browser icon',
        usage: 'Android browser bookmark, PWA',
        platform: 'android',
        category: 'web',
        icon: '🤖'
    },
    {
        name: 'Android Chrome Icon XL',
        filename: 'android-chrome-512x512.png',
        width: 512,
        height: 512,
        description: 'Large Android Chrome icon',
        usage: 'Android PWA splash screen',
        platform: 'android',
        category: 'web',
        icon: '🤖'
    },
    {
        name: 'Web Favicon (32px)',
        filename: 'favicon-32x32.png',
        width: 32,
        height: 32,
        description: 'Standard web favicon',
        usage: 'Browser tab icon',
        platform: 'web',
        category: 'favicon',
        icon: '🌐'
    },
    {
        name: 'Web Favicon (16px)',
        filename: 'favicon-16x16.png',
        width: 16,
        height: 16,
        description: 'Small web favicon',
        usage: 'Browser tab icon (small displays)',
        platform: 'web',
        category: 'favicon',
        icon: '🌐'
    },
    {
        name: 'Apple Touch Icon',
        filename: 'apple-touch-icon.png',
        width: 180,
        height: 180,
        description: 'iOS Safari bookmark icon',
        usage: 'iOS Safari bookmarks, home screen',
        platform: 'web',
        category: 'favicon',
        icon: '🍎'
    },
    {
        name: 'Web App Manifest Icon',
        filename: 'web-app-manifest-512x512.png',
        width: 512,
        height: 512,
        description: 'PWA manifest icon',
        usage: 'Progressive Web App icon',
        platform: 'web',
        category: 'favicon',
        icon: '🌐'
    },
    {
        name: 'Splash Screen Icon',
        filename: 'splash-icon-400x400.png',
        width: 400,
        height: 400,
        description: 'High-quality splash screen display',
        usage: 'App splash screen, loading screen',
        platform: 'universal',
        category: 'app',
        icon: '🚀'
    },
    {
        name: 'Favicon ICO (32px)',
        filename: 'favicon.ico',
        width: 32,
        height: 32,
        description: 'Traditional ICO format favicon',
        usage: 'Legacy browser support',
        platform: 'favicon',
        category: 'favicon',
        icon: '🎯',
        format: 'ico'
    }
];

// Initialize event listeners
function initializeEventListeners() {
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    document.querySelectorAll('.platform-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.platform-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.platform;
            filterAssets(currentFilter);
        });
    });
}

function filterAssets(platform) {
    const cards = document.querySelectorAll('.size-card');

    cards.forEach(card => {
        const cardPlatform = card.dataset.platform;
        const cardCategory = card.dataset.category;

        let shouldShow = false;

        if (platform === 'all') {
            shouldShow = true;
        } else if (platform === 'favicon') {
            shouldShow = cardCategory === 'favicon';
        } else {
            shouldShow = cardPlatform === platform;
        }

        if (shouldShow) {
            card.classList.add('visible');
        } else {
            card.classList.remove('visible');
        }
    });

    updateStats();
}

function updateStats() {
    const selectedCount = document.querySelectorAll('.size-card.visible.selected').length;
    const visibleCount = document.querySelectorAll('.size-card.visible').length;

    document.getElementById('selectedCount').textContent = selectedCount;
    document.getElementById('visibleCount').textContent = visibleCount;
    
    // Update Select All button state
    updateSelectAllButton(selectedCount, visibleCount);
}

function updateSelectAllButton(selectedCount, visibleCount) {
    const toggleSelectBtn = document.getElementById('toggleSelectBtn');
    if (toggleSelectBtn) {
        if (selectedCount === visibleCount && visibleCount > 0) {
            // All visible items are selected - show deselect state
            toggleSelectBtn.classList.add('active');
            toggleSelectBtn.innerHTML = '❌ Deselect All';
        } else {
            // Not all items are selected - show select state
            toggleSelectBtn.classList.remove('active');
            toggleSelectBtn.innerHTML = '✅ Select All';
        }
    }
}

function toggleSelectAll() {
    const selectedCount = document.querySelectorAll('.size-card.visible.selected').length;
    const visibleCount = document.querySelectorAll('.size-card.visible').length;
    
    if (selectedCount === visibleCount && visibleCount > 0) {
        // All are selected, so deselect all
        deselectAllVisible();
    } else {
        // Not all are selected, so select all
        selectAllVisible();
    }
}

function selectAllVisible() {
    document.querySelectorAll('.size-card.visible').forEach(card => {
        card.classList.add('selected');
        const filename = card.dataset.filename;
        selectedAssets.add(filename);
    });
    updateStats();
}

function deselectAllVisible() {
    document.querySelectorAll('.size-card.visible').forEach(card => {
        card.classList.remove('selected');
        const filename = card.dataset.filename;
        selectedAssets.delete(filename);
    });
    updateStats();
}

function toggleAssetSelection(filename, card) {
    if (selectedAssets.has(filename)) {
        selectedAssets.delete(filename);
        card.classList.remove('selected');
    } else {
        selectedAssets.add(filename);
        card.classList.add('selected');
    }
    updateStats();
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        showError('Please select an image file (PNG, JPG, SVG)');
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        showError('File size too large. Please select a file smaller than 10MB.');
        return;
    }

    originalFile = file;
    loading.style.display = 'block';
    generateAllAssets();
}

function generateAllAssets() {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            let completed = 0;
            generatedAssets = [];
            sizesGrid.innerHTML = '';

            selectedAssets.clear();
            allAssetSizes.forEach(asset => {
                selectedAssets.add(asset.filename);
            });

            allAssetSizes.forEach(size => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = size.width;
                canvas.height = size.height;
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const aspectRatio = img.width / img.height;
                let drawWidth = size.width;
                let drawHeight = size.height;
                let offsetX = 0;
                let offsetY = 0;

                if (aspectRatio > 1) {
                    drawHeight = size.width / aspectRatio;
                    offsetY = (size.height - drawHeight) / 2;
                } else if (aspectRatio < 1) {
                    drawWidth = size.height * aspectRatio;
                    offsetX = (size.width - drawWidth) / 2;
                }

                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

                const format = size.format === 'ico' ? 'image/png' : 'image/png';
                canvas.toBlob((blob) => {
                    const asset = {
                        blob: blob,
                        filename: size.filename,
                        size: size,
                        url: canvas.toDataURL('image/png', 1.0)
                    };

                    generatedAssets.push(asset);
                    createSizeCard(asset);

                    completed++;
                    if (completed === allAssetSizes.length) {
                        loading.style.display = 'none';
                        controlsSection.style.display = 'block';
                        previewSection.style.display = 'block';
                        statsBar.style.display = 'block';
                        filterAssets('all');
                    }
                }, format, 1.0);
            });
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(originalFile);
}

function createSizeCard(asset) {
    const card = document.createElement('div');
    card.className = 'size-card selected';
    card.dataset.filename = asset.filename;
    card.dataset.platform = asset.size.platform;
    card.dataset.category = asset.size.category;

    const maxDisplaySize = 100;
    const minDisplaySize = 16;
    let displayWidth = Math.min(asset.size.width, maxDisplaySize);
    let displayHeight = Math.min(asset.size.height, maxDisplaySize);

    if (displayWidth < minDisplaySize) displayWidth = minDisplaySize;
    if (displayHeight < minDisplaySize) displayHeight = minDisplaySize;

    card.innerHTML = `
        <div class="card-checkbox" onclick="event.stopPropagation(); toggleAssetSelection('${asset.filename}', this.parentElement)">
            ✓
        </div>
        <div class="size-title">
            ${asset.size.icon} ${asset.size.name}
            <span class="size-badge">${asset.size.platform}</span>
        </div>
        <div class="size-info">
            <p><strong>Dimensions:</strong> ${asset.size.width} × ${asset.size.height}px</p>
            <p><strong>Filename:</strong> ${asset.size.filename}</p>
            <p><strong>Best for:</strong> ${asset.size.usage}</p>
        </div>
        <div class="preview-container">
            <img src="${asset.url}" class="preview-image" 
                 style="width: ${displayWidth}px; height: ${displayHeight}px; object-fit: contain;"
                 alt="${asset.size.name}">
        </div>
        <button class="download-btn" onclick="downloadAsset('${asset.filename}')">
            💾 Download Asset
        </button>
    `;

    card.addEventListener('click', (e) => {
        if (e.target.classList.contains('download-btn') || e.target.classList.contains('card-checkbox')) {
            return;
        }
        toggleAssetSelection(asset.filename, card);
    });

    sizesGrid.appendChild(card);
}

function downloadAsset(filename) {
    const asset = generatedAssets.find(a => a.filename === filename);
    if (asset) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(asset.blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);

        const button = event.target;
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }
}

async function downloadSelected() {
    const selectedCards = document.querySelectorAll('.size-card.visible.selected');
    if (selectedCards.length === 0) {
        showError('Please select at least one asset to download.');
        return;
    }

    const button = event.target;
    const originalText = button.innerHTML;
    button.disabled = true;
    button.innerHTML = '⏳ Creating ZIP...';

    if (typeof JSZip === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
        script.onload = () => createZipAndDownload(button, originalText, selectedCards);
        document.head.appendChild(script);
    } else {
        createZipAndDownload(button, originalText, selectedCards);
    }
}

function createZipAndDownload(button, originalText, selectedCards) {
    const zip = new JSZip();
    const selectedFilenames = Array.from(selectedCards).map(card => card.dataset.filename);

    selectedFilenames.forEach(filename => {
        const asset = generatedAssets.find(a => a.filename === filename);
        if (asset) {
            zip.file(asset.filename, asset.blob);
        }
    });

    zip.generateAsync({ type: 'blob' }).then(content => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);

        let zipName = 'logocraft-assets';
        if (currentFilter !== 'all') {
            zipName += `-${currentFilter}`;
        }
        zipName += '.zip';

        link.download = zipName;
        link.click();
        URL.revokeObjectURL(link.href);

        button.disabled = false;
        button.innerHTML = originalText;
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();

    const header = document.querySelector('.header');
    header.style.transform = 'translateY(-20px)';
    header.style.opacity = '0';

    setTimeout(() => {
        header.style.transition = 'all 0.6s ease';
        header.style.transform = 'translateY(0)';
        header.style.opacity = '1';
    }, 100);
});
