// ===== 전역 변수 =====
let originalImage = null;
let currentImage = null;
let canvas = null;
let ctx = null;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let imageX = 0;
let imageY = 0;

// 설정 값
let settings = {
    size: '3x4',
    bgColor: '#FFFFFF',
    scale: 1.0,
    brightness: 1.0,
    dpi: 300
};

// 사이즈 정의 (cm to pixels at 300 DPI)
const photoSizes = {
    '3x4': { width: 354, height: 472, name: '3×4 cm' },
    '3.5x4.5': { width: 413, height: 531, name: '3.5×4.5 cm' },
    '4x5': { width: 472, height: 590, name: '4×5 cm' },
    '5x7': { width: 590, height: 827, name: '5×7 cm' }
};

// ===== 초기화 =====
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    attachEventListeners();
});

function initializeElements() {
    canvas = document.getElementById('previewCanvas');
    ctx = canvas.getContext('2d');

    // 초기 캔버스 크기 설정
    updateCanvasSize();
}

function attachEventListeners() {
    // 업로드 버튼 클릭
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadCard = document.querySelector('.upload-card');
    const imageInput = document.getElementById('imageInput');

    uploadBtn.addEventListener('click', () => imageInput.click());
    uploadCard.addEventListener('click', () => imageInput.click());

    // 파일 선택
    imageInput.addEventListener('change', handleFileSelect);

    // 드래그 앤 드롭
    uploadCard.addEventListener('dragover', handleDragOver);
    uploadCard.addEventListener('drop', handleDrop);

    // 사이즈 버튼
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            settings.size = btn.dataset.size;
            updateCanvasSize();
            if (currentImage) {
                renderImage();
            }
            updateOutputSizeDisplay();
        });
    });

    // 색상 버튼
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            settings.bgColor = btn.dataset.color;
            if (currentImage) {
                renderImage();
            }
        });
    });

    // 슬라이더
    const scaleSlider = document.getElementById('scaleSlider');
    const brightnessSlider = document.getElementById('brightnessSlider');
    const scaleValue = document.getElementById('scaleValue');
    const brightnessValue = document.getElementById('brightnessValue');

    scaleSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        scaleValue.textContent = value;
        settings.scale = value / 100;
        if (currentImage) {
            renderImage();
        }
    });

    brightnessSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        brightnessValue.textContent = value;
        settings.brightness = value / 100;
        if (currentImage) {
            renderImage();
        }
    });

    // 캔버스 드래그
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);

    // 터치 이벤트
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);

    // 액션 버튼
    document.getElementById('resetBtn').addEventListener('click', resetSettings);
    document.getElementById('downloadBtn').addEventListener('click', downloadImage);
    document.getElementById('reuploadBtn').addEventListener('click', () => {
        imageInput.click();
    });
}

// ===== 파일 처리 =====
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        loadImage(file);
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        loadImage(file);
    }
}

function loadImage(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            originalImage = img;
            currentImage = img;
            imageX = 0;
            imageY = 0;

            // 섹션 전환
            document.getElementById('uploadSection').style.display = 'none';
            document.getElementById('editorSection').style.display = 'block';

            // 이미지 렌더링
            renderImage();
        };
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
}

// ===== 캔버스 업데이트 =====
function updateCanvasSize() {
    const size = photoSizes[settings.size];
    canvas.width = size.width;
    canvas.height = size.height;
}

function renderImage() {
    if (!currentImage) return;

    const size = photoSizes[settings.size];

    // 배경 색상
    ctx.fillStyle = settings.bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 이미지 크기 계산
    const scale = settings.scale;
    const imgWidth = currentImage.width * scale;
    const imgHeight = currentImage.height * scale;

    // 초기 중앙 정렬 (첫 로드 시)
    if (imageX === 0 && imageY === 0) {
        imageX = (canvas.width - imgWidth) / 2;
        imageY = (canvas.height - imgHeight) / 2;
    }

    // 이미지 그리기
    ctx.save();

    // 밝기 조절
    if (settings.brightness !== 1.0) {
        const brightness = settings.brightness;
        ctx.filter = `brightness(${brightness})`;
    }

    ctx.drawImage(currentImage, imageX, imageY, imgWidth, imgHeight);
    ctx.restore();
}

// ===== 드래그 기능 =====
function handleMouseDown(e) {
    isDragging = true;
    const rect = canvas.getBoundingClientRect();
    dragStartX = e.clientX - rect.left;
    dragStartY = e.clientY - rect.top;
}

function handleMouseMove(e) {
    if (!isDragging) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const deltaX = mouseX - dragStartX;
    const deltaY = mouseY - dragStartY;

    imageX += deltaX;
    imageY += deltaY;

    dragStartX = mouseX;
    dragStartY = mouseY;

    renderImage();
}

function handleMouseUp() {
    isDragging = false;
}

// 터치 이벤트
function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    isDragging = true;
    dragStartX = touch.clientX - rect.left;
    dragStartY = touch.clientY - rect.top;
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!isDragging) return;

    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;

    const deltaX = touchX - dragStartX;
    const deltaY = touchY - dragStartY;

    imageX += deltaX;
    imageY += deltaY;

    dragStartX = touchX;
    dragStartY = touchY;

    renderImage();
}

function handleTouchEnd(e) {
    e.preventDefault();
    isDragging = false;
}

// ===== 설정 초기화 =====
function resetSettings() {
    settings.scale = 1.0;
    settings.brightness = 1.0;
    imageX = 0;
    imageY = 0;

    document.getElementById('scaleSlider').value = 100;
    document.getElementById('brightnessSlider').value = 100;
    document.getElementById('scaleValue').textContent = '100';
    document.getElementById('brightnessValue').textContent = '100';

    renderImage();
}

// ===== 다운로드 =====
function downloadImage() {
    if (!currentImage) return;

    // 고해상도 캔버스 생성
    const downloadCanvas = document.createElement('canvas');
    const downloadCtx = downloadCanvas.getContext('2d');
    const size = photoSizes[settings.size];

    downloadCanvas.width = size.width;
    downloadCanvas.height = size.height;

    // 배경 색상
    downloadCtx.fillStyle = settings.bgColor;
    downloadCtx.fillRect(0, 0, downloadCanvas.width, downloadCanvas.height);

    // 이미지 그리기
    const scale = settings.scale;
    const imgWidth = currentImage.width * scale;
    const imgHeight = currentImage.height * scale;

    downloadCtx.save();

    // 밝기 조절
    if (settings.brightness !== 1.0) {
        downloadCtx.filter = `brightness(${settings.brightness})`;
    }

    downloadCtx.drawImage(currentImage, imageX, imageY, imgWidth, imgHeight);
    downloadCtx.restore();

    // 다운로드
    downloadCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `증명사진_${settings.size}_${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // 다운로드 완료 알림 (선택사항)
        showNotification('사진이 다운로드되었습니다!');
    }, 'image/png');
}

// ===== UI 업데이트 =====
function updateOutputSizeDisplay() {
    const sizeDisplay = document.getElementById('outputSize');
    sizeDisplay.textContent = photoSizes[settings.size].name;
}

// ===== 알림 표시 (선택사항) =====
function showNotification(message) {
    // 간단한 알림 구현
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: rgba(255, 255, 255, 0.95);
        color: #333;
        padding: 1rem 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 알림 애니메이션 CSS 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== 배경 제거 기능 (향후 추가 가능) =====
// 실제 배경 제거는 서버 API 또는 ML 모델이 필요합니다.
// 여기서는 기본 기능만 구현했습니다.

// 초기 출력 크기 표시
updateOutputSizeDisplay();
