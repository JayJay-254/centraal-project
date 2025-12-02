// Profile image client-side preview
document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('editProfilePicture');
    const preview = document.getElementById('editImagePreview');

    if (!input || !preview) return;

    input.addEventListener('change', function (e) {
        preview.innerHTML = '';
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            preview.textContent = 'Selected file is not an image.';
            return;
        }
        const img = document.createElement('img');
        img.className = 'profile-img preview-img';
        img.alt = 'Selected profile image';
        const reader = new FileReader();
        reader.onload = function (ev) {
            img.src = ev.target.result;
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
});
