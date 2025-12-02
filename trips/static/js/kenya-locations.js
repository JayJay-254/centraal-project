// Kenya locations dynamic dropdown handler
document.addEventListener('DOMContentLoaded', function () {
    const countySelect = document.getElementById('editCounty') || document.getElementById('county');
    const constituencySelect = document.getElementById('editConstituency') || document.getElementById('constituency');

    if (!countySelect || !constituencySelect) {
        console.log('Location dropdowns not found on this page');
        return;
    }

    // Load counties on page load
    loadCounties();

    // Load constituencies when county changes
    countySelect.addEventListener('change', function () {
        const county = this.value;
        if (county) {
            loadConstituencies(county);
        } else {
            constituencySelect.innerHTML = '<option value="">Select your constituency</option>';
        }
    });

    function loadCounties() {
        fetch('/api/counties/')
            .then(response => response.json())
            .then(data => {
                const counties = data.counties || [];
                const currentCounty = countySelect.value;
                countySelect.innerHTML = '<option value="">Select your county</option>';
                counties.forEach(county => {
                    const option = document.createElement('option');
                    option.value = county;
                    option.textContent = county;
                    if (county === currentCounty) {
                        option.selected = true;
                    }
                    countySelect.appendChild(option);
                });
                // If a county was pre-selected, load its constituencies
                if (currentCounty) {
                    loadConstituencies(currentCounty);
                }
            })
            .catch(error => console.error('Error loading counties:', error));
    }

    function loadConstituencies(county) {
        fetch(`/api/constituencies/?county=${encodeURIComponent(county)}`)
            .then(response => response.json())
            .then(data => {
                const constituencies = data.constituencies || [];
                const currentConstituency = constituencySelect.value;
                constituencySelect.innerHTML = '<option value="">Select your constituency</option>';
                constituencies.forEach(constituency => {
                    const option = document.createElement('option');
                    option.value = constituency;
                    option.textContent = constituency;
                    if (constituency === currentConstituency) {
                        option.selected = true;
                    }
                    constituencySelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error loading constituencies:', error));
    }
});
