document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Tạo hiệu ứng Hạt Bong bóng/Pháo giấy
    const particlesContainer = document.getElementById('particles');
    const particleCount = 40; 
    const colors = ['#ff6b9e', '#4a90e2', '#ffffff', '#ffb6c1', '#a1c4fd'];
    
    if (particlesContainer) {
        for(let i = 0; i < particleCount; i++) {
            let particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.animationDuration = (Math.random() * 6 + 6) + 's';
            particle.style.animationDelay = Math.random() * 5 + 's';
            
            let size = Math.random() * 8 + 4;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            if(Math.random() > 0.5) {
                particle.style.borderRadius = '0';
            }
            
            particlesContainer.appendChild(particle);
        }
    }

    // 2. Logic Mở Bì Thư
    const openBtn = document.getElementById('open-btn');
    const envelopeWrapper = document.getElementById('envelope');
    const envelopeScreen = document.getElementById('envelope-screen');
    const mainContent = document.getElementById('main-content');
    const bgMusic = document.getElementById('bgMusic');
    const musicWidget = document.getElementById('music-control-widget');
    const clickHint = document.querySelector('.click-hint');

    const triggerOpen = () => {
        if (!envelopeWrapper || envelopeWrapper.classList.contains('open')) return;
        
        // Nhịp 1: Kích hoạt mở nắp (0s) -> Lá thư tự rút lên sau (0.35s)
        envelopeWrapper.classList.add('open');
        if (clickHint) clickHint.style.opacity = '0'; // Ẩn dòng chữ gợi ý

        // Nhịp 2: Đợi lá thư rút lên hoàn toàn (1.3s)
        setTimeout(() => {
            if (envelopeScreen) {
                envelopeScreen.style.opacity = '0';
                envelopeScreen.style.transform = 'translateY(-20px)';
            }
        }, 1300);

        // Nhịp 3: Hiện giao diện trang chính (2.0s)
        setTimeout(() => {
            if (envelopeScreen) envelopeScreen.style.display = 'none';
            if (mainContent) mainContent.style.display = 'block';
            if (musicWidget) musicWidget.style.display = 'flex';

            reveal(); 
            
            playTrack(1); // Phát bài đầu tiên
        }, 2000);
    };

    if (openBtn) openBtn.addEventListener('click', triggerOpen);
    if (envelopeWrapper) envelopeWrapper.addEventListener('click', triggerOpen);

    // 3. Logic Đếm Ngược (Target: 14/11/2026 17:00:00)
    const countDownDate = new Date("Nov 14, 2026 17:00:00").getTime();

    const timer = setInterval(function() {
        const now = new Date().getTime();
        const distance = countDownDate - now;

        const countdownSection = document.getElementById("countdown-section");
        if (distance < 0) {
            clearInterval(timer);
            if (countdownSection) {
                countdownSection.innerHTML = "<h2 class='countdown-title'>Sự kiện đang diễn ra! 🎉</h2>";
            }
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl = document.getElementById("days");
        const hoursEl = document.getElementById("hours");
        const minutesEl = document.getElementById("minutes");
        const secondsEl = document.getElementById("seconds");

        if (daysEl) daysEl.innerText = days < 10 ? '0' + days : days;
        if (hoursEl) hoursEl.innerText = hours < 10 ? '0' + hours : hours;
        if (minutesEl) minutesEl.innerText = minutes < 10 ? '0' + minutes : minutes;
        if (secondsEl) secondsEl.innerText = seconds < 10 ? '0' + seconds : seconds;
    }, 1000);

    // 4. Logic Scroll Animation (Reveal)
    function reveal() {
        var reveals = document.querySelectorAll(".reveal");
        for (var i = 0; i < reveals.length; i++) {
            var windowHeight = window.innerHeight;
            var elementTop = reveals[i].getBoundingClientRect().top;
            var elementVisible = 80;
            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add("active");
            }
        }
    }
    window.addEventListener("scroll", reveal);

   // 5. Logic Danh Sách Nhạc (Playlist + Nút Chuyển Bài + Tự động phát bài tiếp)
    const playlist = [
        'assets/audio/bai_1.mp3',
        'assets/audio/bai_2.mp3',
        'assets/audio/bai_3.mp3'
    ];
    
    let currentTrackIndex = 0;
    const muteBtn = document.getElementById('mute-btn');
    const nextBtn = document.getElementById('next-btn');

    function playTrack(index) {
        if (!bgMusic || playlist.length === 0) return;
        currentTrackIndex = index % playlist.length;
        bgMusic.src = playlist[currentTrackIndex];
        bgMusic.volume = 0.5;
        bgMusic.play().then(() => {
            if (muteBtn) muteBtn.innerHTML = '🔊';
        }).catch(e => console.log("Cần tương tác người dùng để phát nhạc"));
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
            playTrack(currentTrackIndex);
        });
    }

    if (bgMusic) {
        bgMusic.addEventListener('ended', () => {
            currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
            playTrack(currentTrackIndex);
        });
    }

    if (muteBtn && bgMusic) {
        muteBtn.addEventListener('click', () => {
            if (bgMusic.paused) {
                if (!bgMusic.src || bgMusic.src === '' || bgMusic.src.endsWith('/')) {
                    playTrack(0);
                } else {
                    bgMusic.play();
                    muteBtn.innerHTML = '🔊';
                }
            } else {
                bgMusic.pause();
                muteBtn.innerHTML = '🔇';
            }
        });
    }

    // Trong hàm triggerOpen (Logic mở bì thư), sửa dóng hiện nút thành:
    // if (musicWidget) musicWidget.style.display = 'flex';
    // playTrack(0); // Phát bài đầu tiên

    // 6. Logic Custom Select Dropdown
    const customSelect = document.getElementById('custom-select');
    if (customSelect) {
        const trigger = customSelect.querySelector('.custom-select-trigger');
        const options = customSelect.querySelectorAll('.custom-option');
        const hiddenInput = document.getElementById('attendance');

        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            customSelect.classList.toggle('open');
        });

        options.forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                trigger.textContent = this.textContent;
                
                options.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                
                if (hiddenInput) {
                    hiddenInput.value = this.getAttribute('data-value');
                }
                
                customSelect.classList.remove('open');
            });
        });

        window.addEventListener('click', function(e) {
            if (!customSelect.contains(e.target)) {
                customSelect.classList.remove('open');
            }
        });
    }

    // 7. Logic Gửi Form Ngầm về Google Sheets & Hiển thị Popup
    const rsvpForm = document.getElementById('custom-rsvp-form');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // Logic đóng popup
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            successModal.classList.remove('show');
        });
    }

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = document.getElementById('submit-btn');
            if (submitBtn) {
                submitBtn.innerText = 'Đang gửi...';
                submitBtn.disabled = true;
            }

            const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfq4UsZdYhwVgXOCW5QkORH-LXNPUuZSa7BwPGQcm_26UMcBA/formResponse';
            const formData = new FormData(rsvpForm);

            fetch(googleFormUrl, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            })
            .then(() => {
                // Thay thế alert() bằng cách hiển thị Popup đẹp mắt
                if (successModal) {
                    successModal.classList.add('show');
                }
                
                // Reset form sau khi gửi
                rsvpForm.reset();
                
                // Khôi phục nút bấm để có thể gửi lại
                if (submitBtn) {
                    submitBtn.innerText = 'Gửi Xác Nhận';
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }

                // Trả Select Dropdown giả về trạng thái mặc định
                const customSelectTrigger = document.querySelector('.custom-select-trigger');
                const defaultOption = document.querySelector('.custom-option');
                if (customSelectTrigger && defaultOption) {
                    customSelectTrigger.textContent = defaultOption.textContent;
                    document.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
                    defaultOption.classList.add('selected');
                }
            })
            .catch(error => {
                console.error('Lỗi khi gửi form:', error);
                alert('Có lỗi xảy ra, vui lòng thử lại sau nhé!');
                if (submitBtn) {
                    submitBtn.innerText = 'Gửi Xác Nhận';
                    submitBtn.disabled = false;
                }
            });
        });
    }
});