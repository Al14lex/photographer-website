// Handle the download button
document.getElementById('downloadBtn').addEventListener('click', function() {
    // Simulate downloading photos
    alert('Photos are downloading...');
    
    // After download, show feedback modal
    document.getElementById('feedbackModal').style.display = 'flex';
});

// Handle closing the modal
document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('feedbackModal').style.display = 'none';
});

// Close modal when clicking outside of it
window.addEventListener('click', function(event) {
    if (event.target == document.getElementById('feedbackModal')) {
        document.getElementById('feedbackModal').style.display = 'none';
    }
});
